import dayjs from 'dayjs'
import { computed, observable } from 'mobx'

import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { DateInterface } from './DateTime.interface'
import Day from './Day'
import Month from './Month'
import Week from './Week'
import Weekday from './Weekday'
import Year from './Year'
import { transformToDb } from '../db/decorators/transformToDb.decorator'
import { transformToApp } from '../db/decorators/transformToApp.decorator'

class SimpleDate implements DateInterface {
  @observable
  year: Year = null

  @observable
  month: Month = null

  @observable
  week: Week = null

  @observable
  day: Day = null

  @computed
  get weekday(): Weekday {
    const dayjsDate = dayjs(this.toDate())
    return Object.values(Weekday)[dayjsDate.weekday()]
  }

  static DEFAULT_FORMAT = 'YYYY-MM-DD'
  static TEXT_FORMAT = 'dddd Do MMMM Y'

  @transformToDb()
  toDb(obj: SimpleDate) {
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
      return SimpleDate.createFromFirestoreTimestamp(timestamp)
    }
  }

  constructor(year?: Year, month?: Month, day?: Day) {
    this.year = year
    this.month = month
    this.day = day
  }

  static clone = (simpleDate: SimpleDate): SimpleDate => {
    return new SimpleDate(simpleDate.year, simpleDate.month, simpleDate.day)
  }

  static create = (year?: Year, month?: Month, day?: Day): SimpleDate => {
    if (!year || !month || !day) {
      const date = new Date()
      year = year || date.getFullYear()
      month = month || ((date.getMonth() + 1) as Month)
      day = day || (date.getDate() as Day)
    }
    return new SimpleDate(year, month, day)
  }

  static createFromDate = (date: Date): SimpleDate => {
    const simpleDate = new SimpleDate()
    simpleDate.year = date.getFullYear()
    simpleDate.month = (date.getMonth() + 1) as Month
    simpleDate.day = date.getDate() as Day
    const dayjsDate = dayjs(date)
    simpleDate.week = dayjsDate.week() as Week
    return simpleDate
  }

  static createFromFirestoreTimestamp = (
    timestamp: firebase.firestore.Timestamp,
  ): SimpleDate => {
    const simpleDate = SimpleDate.createFromDate(timestamp.toDate())
    return simpleDate
  }

  get = (field: string) => {
    return this[field]
  }

  toDate = (): Date => {
    return new Date(this.year, this.month - 1, this.day)
  }

  toString = (format: string = SimpleDate.DEFAULT_FORMAT): string => {
    return dayjs(this.toDate()).format(format)
  }

  toTimestamp = (): number => {
    return this.toDate().getTime()
  }

  compareTo = (compareToDate: SimpleDate): number => {
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

  before = (compareToDate: SimpleDate): boolean => {
    return this.compareTo(compareToDate) < 0
  }

  beforeOrEquals = (compareToDate: SimpleDate): boolean => {
    return this.compareTo(compareToDate) <= 0
  }

  after = (compareToDate: SimpleDate): boolean => {
    return this.compareTo(compareToDate) > 0
  }

  afterOrEquals = (compareToDate: SimpleDate): boolean => {
    return this.compareTo(compareToDate) >= 0
  }

  equals = (compareToDate: SimpleDate): any => {
    return this.compareTo(compareToDate) === 0
  }

  clone = () => {
    return SimpleDate.create(this.year, this.month, this.day)
  }
}

export default SimpleDate
