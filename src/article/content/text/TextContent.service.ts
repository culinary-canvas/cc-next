import { ContentType } from '../ContentType'
import { loremIpsum } from 'lorem-ipsum'
import StringUtils from '../../../services/utils/StringUtils'
import { BREAKPOINT } from '../../../styles/layout'
import { isServer } from '../../../pages/_app'

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
    if (isServer) {
      return `${fontSize}px`
    }
    const vw = fontSize / (window.innerWidth < BREAKPOINT.DESKTOP_S ? 15 : 20)
    const px = window.innerWidth * (vw / 100)
    const min = fontSize < 16 ? fontSize : 16
    return px < min
      ? `${min}px`
      : px > fontSize
      ? `${fontSize}px`
      : `${Math.floor(px)}px`
  }
}
