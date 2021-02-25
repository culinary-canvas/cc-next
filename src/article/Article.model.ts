import { Model } from '../services/db/Model'
import { computed, observable } from 'mobx'
import { SectionModel } from './section/Section.model'
import { ArticleType } from './shared/ArticleType'
import { ContentType } from './content/ContentType'
import { field } from '../services/db/decorators/field.decorator'
import { TextContentModel } from './content/text/TextContent.model'
import { ContentModel } from './content/ContentModel'
import { ImageContentModel } from './content/image/ImageContent.model'
import { Sortable } from '../types/Sortable'
import { isSystemColor } from '../styles/_color'
import { ArticleFormat } from './shared/ArticleFormat'
import { transient } from '../services/db/decorators/transient.decorator'
import { PersonModel } from '../person/Person.model'
import { CompanyModel } from '../company/Company.model'
import { ArticlePreviewModel } from './preview/ArticlePreview.model'

export class ArticleModel implements Model, Sortable {
  @observable
  @field()
  id: string

  @observable
  @field(Date)
  created: Date

  @observable
  @field()
  createdById: string

  @observable
  @field(Date)
  modified: Date

  @observable
  @field()
  modifiedById: string

  @observable
  @field()
  sortOrder: number

  @observable
  @field(ArticlePreviewModel)
  preview: ArticlePreviewModel = new ArticlePreviewModel()

  @observable
  @field(SectionModel)
  sections: SectionModel[] = []

  @observable
  @field()
  authorId: string

  @observable
  @field()
  type: ArticleType

  @observable
  @field()
  tagNames: string[] = []

  @observable
  @field()
  promoted = false

  @observable
  @field()
  published = false

  @observable
  @field()
  slug: string

  @observable
  @field()
  format = new ArticleFormat()

  @observable
  @field()
  personIds: string[] = []

  @observable
  @field()
  companyIds: string[] = []

  @observable
  @transient()
  persons: PersonModel[] = []

  @observable
  @transient()
  companies: CompanyModel[] = []

  @computed
  get isPopulated(): boolean {
    return (
      this.companies.length === this.companyIds.length &&
      this.persons.length === this.personIds.length
    )
  }

  @computed get contents(): ContentModel[] {
    return this.sections.flatMap((s) => s.contents)
  }

  @computed get titleSection(): SectionModel {
    return this.sections[0]
  }

  @computed get titleContent(): TextContentModel {
    return (this.titleSection.contents.find(
      (c) => c instanceof TextContentModel && c.type === ContentType.TITLE,
    ) as unknown) as TextContentModel
  }

  @computed get title(): string {
    return this.titleContent?.value
  }

  @computed get subHeading(): string {
    return (this.titleSection.contents.find(
      (c) => c.type === ContentType.SUB_HEADING,
    ) as TextContentModel)?.value
  }

  @computed get imageContent(): ImageContentModel {
    return this.contents.find(
      (c) => c instanceof ImageContentModel,
    ) as ImageContentModel
  }

  @computed get colors(): string[] {
    const customColors = new Set<string>()
    this.sections
      .filter(
        (s) =>
          !!s.format.backgroundColor &&
          !isSystemColor(s.format.backgroundColor),
      )
      .forEach((s) => customColors.add(s.format.backgroundColor))
    this.contents
      .filter(
        (c) =>
          c instanceof TextContentModel &&
          !!c.format.color &&
          !isSystemColor(c.format.color),
      )
      .forEach((c) => customColors.add((c as TextContentModel).format.color))
    return Array.from(customColors)
  }
}
