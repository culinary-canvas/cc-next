import { loremIpsum } from 'lorem-ipsum'
import { action, makeObservable } from 'mobx'
import { cloneDeep } from '../../services/importHelpers'
import StringUtils from '../../services/utils/StringUtils'
import { COLOR } from '../../styles/_color'
import { FONT } from '../../styles/font'
import { ContentModel } from '../models/ContentModel'
import { ContentType } from '../models/ContentType'
import { HorizontalAlign } from '../models/HorizontalAlign'
import { ImageContentModel } from '../models/ImageContent.model'
import { IssueContentModel } from '../models/IssueContent.model'
import { TextContentModel } from '../models/TextContent.model'
import { TextFormat } from '../models/TextFormat'

export class ContentService {
  static create<T extends ContentModel>(type = ContentType.PARAGRAPH): T {
    const content: T = (type === ContentType.IMAGE
      ? new ImageContentModel()
      : type === ContentType.ISSUE
      ? new IssueContentModel()
      : new TextContentModel()) as unknown as T
    return this.getTypeAppliedContent<T>(content, type)
  }

  static getTypeAppliedContent<T extends ContentModel>(
    source: T,
    type: ContentType,
  ): T {
    let content: ContentModel

    if (type === ContentType.ISSUE && !(source instanceof IssueContentModel)) {
      content = new IssueContentModel()
    } else if (
      type === ContentType.IMAGE &&
      !(source instanceof ImageContentModel)
    ) {
      content = new ImageContentModel()
    } else if (
      type !== ContentType.IMAGE &&
      type !== ContentType.ISSUE &&
      !(source instanceof TextContentModel)
    ) {
      content = new TextContentModel()
    } else {
      content = makeObservable(cloneDeep(source))
    }

    content.format.gridPosition = source.format.gridPosition
    content.type = type

    this.applyFormatForType(content)

    if (content instanceof TextContentModel) {
      this.setPlaceholder(content)
    }

    return content as T
  }

  @action
  private static applyFormatForType(content: ContentModel) {
    if (content instanceof TextContentModel) {
      this.applyTextFormatForType(content)
    }
  }

  @action
  private static applyTextFormatForType(content: TextContentModel) {
    content.format = new TextFormat({
      gridPosition: content.format.gridPosition,
    })

    switch (content.type) {
      case ContentType.EXTRACT:
        content.format.horizontalAlign = HorizontalAlign.CENTER
        content.format.fontFamily = FONT.FAMILY.ELOQUENT
        content.format.fontSize = FONT.SIZE.XL
        break
      case ContentType.HEADING:
        content.format.fontSize = FONT.SIZE.XL
        content.format.fontWeight = 600
        content.format.padding.bottom = 0
        break
      case ContentType.SUB_HEADING:
        content.format.color = COLOR.BLACK
        content.format.fontSize = FONT.SIZE.L
        content.format.fontFamily = FONT.FAMILY.NEUE_HAAS_GROTESK
        break
      case ContentType.LEAD:
        content.format.fontWeight = 500
        break
      case ContentType.TITLE:
        content.format.fontFamily = FONT.FAMILY.NEUE_HAAS_GROTESK
        content.format.fontWeight = 500
        content.format.fontSize = FONT.SIZE.XXXXL
        break
      case ContentType.BYLINE:
        content.format.color = COLOR.BLACK
        content.format.fontSize = FONT.SIZE.M
        break
      default:
        content.format.fontFamily = FONT.FAMILY.NEUE_HAAS_GROTESK
        content.format.fontSize = FONT.SIZE.L
    }
  }

  private static setPlaceholder(content: TextContentModel) {
    switch (content.type) {
      case ContentType.EXTRACT:
      case ContentType.SUB_HEADING:
        content.placeholder = loremIpsum({ units: 'sentence' })
        break
      case ContentType.HEADING:
      case ContentType.TITLE:
        content.placeholder = StringUtils.toDisplayText(content.type)
        break
      case ContentType.BYLINE:
        content.placeholder = 'Words by [writer]. Photos by [photographer]'
        break
      default:
        content.placeholder = loremIpsum({ units: 'paragraph' })
    }
  }
}
