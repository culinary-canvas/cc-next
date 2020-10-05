import StopWatch from './StopWatch'
import l from './LogUtils'

class InitTimer {
  private readonly clazz: any
  private readonly serviceName: string
  private readonly stopWatch: StopWatch

  constructor(clazz: any, methodName = 'init') {
    l.group(clazz, methodName)
    this.clazz = clazz
    this.stopWatch = new StopWatch()
  }

  done = (): void => {
    const duration = this.stopWatch.getTotal()
    console.debug(`${this.clazz.constructor.name} initialized [${duration}s]`)
    l.ungroup()
  }
}

export default InitTimer
