import Duration from '../duration/Duration'
import DurationType from '../duration/DurationType'

class StopWatch {
  private _stop: Date = null
  private splits: Date[] = []
  private readonly start: Date = null

  constructor() {
    this.start = new Date()
    this.splits.push(this.start)
  }

  getSplit = () => {
    this.splits.push(new Date())
    const last = this.splits.length - 1
    return (
      (this.splits[last].valueOf() - this.splits[last - 1].valueOf()) / 1000
    )
  }

  getTotal = () => {
    return (
      ((this._stop ? this._stop : new Date()).valueOf() -
        this.start.valueOf()) /
      1000
    )
  }

  getTotalAsDuration = () => {
    const seconds = this.getTotal()
    const duration = new Duration()
    duration.durationType = DurationType.SECONDS
    duration.value = seconds
    return duration
  }

  stop = () => {
    this._stop = new Date()
  }
}

export default StopWatch
