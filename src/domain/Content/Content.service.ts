import { ContentType } from '../Text/ContentType'
import { extractFormat } from './preset/extractFormat'
import { headingFormat } from './preset/headingFormat'
import { leadFormat } from './preset/leadFormat'
import { titleFormat } from './preset/titleFormat'
import { bylineFormat } from './preset/bylineFormat'
import { paragraphFormat } from './preset/paragraphFormat'
import { Content } from './Content'
import { ImageContent } from '../Image/ImageContent'
import { TextContent } from '../Text/TextContent'
import { subHeadingFormat } from './preset/subHeadingFormat'
import { cloneDeep } from '../../services/importHelpers'
import { SortableService } from '../../services/sortable/Sortable.service'
import {Section} from '../Section/Section'

export class ContentService {
  static create<T extends Content>(type = ContentType.PARAGRAPH): T {
    const content: T = ((type === ContentType.IMAGE
      ? new ImageContent()
      : new TextContent()) as unknown) as T
    return this.getTypeAppliedContent<T>(content, type)
  }

  static getTypeAppliedContent<T extends Content>(
    source: T,
    type: ContentType,
  ): T {
    let content: Content

    if (type === ContentType.IMAGE && !(source instanceof ImageContent)) {
      content = new ImageContent()
    } else if (type !== ContentType.IMAGE && !(source instanceof TextContent)) {
      content = new TextContent()
    } else {
      content = cloneDeep(source)
    }

    content.sortOrder = source.sortOrder
    content.type = type

    switch (type) {
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

    return content as T
  }

  static sort(contents: Content[]) {
    SortableService.fixSortOrders(contents)
    return SortableService.getSorted(contents)
  }
}
