import { observable } from 'mobx'

import DateTimeInterface from './DateTime.interface'
import Hour from './Hour'
import Minute from './Minute'
import Second from './Second'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import NumberUtils from '../utils/NumberUtils'
import { transformToDb } from '../db/decorators/transformToDb.decorator'
import { transformToApp } from '../db/decorators/transformToApp.decorator'

class Time implements DateTimeInterface {
  @observable
  hours: Hour = null

  @observable
  minutes: Minute = null

  @observable
  seconds: Second = null

  @transformToDb()
  toDb(obj: Time) {
    if (obj) {
      return obj.toDate()
    }
  }

  @transformToApp()
  static toApp(obj: Partial<firebase.firestore.Timestamp>) {
    const timestamp = new firebase.firestore.Timestamp(
      obj.seconds,
      obj.nanoseconds,
    )
    if (obj) {
      return Time.createFromFirestoreTimestamp(timestamp)
    }
  }

  constructor(hours?: Hour, minutes?: Minute, seconds?: Second) {
    const now = new Date()
    this.hours = hours !== undefined ? hours : (now.getHours() as Hour)
    this.minutes =
      minutes !== undefined ? minutes : (now.getMinutes() as Minute)
    this.seconds =
      seconds !== undefined ? seconds : (now.getMinutes() as Minute)
  }

  static create = (
    hour: Hour = 0,
    minute: Minute = 0,
    seconds: Second = 0,
  ): Time => {
    return new Time(hour, minute, seconds)
  }

  static createNow = (): Time => {
    return Time.createFromDate(new Date())
  }

  static createFromDate = (date: Date): Time => {
    const a = new Time(
      date.getHours() as Hour,
      date.getMinutes() as Minute,
      date.getSeconds() as Second,
    )
    return a
  }

  static createFromFirestoreTimestamp(timestamp: firebase.firestore.Timestamp) {
    return Time.createFromDate(timestamp.toDate())
  }

  static getHoursList = (): Hour[] => {
    return NumberUtils.getRange(24) as Hour[]
  }

  static getMinutesList = (): Minute[] => {
    return NumberUtils.getRange(60) as Minute[]
  }

  get = (field: string) => {
    return this[field]
  }

  toDate = (): Date => {
    const date = new Date(0)
    date.setHours(this.hours)
    date.setMinutes(this.minutes)
    return date
  }

  toString = (): string => {
    const date = new Date()

    date.setHours(this.hours, this.minutes, this.seconds)

    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()

    return `${date.getHours()}:${minutes}`
  }

  toDecimal(): number {
    const hours = this.hours
    const minutes = this.minutes / 60
    return hours + minutes
  }

  compareTo = (time: Time) => {
    const thisTimestamp = this.toDate().getTime()
    const compareTimestamp = time.toDate().getTime()
    return thisTimestamp === compareTimestamp
      ? 0
      : thisTimestamp > compareTimestamp
      ? 1
      : -1
  }

  before = (compareTo: Time): boolean => {
    return this.compareTo(compareTo) < 0
  }

  beforeOrEquals = (compareTo: Time): boolean => {
    return this.compareTo(compareTo) <= 0
  }

  after = (compareTo: Time): boolean => {
    return this.compareTo(compareTo) > 0
  }

  afterOrEquals = (compareTo: Time): boolean => {
    return this.compareTo(compareTo) >= 0
  }

  equals = (compareTo: Time): any => {
    return this.compareTo(compareTo) === 0
  }

  clone = () => {
    return Time.create(this.hours, this.minutes)
  }
}

export default Time
