import { ContentType } from './ContentType'
import { extractFormat } from './preset/extractFormat'
import { headingFormat } from './preset/headingFormat'
import { leadFormat } from './preset/leadFormat'
import { titleFormat } from './preset/titleFormat'
import { bylineFormat } from './preset/bylineFormat'
import { paragraphFormat } from './preset/paragraphFormat'
import { ContentModel } from './ContentModel'
import { ImageContentModel } from './image/ImageContent.model'
import { TextContentModel } from './text/TextContent.model'
import { subHeadingFormat } from './preset/subHeadingFormat'
import { cloneDeep } from '../../services/importHelpers'
import { SortableService } from '../../services/sortable/Sortable.service'
import { loremIpsum } from 'lorem-ipsum'
import StringUtils from '../../services/utils/StringUtils'
import { action, toJS } from 'mobx'
import { SectionModel } from '../section/Section.model'
import { GridPositionService } from '../grid/GridPosition.service'
import { GridPosition } from '../grid/GridPosition'

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

    content.sortOrder = source.sortOrder
    content.type = type

    this.setFormatForType(content)

    if (content instanceof TextContentModel) {
      this.setPlaceholder(content)
    }

    return content as T
  }

  private static setFormatForType(content: ContentModel) {
    switch (content.type) {
      case ContentType.EXTRACT:
        content.format = extractFormat()
        break
      case ContentType.HEADING:
        content.format = headingFormat()
        break
      case ContentType.SUB_HEADING:
        content.format = subHeadingFormat()
        break
      case ContentType.LEAD:
        content.format = leadFormat()
        break
      case ContentType.TITLE:
        content.format = titleFormat()
        break
      case ContentType.BYLINE:
        content.format = bylineFormat()
        break
      case ContentType.IMAGE:
        break
      default:
        content.format = paragraphFormat()
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

  @action
  static addContent(content: ContentModel, section: SectionModel) {
    console.log(toJS(content))
    if (!content.format.gridPosition) {
      const row = GridPositionService.numberOfRows(section.contents) + 1
      content.format.gridPosition = new GridPosition(1, 5, row, row + 1)
    } else {
      GridPositionService.addRow(
        content.format.gridPosition.startRow,
        section.contents,
      )
      content.format.gridPosition.startRow += 1
      content.format.gridPosition.endRow += 1
    }
    section.contents.push(content)
  }
}
