class NumberUtils {
  static round(number: number, decimals = 0) {
    return Number(number.toFixed(decimals))
  }

  static percentage(number: number, decimals = 1) {
    return this.round(number * 100, decimals)
  }

  static getRange(end: number, start = 1): number[] {
    const range: number[] = []
    for (let i = start; i <= end; i += 1) {
      range.push(i)
    }
    return range
  }
}

export default NumberUtils
