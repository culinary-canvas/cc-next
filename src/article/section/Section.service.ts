import { SectionModel } from './Section.model'
import { SectionPreset } from './SectionPreset'
import { ContentService } from '../content/Content.service'
import { ContentType } from '../content/ContentType'
import { Fit } from '../shared/Fit'
import { ImageContentModel } from '../content/image/ImageContent.model'
import { Padding } from '../shared/Padding'
import { TextContentModel } from '../content/text/TextContent.model'
import { VerticalAlign } from '../shared/VerticalAlign'
import { HorizontalAlign } from '../shared/HorizontalAlign'
import { Orientation } from '../shared/Orientation'
import { ImageFormat } from '../content/image/ImageFormat'
import { titleFormat } from '../content/preset/titleFormat'
import { subHeadingFormat } from '../content/preset/subHeadingFormat'
import { bylineFormat } from '../content/preset/bylineFormat'
import { Content } from '../content/Content'
import { v4 as uuid } from 'uuid'
import { cloneDeep } from '../../services/importHelpers'
import { SortableService } from '../../services/sortable/Sortable.service'

export class SectionService {
  static applyPreset(preset: SectionPreset, section: SectionModel) {
    section.preset = preset

    const coverImage: ImageContentModel = (this.getContentOfType(
      ContentType.IMAGE,
      section,
    ) || ContentService.create(ContentType.IMAGE)) as ImageContentModel
    coverImage.format = new ImageFormat()

    const title: TextContentModel = (this.getContentOfType(
      ContentType.TITLE,
      section,
    ) || ContentService.create(ContentType.TITLE)) as TextContentModel
    title.format = titleFormat()
    title.format.verticalAlign = VerticalAlign.BOTTOM
    title.format.horizontalAlign = HorizontalAlign.CENTER
    title.alignToPrevious = Orientation.VERTICAL

    const subHeading: TextContentModel = (this.getContentOfType(
      ContentType.SUB_HEADING,
      section,
    ) || ContentService.create(ContentType.SUB_HEADING)) as TextContentModel
    subHeading.format = subHeadingFormat()
    subHeading.format.horizontalAlign = HorizontalAlign.CENTER
    subHeading.alignToPrevious = Orientation.VERTICAL

    const byline: TextContentModel = (this.getContentOfType(
      ContentType.BYLINE,
      section,
    ) || ContentService.create(ContentType.BYLINE)) as TextContentModel
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

  private static getContentOfType(type: ContentType, section: SectionModel) {
    return section.contents.find((c) => c.type === type)
  }

  static removeContent(content: Content, section: SectionModel) {
    section.contents = section.contents
      .sort((s1, s2) => s1.sortOrder - s2.sortOrder)
      .filter((c) => c.uid !== content.uid)
      .map((s, i) => {
        s.sortOrder = i
        return s
      })
  }

  static duplicate(source: SectionModel) {
    const section = cloneDeep(source)
    section.uid = uuid()
    section.sortOrder = null
    if (section.name) {
      section.name += ' (copy)'
    }
    return section
  }

  static sort(sections: SectionModel[]) {
    SortableService.fixSortOrders(sections)
    return SortableService.getSorted(sections)
  }

  static getColumnContainingContent(section: SectionModel, content: Content) {
    return section.columns.find((col) => col.some((c) => c.uid === content.uid))
  }
}
