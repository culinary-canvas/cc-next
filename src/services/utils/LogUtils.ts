class LogUtils {
  static group(clazz: any, method?: string) {
    const group = typeof clazz === 'string' ? clazz : clazz.constructor.name
    return console.group(`${group}:${method || ''}`)
  }

  static ungroup() {
    return console.groupEnd()
  }

  static debug = console.debug
  static log = console.log
  static info = console.info
  static warn = console.warn
  static error = console.error
}

export default LogUtils
export const l = LogUtils
