import { ContentType } from '../ContentType'
import { loremIpsum } from 'lorem-ipsum'
import StringUtils from '../../../services/utils/StringUtils'
import { BREAKPOINT } from '../../../styles/layout'

export class TextContentService {
  static placeholder(type: ContentType) {
    switch (type) {
      case ContentType.PARAGRAPH:
        return loremIpsum({ units: 'paragraph', count: 1 })
      default:
        return StringUtils.toDisplayText(type)
    }
  }

  static getResponsiveFontSize(fontSize: number) {
    const vw = fontSize / (window.innerWidth < BREAKPOINT.DESKTOP_S ? 15 : 20)
    const px = window.innerWidth * (vw / 100)
    const min = fontSize < 16 ? fontSize : 16
    const max = fontSize
    return px < min ? `${min}px` : px > max ? `${max}px` : `${vw}vw`
  }
}
