import dayjs from 'dayjs'

import { DateInterface } from './DateTime.interface'
import Month from './Month'
import SimpleDate from './SimpleDate'
import Year from './Year'
import { isNil } from 'lodash'
import { observable } from 'mobx'
import { field } from '../../services/db/decorators/field.decorator'

class YearMonth implements DateInterface {
  @field()
  @observable
  year: Year

  @field()
  @observable
  month: Month

  static DEFAULT_FORMAT = 'YYYY-MM'
  static TEXT_FORMAT = 'MMMM Y'

  constructor(year: Year, month: Month) {
    this.year = year
    this.month = month
  }

  static create(year?: Year, month?: Month) {
    let thisYear: Year
    let thisMonth: Month
    if (isNil(year) || isNil(month)) {
      const simpleDate = SimpleDate.create()
      thisYear = isNil(year) && simpleDate.year
      thisMonth = isNil(month) && simpleDate.month
    }
    return new YearMonth(
      isNil(year) ? thisYear : year,
      isNil(month) ? thisMonth : month,
    )
  }

  static createFromDate(date: Date) {
    return new YearMonth(date.getFullYear(), (date.getMonth() + 1) as Month)
  }

  get = (field: string) => {
    return this[field]
  }

  toDate = () => {
    return this.asSimpleDate().toDate()
  }

  toString = (format: string = YearMonth.DEFAULT_FORMAT) => {
    return dayjs(this.toDate()).format(format)
  }

  compareTo = (compareToDate: YearMonth) => {
    return this.asSimpleDate().compareTo(this.asSimpleDate(compareToDate))
  }

  before = (compareToDate: YearMonth) => {
    return this.asSimpleDate().before(this.asSimpleDate(compareToDate))
  }

  beforeOrEquals = (compareToDate: YearMonth) => {
    return this.asSimpleDate().beforeOrEquals(this.asSimpleDate(compareToDate))
  }

  after = (compareToDate: YearMonth) => {
    return this.asSimpleDate().after(this.asSimpleDate(compareToDate))
  }

  afterOrEquals = (compareToDate: YearMonth) => {
    return this.asSimpleDate().afterOrEquals(this.asSimpleDate(compareToDate))
  }

  equals = (compareToDate: YearMonth) => {
    return this.asSimpleDate().equals(this.asSimpleDate(compareToDate))
  }

  clone = (): YearMonth => {
    return YearMonth.create(this.year, this.month)
  }

  private asSimpleDate = (yearMonth: YearMonth = this) => {
    return SimpleDate.create(yearMonth.year, yearMonth.month, 1)
  }
}

export default YearMonth
