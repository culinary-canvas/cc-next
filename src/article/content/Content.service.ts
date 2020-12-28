import { ContentType } from './ContentType'
import { ContentModel } from './ContentModel'
import { ImageContentModel } from './image/ImageContent.model'
import { TextContentModel } from './text/TextContent.model'
import { cloneDeep } from '../../services/importHelpers'
import { SortableService } from '../../services/sortable/Sortable.service'
import { loremIpsum } from 'lorem-ipsum'
import StringUtils from '../../services/utils/StringUtils'
import { action } from 'mobx'
import { SectionModel } from '../section/Section.model'
import { GridPositionService } from '../grid/GridPosition.service'
import { GridPosition } from '../grid/GridPosition'
import { HorizontalAlign } from '../shared/HorizontalAlign'
import { FONT } from '../../styles/font'
import { COLOR } from '../../styles/_color'
import { TextFormat } from './text/TextFormat'

export class ContentService {
  static create<T extends ContentModel>(type = ContentType.PARAGRAPH): T {
    const content: T = ((type === ContentType.IMAGE
      ? new ImageContentModel()
      : new TextContentModel()) as unknown) as T
    return this.getTypeAppliedContent<T>(content, type)
  }

  static getTypeAppliedContent<T extends ContentModel>(
    source: T,
    type: ContentType,
  ): T {
    let content: ContentModel

    if (type === ContentType.IMAGE && !(source instanceof ImageContentModel)) {
      content = new ImageContentModel()
    } else if (
      type !== ContentType.IMAGE &&
      !(source instanceof TextContentModel)
    ) {
      content = new TextContentModel()
    } else {
      content = cloneDeep(source)
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
        content.format.fontSize = FONT.SIZE.L
        content.format.fontWeight = 900
        break
      case ContentType.SUB_HEADING:
        content.format.color = COLOR.BLACK
        content.format.fontSize = FONT.SIZE.L
        content.format.fontFamily = FONT.FAMILY.GARAMOND
        break
      case ContentType.LEAD:
        content.format.fontWeight = 700
        break
      case ContentType.TITLE:
        content.format.fontFamily = FONT.FAMILY.FILSON
        content.format.fontWeight = 900
        content.format.fontSize = FONT.SIZE.XXXXL
        break
      case ContentType.BYLINE:
        content.format.color = COLOR.BLACK
        content.format.fontSize = FONT.SIZE.M
        break
      default:
        content.format.fontFamily = FONT.FAMILY.GARAMOND
        content.format.fontSize = FONT.SIZE.M
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

  static sort(contents: ContentModel[]) {
    SortableService.fixSortOrders(contents)
    return SortableService.getSorted(contents)
  }
}
