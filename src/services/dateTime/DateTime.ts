import { computed, observable } from 'mobx'

import { DateInterface } from './DateTime.interface'
import SimpleDate from './SimpleDate'
import Time from './Time'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { transformToDb } from '../db/decorators/transformToDb.decorator'
import { transformToApp } from '../db/decorators/transformToApp.decorator'

class DateTime implements DateInterface {
  @observable
  date: SimpleDate = null

  @observable
  time: Time = null

  @computed
  get year() {
    return this.date.year
  }

  @computed
  get month() {
    return this.date.month
  }

  @computed
  get week() {
    return this.date.week
  }

  @computed
  get day() {
    return this.date.day
  }

  @computed
  get hours() {
    return this.time.hours
  }

  @computed
  get minutes() {
    return this.time.minutes
  }

  @computed
  get seconds() {
    return this.time.seconds
  }

  @transformToApp()
  static toApp(obj: Partial<firebase.firestore.Timestamp>) {
    const timestamp = new firebase.firestore.Timestamp(
      obj.seconds,
      obj.nanoseconds,
    )
    if (obj) {
      return DateTime.createFromFirestoreTimestamp(timestamp)
    }
  }

  @transformToDb()
  static toDb(obj: DateTime) {
    if (obj) {
      return obj.toDate()
    }
  }

  static create(date?: SimpleDate, time?: Time) {
    const dateTime = new DateTime()
    dateTime.date = date
      ? SimpleDate.create(date.year, date.month, date.day)
      : SimpleDate.create()
    dateTime.time = time
      ? Time.create(time.hours, time.minutes, time.seconds)
      : Time.createNow()
    return dateTime
  }

  static createFromDate = (date: Date): DateTime => {
    const simpleDate = SimpleDate.createFromDate(date)
    const time = Time.createFromDate(date)
    return DateTime.create(simpleDate, time)
  }

  static createFromFirestoreTimestamp = (
    timestamp: firebase.firestore.Timestamp,
  ): DateTime => {
    const simpleDate = SimpleDate.createFromFirestoreTimestamp(timestamp)
    const time = Time.createFromFirestoreTimestamp(timestamp)
    return DateTime.create(simpleDate, time)
  }

  get = (field: string) => {
    return this[field]
  }

  toDate = (): Date => {
    return new Date(
      this.date.year,
      this.date.month - 1,
      this.date.day,
      this.time.hours,
      this.time.minutes,
      this.time.seconds,
    )
  }

  compareTo = (compareToDate: DateTime): number => {
    if (!compareToDate) {
      return null
    }

    const thisTimestamp = this.toDate().getTime()
    const compareTimestamp = compareToDate.toDate().getTime()

    return thisTimestamp === compareTimestamp
      ? 0
      : thisTimestamp > compareTimestamp
      ? 1
      : -1
  }

  before = (compareToDate: DateTime): boolean => {
    return this.compareTo(compareToDate) < 0
  }

  beforeOrEquals = (compareToDate: DateTime): boolean => {
    return this.compareTo(compareToDate) <= 0
  }

  after = (compareToDate: DateTime): boolean => {
    return this.compareTo(compareToDate) > 0
  }

  afterOrEquals = (compareToDate: DateTime): boolean => {
    return this.compareTo(compareToDate) >= 0
  }

  equals = (compareToDate: DateTime): any => {
    return this.compareTo(compareToDate) === 0
  }

  toString = (dateFormat?: string) => {
    return `${this.date.toString(dateFormat)} ${this.time.toString()}`
  }

  clone = () => {
    return DateTime.create(
      SimpleDate.create(this.year, this.month, this.day),
      Time.create(this.hours, this.minutes, this.seconds),
    )
  }
}

export default DateTime
