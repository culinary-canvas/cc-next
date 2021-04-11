import { SectionModel } from '../models/Section.model'
import { SectionPreset } from '../models/SectionPreset'
import { ContentService } from '../services/Content.service'
import { ContentType } from '../models/ContentType'
import { ImageContentModel } from '../models/ImageContent.model'
import { Padding } from '../models/Padding'
import { TextContentModel } from '../models/TextContent.model'
import { VerticalAlign } from '../models/VerticalAlign'
import { HorizontalAlign } from '../models/HorizontalAlign'
import { ContentModel } from '../models/ContentModel'
import { v4 as uuid } from 'uuid'
import { cloneDeep } from '../../services/importHelpers'
import { FONT } from '../../styles/font'
import { COLOR } from '../../styles/_color'
import { GridPosition } from '../grid/GridPosition'
import { Size } from '../models/Size'
import { Transformer } from '../../services/db/Transformer'
import { GridPositionService } from '../grid/GridPosition.service'
import { action } from 'mobx'
import { ImageFit } from '../models/ImageFit'

export class SectionService {
  static create() {
    const section = new SectionModel()
    const content = ContentService.create()
    SectionService.addContent(content, section)
    return section
  }

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

  @action
  static addContent(content: ContentModel, section: SectionModel) {
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

  private static applyProfileCardPreset(section: SectionModel) {
    section.preset = SectionPreset.PROFILE_CARD

    const image = this.getOrCreateType<ImageContentModel>(
      ContentType.IMAGE,
      section,
    )
    image.format.circle = true
    image.format.padding = new Padding(40, 16, 16, 16)
    image.format.horizontalAlign = HorizontalAlign.CENTER
    image.format.verticalAlign = VerticalAlign.CENTER
    image.format.gridPosition = new GridPosition(2, 4, 1, 2)

    const name = this.getOrCreateParagraph(section, 0)
    name.format.fontWeight = 500
    name.format.fontSize = FONT.SIZE.L
    name.format.fontFamily = FONT.FAMILY.FILSON
    name.placeholder = 'Name'
    name.format.padding = new Padding(16, 16, 0, 16)
    name.format.gridPosition = new GridPosition(1, 5, 2, 3)
    name.format.horizontalAlign = HorizontalAlign.CENTER

    const jobTitle = this.getOrCreateParagraph(section, 1)
    jobTitle.format.fontFamily = FONT.FAMILY.GARAMOND
    jobTitle.format.fontSize = FONT.SIZE.M
    jobTitle.format.color = COLOR.GREY_DARK
    jobTitle.format.italic = true
    jobTitle.placeholder = 'Title'
    jobTitle.format.padding = new Padding(0, 16, 16, 16)
    jobTitle.format.gridPosition = new GridPosition(1, 5, 3, 4)
    jobTitle.format.horizontalAlign = HorizontalAlign.CENTER

    const description = this.getOrCreateParagraph(section, 2)
    description.format.fontSize = FONT.SIZE.M
    description.format.fontFamily = FONT.FAMILY.GARAMOND
    description.format.padding = new Padding(0, 16, 40, 16)
    description.format.gridPosition = new GridPosition(1, 5, 4, 5)
    description.format.horizontalAlign = HorizontalAlign.CENTER

    section.format.height = Size.FIT_CONTENT
    section.format.shadow = true
    section.format.backgroundColor = COLOR.WHITE
    section.format.gridPosition.endColumn =
      section.format.gridPosition.startColumn + 1
    section.contents = [image, name, jobTitle, description]
  }

  private static applyFullScreenTitlePreset(section: SectionModel) {
    section.preset = SectionPreset.FULL_SCREEN_TITLE

    const image: ImageContentModel = this.getOrCreateType(
      ContentType.IMAGE,
      section,
    )
    image.format.gridPosition = new GridPosition(1, 5, 1, 4)
    image.format.layer = 0
    image.format.fit = ImageFit.COVER

    const title = this.getOrCreateType(ContentType.TITLE, section)
    title.format.verticalAlign = VerticalAlign.BOTTOM
    title.format.horizontalAlign = HorizontalAlign.CENTER
    title.format.gridPosition = new GridPosition(1, 5, 1, 2)
    title.format.layer = 1

    const subHeading = this.getOrCreateType(ContentType.SUB_HEADING, section)
    subHeading.format.horizontalAlign = HorizontalAlign.CENTER
    subHeading.format.gridPosition = new GridPosition(1, 5, 2, 3)
    subHeading.format.layer = 1

    const byline = this.getOrCreateType(ContentType.BYLINE, section)
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

    const image: ImageContentModel = this.getOrCreateType(
      ContentType.IMAGE,
      section,
    )
    image.format.gridPosition = new GridPosition(1, 3, 1, 4)
    image.format.fit = ImageFit.COVER

    const title = this.getOrCreateType(ContentType.TITLE, section)
    title.format.verticalAlign = VerticalAlign.BOTTOM
    title.format.horizontalAlign = HorizontalAlign.CENTER
    title.format.gridPosition = new GridPosition(3, 5, 1, 2)

    const subHeading = this.getOrCreateType(ContentType.SUB_HEADING, section)
    subHeading.format.horizontalAlign = HorizontalAlign.CENTER
    subHeading.format.gridPosition = new GridPosition(3, 5, 2, 3)

    const byline = this.getOrCreateType(ContentType.BYLINE, section)
    byline.format.horizontalAlign = HorizontalAlign.CENTER
    byline.format.verticalAlign = VerticalAlign.BOTTOM
    byline.format.gridPosition = new GridPosition(3, 5, 3, 4)

    image.format.padding = new Padding(0)
    title.format.padding = new Padding(16, 40, 16, 40)
    subHeading.format.padding = new Padding(16, 40, 16, 40)
    byline.format.padding = new Padding(16)

    section.format.height = Size.FULL_SCREEN
    section.format.gridPosition = new GridPosition(1, 7)
    section.contents = [image, title, subHeading, byline]
  }

  private static applyInlineTitlePreset(section: SectionModel) {
    section.preset = SectionPreset.INLINE_TITLE

    const title = this.getOrCreateType(ContentType.TITLE, section)
    title.format.verticalAlign = VerticalAlign.BOTTOM
    title.format.horizontalAlign = HorizontalAlign.CENTER
    title.format.gridPosition = new GridPosition(1, 5, 1, 2)

    const subHeading = this.getOrCreateType(ContentType.SUB_HEADING, section)
    subHeading.format.horizontalAlign = HorizontalAlign.CENTER
    subHeading.format.gridPosition = new GridPosition(1, 5, 2, 3)

    const byline = this.getOrCreateType(ContentType.BYLINE, section)
    byline.format.horizontalAlign = HorizontalAlign.CENTER
    byline.format.verticalAlign = VerticalAlign.BOTTOM
    byline.format.gridPosition = new GridPosition(1, 5, 3, 4)

    const image = this.getOrCreateType(ContentType.IMAGE, section)
    image.format.gridPosition = new GridPosition(1, 5, 4, 5)

    image.format.padding = new Padding(16)
    title.format.padding = new Padding(120, 16, 0, 16)
    subHeading.format.padding = new Padding(40)
    byline.format.padding = new Padding(32)

    section.format.height = Size.FIT_CONTENT
    section.format.gridPosition = new GridPosition(2, 6)
    section.contents = [image, title, subHeading, byline]
  }

  private static getOrCreateType<T extends ContentModel = TextContentModel>(
    type: ContentType,
    section: SectionModel,
  ): T {
    return this.getContentOfType(type, section) || ContentService.create(type)
  }

  private static getOrCreateParagraph(
    section: SectionModel,
    number = 0,
  ): TextContentModel {
    const existingParagraphs: TextContentModel[] = this.getContentsOfType(
      ContentType.PARAGRAPH,
      section,
    )

    return existingParagraphs.length > number
      ? existingParagraphs[number]
      : ContentService.create(ContentType.PARAGRAPH)
  }

  private static getContentOfType<T extends ContentModel = ContentModel>(
    type: ContentType,
    section: SectionModel,
  ): T {
    return section.contents.find((c) => c.type === type) as T
  }

  private static getContentsOfType<T extends ContentModel = ContentModel>(
    type: ContentType,
    section: SectionModel,
  ): T[] {
    return section.contents.filter((c) => c.type === type) as T[]
  }

  static removeContent(content: ContentModel, section: SectionModel) {
    const row = content.format.gridPosition.startRow
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
  static contentsToDb = (objects: any[]) =>
    objects?.map((o) => Transformer.modelToDb(o))

  static contentsToApp = (objects: any[]) =>
    objects?.map((o) =>
      Transformer.dbToModel<ContentModel>(
        o,
        !!o.type && o.type === ContentType.IMAGE
          ? ImageContentModel
          : TextContentModel,
      ),
    )
}
