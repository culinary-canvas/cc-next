import StringUtils from './StringUtils'

class UnitUtils {
  static getPrettyHeight = (height: number) => {
    const heightStr = String(height)
    return `${heightStr.substr(0, 1)}.${heightStr.substr(1, 2)}m`
  }

  static getPrettyWeight = (weight: number) => {
    return `${weight}kg`
  }

  static getPrettyGender = (gender: string) => {
    return StringUtils.toLowerCaseCapitalFirst(gender)
  }

  static getSelectableHeights = (): number[] => {
    const heights: number[] = []
    for (let height = 100; height < 220; height += 1) {
      heights.push(height)
    }
    return heights
  }

  static getSelectableWeights = (): number[] => {
    const weights: number[] = []
    for (let weight = 40; weight < 220; weight += 1) {
      weights.push(weight)
    }
    return weights
  }

  static getGenderOptions = (): string[] => {
    return ['undefined', 'male', 'female', 'other']
  }
}

export default UnitUtils
