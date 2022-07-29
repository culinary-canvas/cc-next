import { loremIpsum } from 'lorem-ipsum'
import { isServer } from '../../pages/_app'
import StringUtils from '../../services/utils/StringUtils'
import { BREAKPOINT } from '../../styles/layout'
import { ContentType } from '../models/ContentType'

export class TextContentService {
  static placeholder(type: ContentType) {
    switch (type) {
      case ContentType.PARAGRAPH:
        return loremIpsum({ units: 'paragraph', count: 1 })
      default:
        return StringUtils.toDisplayText(type)
    }
  }

  static getResponsiveFontSize(fontSize: number): string {
    if (isServer || window.innerWidth >= BREAKPOINT.DESKTOP_S) {
      return `${fontSize}px`
    }
    const px = fontSize * 0.75
    const min = fontSize < 18 ? fontSize : 18

    return px < min
      ? `${min}px`
      : px > fontSize
      ? `${fontSize}px`
      : `${Math.floor(px)}px`
  }
}
