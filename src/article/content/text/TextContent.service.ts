import { ContentType } from '../ContentType'
import { loremIpsum } from 'lorem-ipsum'
import StringUtils from '../../../services/utils/StringUtils'

export class TextContentService {
  static placeholder(type: ContentType) {
    switch (type) {
      case ContentType.PARAGRAPH:
        return loremIpsum({ units: 'paragraph', count: 1 })
      default:
        return StringUtils.toDisplayText(type)
    }
  }
}
