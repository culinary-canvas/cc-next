import dayjs, {Dayjs, OpUnitType} from 'dayjs'
import 'dayjs/locale/en-gb'
import 'dayjs/locale/sv'
import advancedFormatPlugin from 'dayjs/plugin/advancedFormat'
import calendarPlugin from 'dayjs/plugin/calendar'
import updateLocalePlugin from 'dayjs/plugin/updateLocale'
import weekdayPlugin from 'dayjs/plugin/weekday'
import weekOfYearPlugin from 'dayjs/plugin/weekOfYear'
import memoize from 'memoized-class-decorator'

import Duration from '../duration/Duration'
import DurationType from '../duration/DurationType'
import DateTime from './DateTime'
import DateTimeInterface, {DateInterface, DateTimeClass,} from './DateTime.interface'
import Minute from './Minute'
import SimpleDate from './SimpleDate'
import Slot from './Slot'
import Time from './Time'
import Week from './Week'
import Weekday from './Weekday'
import Year from './Year'
import YearMonth from './YearMonth'
import InitTimer from "../utils/InitTimer"

dayjs.extend(advancedFormatPlugin)
dayjs.extend(weekOfYearPlugin)
dayjs.extend(weekdayPlugin)
dayjs.extend(calendarPlugin)
dayjs.extend(updateLocalePlugin)

class DateTimeService {
  static initialized = false

  readonly shortWeekdayNames: string[]
  readonly today: SimpleDate

  constructor() {
    this.today = SimpleDate.create()
  }

  /**
   *
   *
   * @memberof DateTimeService
   */
  init() {
    const initTimer = new InitTimer(this)
    if (!DateTimeService.initialized) {
      dayjs.locale('sv-se')
      DateTimeService.initialized = true
    }
    initTimer.done()
  }

  /**
   *
   *
   * @template T
   * @param {T} dateObject
   * @param {number} rollValue
   * @param {*} [durationType=DurationType.DAYS]
   * @returns {T}
   * @memberof DateTimeService
   */
  roll<T extends DateTimeInterface>(
    dateObject: T,
    rollValue: number,
    durationType = DurationType.DAYS,
  ): T {
    let dayjsDate = dayjs(dateObject.toDate())
    dayjsDate = dayjsDate.add(rollValue, this.getDayJsUnit(durationType))

    const ImplClass = this.getDateTimeClass<T>(dateObject)
    return ImplClass.createFromDate(dayjsDate.toDate())
  }

  /**
   *
   *
   * @template T
   * @param {T} [dateObject=SimpleDate.create() as any]
   * @returns {Weekday}
   * @memberof DateTimeService
   */
  getWeekday<T extends DateTime | SimpleDate>(
    dateObject: T = SimpleDate.create() as any,
  ): Weekday {
    const dayjsDate = dayjs(dateObject.toDate())
    return Object.values(Weekday)[dayjsDate.weekday()]
  }

  /**
   *
   *
   * @template T
   * @param {T} [dateOrMonth=SimpleDate.create() as any]
   * @returns {T[]}
   * @memberof DateTimeService
   */
  @memoize
  getMonthDates<T extends DateInterface>(
    dateOrMonth: T = SimpleDate.create() as any,
  ): SimpleDate[] {
    let year
    let month

    if (typeof dateOrMonth === 'number') {
      month = dateOrMonth
      year = SimpleDate.create().year
    } else {
      month = dateOrMonth.get('month')
      year = dateOrMonth.get('year')
    }

    const startDate = SimpleDate.create(year, month, 1)

    return this.getRolling(startDate, date => {
      return date.month !== month
    }) as any[]
  }

  /**
   *
   *
   * @template T
   * @param {T} startDate
   * @param {Weekday[]} weekdays
   * @param {T} endDate
   * @returns {T[]}
   * @memberof DateTimeService
   */
  getDatesByWeekdays<T extends DateTime | SimpleDate>(
    startDate: T,
    weekdays: Weekday[],
    endDate: T,
  ): T[] {
    const dates = this.getRolling(startDate as any, date => date.after(endDate))
    return dates.filter(date => this.isInWeekdays(date, weekdays))
  }

  /**
   *
   *
   * @template T
   * @param {T} startDate
   * @param {(tempus: T) => boolean} stopWhen
   * @returns {T[]}
   * @memberof DateTimeService
   */
  getRolling<T extends DateTimeInterface>(
    startDate: T,
    stopWhen: (tempus: T, i: number) => boolean,
    durationType = DurationType.DAYS,
  ): T[] {
    const dates: T[] = []

    for (let i = 0; i <= 3650; i += 1) {
      const nextDate = this.roll(startDate, i, durationType)
      if (stopWhen(nextDate, i)) {
        break
      }
      dates.push(nextDate)
    }
    return dates
  }

  /**
   *
   *
   * @private
   * @template T
   * @param {T} dateObject
   * @returns {DateTimeClass<any>}
   * @memberof DateTimeService
   */
  private getDateTimeClass<T extends DateTimeInterface>(
    dateObject: T,
  ): DateTimeClass<T> {
    if (dateObject instanceof DateTime) {
      return DateTime as any
    } else if (dateObject instanceof SimpleDate) {
      return SimpleDate as any
    } else if (dateObject instanceof YearMonth) {
      return YearMonth as any
    } else {
      return Time as any
    }
  }

  /**
   *
   *
   * @template T
   * @param {T} date
   * @returns
   * @memberof DateTimeService
   */
  getYearMonth<T extends SimpleDate | DateTime>(date: T) {
    return YearMonth.create(date.year, date.month)
  }

  /**
   *
   *
   * @template T
   * @param {T} startDate
   * @param {T} endDate
   * @returns {T[]}
   * @memberof DateTimeService
   */
  getDatesBetween<T extends DateTimeInterface>(startDate: T, endDate: T): T[] {
    return this.getRolling(startDate, date => date.after(endDate))
  }

  /**
   *
   *
   * @template T
   * @param {T} start
   * @param {T} end
   * @param {DurationType} [durationType=DurationType.DAYS]
   * @returns {Duration}
   * @memberof DateTimeService
   */
  getDurationBetween<T extends DateTimeInterface>(
    start: T,
    end: T,
    durationType: DurationType = DurationType.DAYS,
  ): Duration {
    let startDateTime: DateTime
    let endDateTime: DateTime

    if (start instanceof SimpleDate) {
      startDateTime = DateTime.create(start)
    } else if (start instanceof Time) {
      startDateTime = DateTime.create(null, start)
    } else if (start instanceof DateTime) {
      startDateTime = start
    }

    if (end instanceof SimpleDate) {
      endDateTime = DateTime.create(end)
    } else if (end instanceof Time) {
      endDateTime = DateTime.create(null, end)
    } else if (end instanceof DateTime) {
      endDateTime = end
    }

    const startDayjs = this.getDayjs(startDateTime)
    const endDayjs = this.getDayjs(endDateTime)

    const unit = this.getDayJsUnit(durationType)
    const diff = parseInt(startDayjs.diff(endDayjs, unit).toFixed(0), 10)
    const duration = new Duration()
    duration.durationType = durationType
    duration.value = Math.abs(diff)
    return duration
  }

  /**
   *
   *
   * @private
   * @param {DurationType} durationType
   * @returns {unitOfTime.Diff}
   * @memberof DateTimeService
   */
  @memoize
  private getDayJsUnit(durationType: DurationType): OpUnitType {
    switch (durationType) {
      case DurationType.SECONDS:
        return 'second'
      case DurationType.MINUTES:
        return 'minute'
      case DurationType.HOURS:
        return 'hour'
      case DurationType.DAYS:
        return 'day'
      case DurationType.WEEKS:
        return 'week'
      case DurationType.MONTHS:
        return 'month'
      case DurationType.YEARS:
        return 'year'
    }
  }

  /**
   *
   *
   * @private
   * @param {DateInterface} date
   * @returns {Dayjs}
   * @memberof DateTimeService
   */
  private getDayjs<T extends DateInterface>(date: T): Dayjs {
    const theDayjs = dayjs(date.toDate())
    theDayjs.set('second', 0)
    theDayjs.set('millisecond', 0)
    return theDayjs
  }

  /**
   *
   *
   * @param {Weekday} weekday
   * @param {Year} year
   * @param {Week} week
   * @returns {SimpleDate}
   * @memberof DateTimeService
   */
  @memoize
  getDateByWeekday(weekday: Weekday, year: Year, week: Week): SimpleDate {
    const theDayJs = dayjs()
      .year(year)
      .week(week)
      .weekday(Object.values(Weekday).findIndex(w => w === weekday))

    return SimpleDate.createFromDate(theDayJs.toDate())
  }

  /**
   *
   *
   * @param {Weekday} weekday
   * @param {T} date
   * @returns {T}
   * @memberof DateTimeService
   */
  getDateForClosestUpcomingWeekday<T extends DateInterface>(
    weekday: Weekday,
    date: T = (SimpleDate.create() as unknown) as T,
  ): T {
    const today = this.getWeekday()
    const todayIndex = Object.values(Weekday).findIndex(day => day === today)
    const targetIndex = Object.values(Weekday).findIndex(day => day === weekday)

    const diff = targetIndex - todayIndex
    const rollValue = diff >= 0 ? diff : 7 + diff

    return this.roll(date, rollValue)
  }

  /**
   *
   *
   * @template T
   * @param {T} date
   * @returns {SimpleDate[]}
   * @memberof DateTimeService
   */
  @memoize
  getDatesInMonth<T extends DateInterface>(date: T): SimpleDate[] {
    return this.getDatesBetween(
      this.getFirstDateOfMonth(date),
      this.getLastDateOfMonth(date),
    )
  }

  /**
   *
   *
   * @template T
   * @param {T} [date=SimpleDate.create() as any]
   * @returns {SimpleDate}
   * @memberof DateTimeService
   */
  getFirstDateOfMonth<T extends DateInterface>(
    date: T = SimpleDate.create() as any,
  ): SimpleDate {
    return SimpleDate.create(date.year, date.month, 1)
  }

  /**
   *
   *
   * @template T
   * @param {T} [date=SimpleDate.create() as any]
   * @returns {SimpleDate}
   * @memberof DateTimeService
   */
  getLastDateOfMonth<T extends DateInterface>(
    date: T = SimpleDate.create() as any,
  ): SimpleDate {
    const firstDayNextMonth = this.roll(
      this.getFirstDateOfMonth(date),
      1,
      DurationType.MONTHS,
    )
    return this.roll(firstDayNextMonth, -1) as any
  }

  /**
   *
   *
   * @template T
   * @param {T} yearMonth
   * @returns
   * @memberof DateTimeService
   */
  getFirstAndLastDatesOfYearMonth<T extends DateInterface>(yearMonth: T) {
    const first = SimpleDate.create(yearMonth.year, yearMonth.month)
    const last = this.getLastDateOfMonth(first)
    return { first, last }
  }

  /**
   *
   *
   * @param {Time} start
   * @param {Time} end
   * @param {Minute} gap
   * @returns {Time[]}
   * @memberof DateTimeService
   */
  @memoize
  getTimePerMinuteGap(
    gap: Minute,
    start = Time.create(),
    end = Time.create(23, 59),
  ): Time[] {
    const dateTimes: DateTime[] = []
    dateTimes.push(
      DateTime.create(
        SimpleDate.create(),
        Time.create(start.hours, start.minutes),
      ),
    )

    while (true) {
      const dateTime = this.roll(
        dateTimes[dateTimes.length - 1],
        gap,
        DurationType.MINUTES,
      )
      if (
        dateTime.time.after(end) ||
        dateTime.date.day !== dateTimes[0].date.day
      ) {
        break
      }

      dateTimes.push(dateTime)
    }
    return dateTimes.map(d => d.time)
  }

  @memoize
  getTimeSlotsPerMinuteGap(
    gap: Minute,
    start = Time.create(),
    end = Time.create(23, 59),
  ): Slot<Time>[] {
    const timeSlots: Slot<Time>[] = []
    const dateTimeSlots: Slot<DateTime>[] = []

    const startDateTime = DateTime.create(
      SimpleDate.create(),
      Time.create(start.hours, start.minutes),
    )

    dateTimeSlots.push({
      start: startDateTime,
      end: this.roll(startDateTime, gap, DurationType.MINUTES),
    })
    timeSlots.push({ start, end })

    while (true) {
      const slotStart = this.roll(
        dateTimeSlots[dateTimeSlots.length - 1].start,
        gap,
        DurationType.MINUTES,
      )
      if (
        slotStart.time.after(end) ||
        slotStart.date.day !== dateTimeSlots[0].end.date.day
      ) {
        break
      }
      const slotEnd = this.roll(slotStart, gap - 1, DurationType.MINUTES)
      dateTimeSlots.push({ start: slotStart, end: slotEnd })
      timeSlots.push({ start: slotStart.time, end: slotEnd.time })
    }

    return timeSlots
  }

  /**
   *
   *
   * @template T
   * @param {YearMonth} yearMonth
   * @param {T} start
   * @param {T} end
   * @returns {boolean}
   * @memberof DateTimeService
   */
  isYearMonthIncluded<T extends DateInterface>(
    yearMonth: YearMonth,
    start: T,
    end: T,
  ): boolean {
    const compareDate = SimpleDate.create(yearMonth.year, yearMonth.month, 1)
    const startDate = SimpleDate.create(start.year, start.month, 1)
    const endDate = SimpleDate.create(end.year, end.month, 1)
    return this.isBetween(compareDate, startDate, endDate)
  }

  /**
   *
   *
   * @template T
   * @param {T[]} dates
   * @returns {T}
   * @memberof DateTimeService
   */
  getFirst<T extends DateTimeInterface>(dates: T[]): T {
    return [...dates].sort((a, b) => a.compareTo(b))[0]
  }

  /**
   *
   *
   * @template T
   * @param {T[]} dates
   * @returns {T}
   * @memberof DateTimeService
   */
  getLast<T extends DateTimeInterface>(dates: T[]): T {
    return [...dates].sort((a, b) => b.compareTo(a))[0]
  }

  /**
   *
   *
   * @template T
   * @param {T} [date=SimpleDate.create() as any]
   * @returns {Week}
   * @memberof DateTimeService
   */
  getWeek<T extends DateTime | SimpleDate>(
    date: T = SimpleDate.create() as any,
  ): Week {
    return dayjs(date.toDate()).week() as Week
  }

  /**
   *
   *
   * @template T
   * @param {T} [date=SimpleDate.create() as any]
   * @returns {T}
   * @memberof DateTimeService
   */
  getStartOfWeek<T extends SimpleDate | DateTime>(
    date: T = SimpleDate.create() as any,
  ): T {
    const dayjsDate = dayjs(date.toDate()).startOf('week')
    return (date instanceof SimpleDate
      ? SimpleDate.createFromDate(dayjsDate.toDate())
      : DateTime.createFromDate(dayjsDate.toDate())) as T
  }

  /**
   *
   *
   * @template T
   * @param {*} [date=SimpleDate.create()]
   * @returns {T}
   * @memberof DateTimeService
   */
  getEndOfWeek<T extends SimpleDate | DateTime>(
    date: T = SimpleDate.create() as any,
  ): T {
    const dayjsDate = dayjs(date.toDate()).endOf('week')
    return (date instanceof SimpleDate
      ? SimpleDate.createFromDate(dayjsDate.toDate())
      : DateTime.createFromDate(dayjsDate.toDate())) as T
  }

  /**
   *
   *
   * @template T
   * @param {T} [date=SimpleDate.create() as any]
   * @returns {string}
   * @memberof DateTimeService
   */
  @memoize
  getMonthName<T extends DateInterface>(
    date: T = SimpleDate.create() as any,
  ): string {
    return dayjs(date.toDate()).format('MMMM')
  }

  /**
   *
   *
   * @template T
   * @param {T} dateObject
   * @returns {Week[]}
   * @memberof DateTimeService
   */
  @memoize
  getWeeksForMonth<T extends DateInterface>(dateObject: T): Week[] {
    const dates = this.getDatesInMonth(dateObject)
    return this.getWeeks(dates)
  }

  /**
   *
   *
   * @template T
   * @param {T} dateObject
   * @returns {Week[]}
   * @memberof DateTimeService
   */
  getWeeks<T extends DateTime | SimpleDate>(dateObjects: T[]): Week[] {
    const weeks = new Set<Week>()
    dateObjects.forEach(d => weeks.add(d.week))
    return Array.from(weeks)
  }

  /**
   *
   *
   * @template T
   * @param {T} date
   * @returns {boolean}
   * @memberof DateTimeService
   */
  isToday<T extends DateTime | SimpleDate>(date: T): boolean {
    return SimpleDate.create().equals(
      SimpleDate.create(date.year, date.month, date.day),
    )
  }

  /**
   *
   *
   * @template T
   * @param {T} date
   * @returns {boolean}
   * @memberof DateTimeService
   */
  isWeekend<T extends DateTime | SimpleDate>(date: T): boolean {
    return (
      this.isWeekday(date, Weekday.SATURDAY) ||
      this.isWeekday(date, Weekday.SUNDAY)
    )
  }

  /**
   *
   *
   * @template T
   * @param {T[]} dates
   * @param {T} date
   * @returns {boolean}
   * @memberof DateTimeService
   */
  includes<T extends DateTimeInterface>(dates: T[], date: T): boolean {
    return !!dates.some(d => d.equals(date))
  }

  /**
   *
   *
   * @template T
   * @param {T} date
   * @param {Weekday[]} weekdays
   * @returns {boolean}
   * @memberof DateTimeService
   */
  isInWeekdays<T extends DateTime | SimpleDate>(
    date: T,
    weekdays: Weekday[],
  ): boolean {
    return !!weekdays.some(weekday => this.isWeekday(date, weekday))
  }

  /**
   *
   *
   * @param {number} interval
   * @param {*} [time=new Time()]
   * @returns {Time}
   * @memberof DateTimeService
   */
  getTimeAdjustedForInterval(interval: Minute, time = new Time()): Time {
    const adjusted = Time.create(time.hours, time.minutes)
    let lastInterval: Minute
    for (let i = 0; i <= 59; i += 1) {
      if (i % interval === 0) {
        lastInterval = i as Minute
      }
      if (i >= time.minutes) {
        adjusted.minutes = lastInterval
        return adjusted
      }
    }
  }

  /**
   *
   *
   * @template T
   * @param {T} dateOrTime
   * @param {T} start
   * @param {T} end
   * @returns {boolean}
   * @memberof DateTimeService
   */
  isBetween<T extends DateTimeInterface>(
    dateOrTime: T,
    start: T,
    end: T,
  ): boolean {
    return dateOrTime.afterOrEquals(start) && dateOrTime.before(end)
  }

  /**
   *
   *
   * @private
   * @memberof DateTimeService
   */
  private isWeekday = <T extends DateTime | SimpleDate>(
    date: T,
    weekday: Weekday,
  ): boolean => {
    return this.getWeekday(date) === weekday
  }

  calendar<T extends DateInterface>(date: T) {
    if (date instanceof DateTime) {
      return this.getDayjs(date).calendar(null, {
        sameDay: '[Today at] hh:mm A', // The same day ( Today at 2:30 AM )
        nextDay: '[Tomorrow at] hh:mm A', // The next day ( Tomorrow at 2:30 AM )
        nextWeek: 'dddd [at] hh:mm A', // The next week ( Sunday at 2:30 AM )
        lastDay: '[Yesterday at] hh:mm A', // The day before ( Yesterday at 2:30 AM )
        lastWeek: '[Last] dddd [at] hh:mm A', // Last week ( Last Monday at 2:30 AM )
        sameElse: 'YYYY-MM-DD hh:mm A', // Everything else ( 7/10/2011 )
      })
    } else if (date instanceof SimpleDate) {
      return this.getDayjs(date).calendar(null, {
        sameDay: '[Today]', // The same day ( Today at 2:30 AM )
        nextDay: '[Tomorrow]', // The next day ( Tomorrow at 2:30 AM )
        nextWeek: 'dddd', // The next week ( Sunday at 2:30 AM )
        lastDay: '[Yesterday]', // The day before ( Yesterday at 2:30 AM )
        lastWeek: '[Last] dddd', // Last week ( Last Monday at 2:30 AM )
        sameElse: 'YYYY-MM-DD', // Everything else ( 7/10/2011 )
      })
    }
    console.warn(`Date type ${date.constructor.name} is not supported`)
    return date.toString()
  }

  filterOverlappingSlots<T extends DateTimeInterface>(
    slots: Slot<T>[],
    overlapping: Slot<T>[],
  ) {
    return slots.filter(
      slot =>
        !overlapping.some(overlapSlot => this.slotsOverlap(slot, overlapSlot)),
    )
  }

  slotsOverlap<T extends DateTimeInterface>(
    slot: Slot<T>,
    overlapping: Slot<T>,
  ): boolean {
    return (
      (overlapping.start.afterOrEquals(slot.start) &&
        overlapping.start.before(slot.end)) ||
      (overlapping.end.beforeOrEquals(slot.end) &&
        overlapping.end.after(slot.start))
    )
  }
}

export const dateTimeService = new DateTimeService()
