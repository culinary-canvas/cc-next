import { Section } from './Section'
import { SectionPreset } from './SectionPreset'
import { ContentService } from '../Content/Content.service'
import { ContentType } from '../Text/ContentType'
import { Fit } from './Fit'
import { ImageContent } from '../Image/ImageContent'
import { Padding } from '../Format/Padding'
import { TextContent } from '../Text/TextContent'
import { VerticalAlign } from '../Text/VerticalAlign'
import { HorizontalAlign } from '../Text/HorizontalAlign'
import { Orientation } from './Orientation'
import { ImageFormat } from '../Image/ImageFormat'
import { titleFormat } from '../Content/preset/titleFormat'
import { subHeadingFormat } from '../Content/preset/subHeadingFormat'
import { bylineFormat } from '../Content/preset/bylineFormat'
import { Content } from '../Content/Content'
import { v4 as uuid } from 'uuid'
import { cloneDeep } from '../../services/importHelpers'
import { SortableService } from '../../services/sortable/Sortable.service'

export class SectionService {
  static applyPreset(preset: SectionPreset, section: Section) {
    section.preset = preset

    const coverImage: ImageContent = (this.getContentOfType(
      ContentType.IMAGE,
      section,
    ) || ContentService.create(ContentType.IMAGE)) as ImageContent
    coverImage.format = new ImageFormat()

    const title: TextContent = (this.getContentOfType(
      ContentType.TITLE,
      section,
    ) || ContentService.create(ContentType.TITLE)) as TextContent
    title.format = titleFormat()
    title.format.verticalAlign = VerticalAlign.BOTTOM
    title.format.horizontalAlign = HorizontalAlign.CENTER
    title.alignToPrevious = Orientation.VERTICAL

    const subHeading: TextContent = (this.getContentOfType(
      ContentType.SUB_HEADING,
      section,
    ) || ContentService.create(ContentType.SUB_HEADING)) as TextContent
    subHeading.format = subHeadingFormat()
    subHeading.format.horizontalAlign = HorizontalAlign.CENTER
    subHeading.alignToPrevious = Orientation.VERTICAL

    const byline: TextContent = (this.getContentOfType(
      ContentType.BYLINE,
      section,
    ) || ContentService.create(ContentType.BYLINE)) as TextContent
    byline.format = bylineFormat()
    byline.format.horizontalAlign = HorizontalAlign.CENTER
    byline.format.verticalAlign = VerticalAlign.BOTTOM
    byline.alignToPrevious = Orientation.VERTICAL

    if (preset === SectionPreset.HALF_SCREEN_IMAGE_TITLE_SUB_BYLINE) {
      coverImage.sortOrder = 0
      title.sortOrder = 1
      subHeading.sortOrder = 2
      byline.sortOrder = 3

      coverImage.format.padding = new Padding(0, 16)
      title.format.padding = new Padding(16, 40, 16, 40)
      subHeading.format.padding = new Padding(16, 40, 16, 40)
      byline.format.padding = new Padding(16)

      section.format.fit = Fit.FULL_SCREEN
    } else if (preset === SectionPreset.FULL_SCREEN_IMAGE_TITLE_SUB_BYLINE) {
      coverImage.sortOrder = 0
      title.sortOrder = 1
      subHeading.sortOrder = 2
      byline.sortOrder = 3

      coverImage.format.background = true

      coverImage.format.padding = new Padding(0)
      title.format.padding = new Padding(16, 80, 16, 80)
      subHeading.format.padding = new Padding(16, 80, 16, 80)
      byline.format.padding = new Padding(16)

      section.format.fit = Fit.FULL_SCREEN
    } else if (preset === SectionPreset.INLINE_IMAGE_TITLE_SUB_BYLINE) {
      coverImage.sortOrder = 3
      title.sortOrder = 0
      subHeading.sortOrder = 1
      byline.sortOrder = 2

      coverImage.format.padding = new Padding(16)
      title.format.padding = new Padding(120, 16, 0, 16)
      subHeading.format.padding = new Padding(40)
      byline.format.padding = new Padding(32)

      section.format.fit = Fit.ARTICLE
    }

    if (preset === SectionPreset.HALF_SCREEN_IMAGE_TITLE_SUB_BYLINE) {
      title.alignToPrevious = Orientation.HORIZONTAL
    }

    section.contents = [coverImage, title, subHeading, byline]
  }

  private static getContentOfType(type: ContentType, section: Section) {
    return section.contents.find((c) => c.type === type)
  }

  private static hasContentOfType(type: ContentType, section: Section) {
    return section.contents.some((c) => c.type === type)
  }

  static removeContent(content: Content, section: Section) {
    section.contents = section.contents
      .sort((s1, s2) => s1.sortOrder - s2.sortOrder)
      .filter((c) => c.uid !== content.uid)
      .map((s, i) => {
        s.sortOrder = i
        return s
      })
  }

  static duplicate(source: Section) {
    const section = cloneDeep(source)
    section.uid = uuid()
    section.sortOrder = null
    if (section.name) {
      section.name += ' (copy)'
    }
    return section
  }

  static sort(sections: Section[]) {
    SortableService.fixSortOrders(sections)
    return SortableService.getSorted(sections)
  }

  static getColumnContainingContent(section: Section, content: Content) {
    return section.columns.find((col) => col.some((c) => c.uid === content.uid))
  }
}
