import { isNil, isString } from 'lodash'
import kebabCase from 'voca/kebab_case'

class StringUtils {
  private static readonly UNDERSCORE_DASH_REGEXP = /[_-]/g

  static hasValue(value: string): boolean {
    return value !== undefined && value !== null && value.trim() !== ''
  }

  static hasNoValue(value: string): boolean {
    return !StringUtils.hasValue(value)
  }

  static toLowerCaseCapitalFirst(string: string) {
    return `${string.substring(0, 1).toUpperCase()}${string
      .substring(1)
      .toLowerCase()}`
  }

  static toLowerKebabCase(string: string) {
    const transformed = string.toLowerCase()
    return kebabCase(transformed)
  }

  static toDisplayText(string: string) {
    return !string
      ? string
      : StringUtils.toLowerCaseCapitalFirst(
          string.replace(StringUtils.UNDERSCORE_DASH_REGEXP, ' '),
        )
  }

  static isEqual(value1: any, value2: any) {
    if (
      (!isNil(value1) && !isString(value1)) ||
      (!isNil(value2) && !isString(value2))
    ) {
      return false
    }
    const value1String = this.hasNoValue(value1) ? '' : value1
    const value2String = this.hasNoValue(value2) ? '' : value2

    return value1String === value2String
  }
}

export default StringUtils
