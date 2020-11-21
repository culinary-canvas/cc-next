import { SectionModel } from './Section.model'
import { SectionPreset } from './SectionPreset'
import { ContentService } from '../content/Content.service'
import { ContentType } from '../content/ContentType'
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
import { ContentModel } from '../content/ContentModel'
import { v4 as uuid } from 'uuid'
import { cloneDeep } from '../../services/importHelpers'
import { SortableService } from '../../services/sortable/Sortable.service'
import { TextFormat } from '../content/text/TextFormat'
import { FONT } from '../../styles/font'
import { COLOR } from '../../styles/color'
import { GridPosition } from '../grid/GridPosition'
import { Size } from '../shared/format/Size'
import { Transformer } from '../../services/db/Transformer'
import { GridPositionService } from '../grid/GridPosition.service'

export class SectionService {
  static applyPreset(preset: SectionPreset, section: SectionModel) {
    switch (preset) {
      case SectionPreset.HALF_SCREEN_TITLE:
        this.applyHalfScreenTitlePreset(section)
        break
      case SectionPreset.FULL_SCREEN_TITLE:
        this.applyFullScreenTitlePreset(section)
        break
      case SectionPreset.INLINE_TITLE:
        this.applyInlineTitlePreset(section)
        break
      case SectionPreset.PROFILE_CARD:
        this.applyProfileCardPreset(section)
        break
    }
  }
  private static applyProfileCardPreset(section: SectionModel) {
    section.preset = SectionPreset.PROFILE_CARD

    const image = this.getOrCreateImage(section)
    image.format.fixedWidth = 200
    image.format.fixedHeight = 200
    image.format.circle = true
    image.format.horizontalAlign = HorizontalAlign.CENTER
    image.format.verticalAlign = VerticalAlign.CENTER
    image.format.gridPosition = new GridPosition(1, 3, 1, 4)

    const name = this.getOrCreateParagraph(section, 0)
    name.format.fontWeight = 500
    name.format.fontSize = FONT.SIZE.M
    name.placeholder = 'Name'
    name.format.padding = new Padding(40, 16, 0, 16)
    name.format.gridPosition = new GridPosition(3, 5, 1, 2)

    const jobTitle = this.getOrCreateParagraph(section, 1)
    jobTitle.format.fontFamily = FONT.FAMILY.GARAMOND
    jobTitle.format.fontSize = FONT.SIZE.M
    jobTitle.format.color = COLOR.GREY_DARK
    jobTitle.placeholder = 'Title'
    jobTitle.format.padding = new Padding(0, 16, 16, 16)
    jobTitle.format.gridPosition = new GridPosition(3, 5, 2, 3)

    const description = this.getOrCreateParagraph(section, 2)
    description.format.fontSize = FONT.SIZE.M
    description.format.fontFamily = FONT.FAMILY.GARAMOND
    description.format.padding = new Padding(16, 16, 40, 16)
    description.format.gridPosition = new GridPosition(3, 5, 3, 4)

    section.contents = [image, name, jobTitle, description]
  }

  private static applyFullScreenTitlePreset(section: SectionModel) {
    section.preset = SectionPreset.FULL_SCREEN_TITLE
    const image = this.getOrCreateImage(section)
    image.format.gridPosition = new GridPosition(1, 5, 1, 4)
    image.format.layer = 0

    const title = this.getOrCreateTitle(section)
    title.format.verticalAlign = VerticalAlign.BOTTOM
    title.format.horizontalAlign = HorizontalAlign.CENTER
    title.format.gridPosition = new GridPosition(1, 5, 1, 2)
    title.format.layer = 1

    const subHeading = this.getOrCreateSubHeading(section)
    subHeading.format.horizontalAlign = HorizontalAlign.CENTER
    subHeading.format.gridPosition = new GridPosition(1, 5, 2, 3)
    subHeading.format.layer = 1

    const byline = this.getOrCreateByline(section)
    byline.format.horizontalAlign = HorizontalAlign.CENTER
    byline.format.verticalAlign = VerticalAlign.BOTTOM
    byline.format.gridPosition = new GridPosition(1, 5, 3, 4)
    byline.format.layer = 1

    image.format.padding = new Padding(0)
    title.format.padding = new Padding(16, 80, 16, 80)
    subHeading.format.padding = new Padding(16, 80, 16, 80)
    byline.format.padding = new Padding(16)

    section.format.height = Size.FULL_SCREEN
    section.format.gridPosition = new GridPosition(1, 7)
    section.contents = [image, title, subHeading, byline]
  }

  private static applyHalfScreenTitlePreset(section: SectionModel) {
    section.preset = SectionPreset.HALF_SCREEN_TITLE

    const image = this.getOrCreateImage(section)
    image.format.gridPosition = new GridPosition(1, 3, 1, 4)

    const title = this.getOrCreateTitle(section)
    title.format.verticalAlign = VerticalAlign.BOTTOM
    title.format.horizontalAlign = HorizontalAlign.CENTER
    title.format.gridPosition = new GridPosition(3, 5, 1, 2)

    const subHeading = this.getOrCreateSubHeading(section)
    subHeading.format.horizontalAlign = HorizontalAlign.CENTER
    subHeading.format.gridPosition = new GridPosition(3, 5, 2, 3)

    const byline = this.getOrCreateByline(section)
    byline.format.horizontalAlign = HorizontalAlign.CENTER
    byline.format.verticalAlign = VerticalAlign.BOTTOM
    byline.format.gridPosition = new GridPosition(3, 5, 3, 4)

    image.format.padding = new Padding(0, 16)
    title.format.padding = new Padding(16, 40, 16, 40)
    subHeading.format.padding = new Padding(16, 40, 16, 40)
    byline.format.padding = new Padding(16)

    section.format.height = Size.FULL_SCREEN
    section.format.gridPosition = new GridPosition(1, 7)
    section.contents = [image, title, subHeading, byline]
  }

  private static applyInlineTitlePreset(section: SectionModel) {
    section.preset = SectionPreset.INLINE_TITLE

    const title = this.getOrCreateTitle(section)
    title.format.verticalAlign = VerticalAlign.BOTTOM
    title.format.horizontalAlign = HorizontalAlign.CENTER
    title.format.gridPosition = new GridPosition(1, 5, 1, 2)

    const subHeading = this.getOrCreateSubHeading(section)
    subHeading.format.horizontalAlign = HorizontalAlign.CENTER
    subHeading.format.gridPosition = new GridPosition(1, 5, 2, 3)

    const byline = this.getOrCreateByline(section)
    byline.format.horizontalAlign = HorizontalAlign.CENTER
    byline.format.verticalAlign = VerticalAlign.BOTTOM
    byline.format.gridPosition = new GridPosition(1, 5, 3, 4)

    const image = this.getOrCreateImage(section)
    image.format.gridPosition = new GridPosition(1, 5, 4, 5)

    image.format.padding = new Padding(16)
    title.format.padding = new Padding(120, 16, 0, 16)
    subHeading.format.padding = new Padding(40)
    byline.format.padding = new Padding(32)

    section.format.height = Size.FIT_CONTENT
    section.format.gridPosition = new GridPosition(2, 6)
    section.contents = [image, title, subHeading, byline]
  }

  private static getOrCreateByline(section: SectionModel) {
    const byline: TextContentModel = (this.getContentOfType(
      ContentType.BYLINE,
      section,
    ) || ContentService.create(ContentType.BYLINE)) as TextContentModel

    byline.format = bylineFormat()
    return byline
  }

  private static getOrCreateSubHeading(section: SectionModel) {
    const subHeading: TextContentModel = (this.getContentOfType(
      ContentType.SUB_HEADING,
      section,
    ) || ContentService.create(ContentType.SUB_HEADING)) as TextContentModel
    subHeading.format = subHeadingFormat()
    return subHeading
  }

  private static getOrCreateTitle(section: SectionModel) {
    const title: TextContentModel = (this.getContentOfType(
      ContentType.TITLE,
      section,
    ) || ContentService.create(ContentType.TITLE)) as TextContentModel

    title.format = titleFormat()
    return title
  }

  private static getOrCreateImage(section: SectionModel) {
    const image: ImageContentModel = (this.getContentOfType(
      ContentType.IMAGE,
      section,
    ) || ContentService.create(ContentType.IMAGE)) as ImageContentModel
    image.format = new ImageFormat()
    return image
  }

  private static getOrCreateParagraph(section: SectionModel, number = 0) {
    let paragraph: TextContentModel
    const existing: TextContentModel[] = this.getContentsOfType(
      ContentType.PARAGRAPH,
      section,
    )

    if (!!existing.length && existing.length > number) {
      paragraph = existing[number]
    } else {
      paragraph = ContentService.create(ContentType.PARAGRAPH)
    }
    paragraph.format = new TextFormat()
    return paragraph
  }

  private static getContentOfType<T extends ContentModel = any>(
    type: ContentType,
    section: SectionModel,
  ): T {
    return section.contents.find((c) => c.type === type) as T
  }

  private static getContentsOfType<T extends ContentModel = any>(
    type: ContentType,
    section: SectionModel,
  ): T[] {
    return section.contents.filter((c) => c.type === type) as T[]
  }

  static removeContent(content: ContentModel, section: SectionModel) {
    const row = section.format.gridPosition.startRow
    if (
      GridPositionService.partsStartingOnRow(section.contents, row).length ===
        1 &&
      GridPositionService.numberOfRows(section.contents) > 1
    ) {
      GridPositionService.deleteRow(row, section.contents)
    }
    section.contents = section.contents.filter((c) => c.uid !== content.uid)
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

  static contentsToDb = (objects) => objects?.map((o) => Transformer.toDb(o))
  static contentsToApp = (objects) =>
    objects?.map((o) =>
      Transformer.toApp<ContentModel>(
        o,
        !!o.type && o.type === ContentType.IMAGE
          ? ImageContentModel
          : TextContentModel,
      ),
    )
}
