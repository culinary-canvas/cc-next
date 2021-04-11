import { ArticleModel } from './models/Article.model'
import { ArticleType } from './models/ArticleType'
import { SectionModel } from './models/Section.model'
import { runInAction } from 'mobx'
import { SectionService } from './section/Section.service'
import { SectionPreset } from './models/SectionPreset'
import StringUtils from '../services/utils/StringUtils'
import { ImageContentModel } from './models/ImageContent.model'
import { StorageService } from '../services/storage/Storage.service'
import { GridPositionService } from './grid/GridPosition.service'
import { GridPosition } from './grid/GridPosition'
import { TagApi } from '../tag/Tag.api'
import { TagModel } from '../tag/models/Tag.model'
import { ContentType } from './models/ContentType'
import { TextContentModel } from './models/TextContent.model'
import { TextEditService } from './form/text/TextEdit.service'
import { PersonApi } from '../person/Person.api'
import { CompanyApi } from '../company/Company.api'
import { ImageFile } from '../image/models/ImageFile'

export class ArticleService {
  private static readonly IMAGE_SET_PROPERTY_NAMES = ['original', 'cropped']

  static create(type = ArticleType.DISH) {
    const article = new ArticleModel()
    article.type = type

    const section = SectionService.create()
    SectionService.applyPreset(SectionPreset.HALF_SCREEN_TITLE, section)
    article.sections = [section]
    return article
  }

  static addSection(section: SectionModel, article: ArticleModel) {
    if (!section.format.gridPosition) {
      const row = GridPositionService.numberOfRows(article.sections) + 1
      section.format.gridPosition = new GridPosition(2, 6, row, row + 1)
    } else {
      GridPositionService.addRow(
        section.format.gridPosition.startRow,
        article.sections,
      )
      section.format.gridPosition.startRow += 1
      section.format.gridPosition.endRow += 1
    }
    runInAction(() => {
      article.sections.push(section)
    })
  }

  static removeSection(section: SectionModel, article: ArticleModel) {
    const row = section.format.gridPosition.startRow
    if (
      GridPositionService.partsStartingOnRow(article.sections, row).length ===
        1 &&
      GridPositionService.numberOfRows(article.sections) > 1
    ) {
      GridPositionService.deleteRow(row, article.sections)
    }
    runInAction(() => {
      article.sections = article.sections.filter((s) => s.uid !== section.uid)
    })
  }

  static async uploadNewImages(
    article: ArticleModel,
    onProgress: (progress: number, message: string) => any,
    initialProgress = 0,
  ) {
    const imageFilesToUpload: ImageFile[] = article.contents.flatMap(
      (content) => {
        const toUpload: ImageFile[] = []

        if (
          content instanceof ImageContentModel &&
          !!content.set.original?.url
        ) {
          if (StorageService.isLocal(content.set.original.url)) {
            toUpload.push(content.set.original)
          }
          if (StorageService.isLocal(content.set.cropped.url)) {
            toUpload.push(content.set.cropped)
          }
        }
        return toUpload
      },
    )

    if (
      !!article.preview.image.original?.url &&
      StorageService.isLocal(article.preview.image.original.url)
    ) {
      imageFilesToUpload.push(article.preview.image.original)
      imageFilesToUpload.push(article.preview.image.cropped)
    }

    const progressPerImage = 0.5 / imageFilesToUpload.length
    let accProgress = initialProgress

    return Promise.all(
      imageFilesToUpload.map(async (image) => {
        const _url = await StorageService.storeFileFromLocalUrl(
          image.url,
          image.fileName,
          `articles/${article.slug}`,
          (uploadProgress) => {
            const newProgress = accProgress + uploadProgress * progressPerImage

            return onProgress(newProgress, image.fileName)
          },
        )
        runInAction(() => {
          image.url = _url
        })
        accProgress += progressPerImage
      }),
    )
  }

  static changeSortOrderUp(target: ArticleModel, all: ArticleModel[]) {
    const other = all
      .filter((a) => a.sortOrder > target.sortOrder)
      .reduce((found, a) => (a.sortOrder < found.sortOrder ? a : found))
    runInAction(() => {
      target.sortOrder++
      other.sortOrder--
    })
    return [target, other]
  }

  static changeSortOrderDown(target: ArticleModel, all: ArticleModel[]) {
    const other = all
      .filter((a) => a.sortOrder < target.sortOrder)
      .reduce((found, a) => (a.sortOrder > found.sortOrder ? a : found))
    runInAction(() => {
      target.sortOrder--
      other.sortOrder++
    })
    return [target, other]
  }

  static async setArticleTypeAsTag(article: ArticleModel, userId: string) {
    const tagName = StringUtils.toDisplayText(article.type)
    if (!article.tagNames.includes(tagName)) {
      const tagExists = await TagApi.existsByName(tagName)
      if (!tagExists) {
        const tag = new TagModel()
        tag.name = tagName
        await TagApi.save(tag, userId)
      }
      runInAction(() => {
        article.tagNames.push(tagName)
      })
    }
  }

  static async removeLinks(article: ArticleModel, linkedText: string) {
    article.contents
      .filter(
        (c) =>
          c instanceof TextContentModel &&
          c.type !== ContentType.TITLE &&
          !!c.value &&
          !!linkedText &&
          c.value.toLowerCase().includes(linkedText?.toLowerCase()),
      )
      .forEach((content: TextContentModel) => {
        const start = content.value
          .toLowerCase()
          .indexOf(linkedText.toLowerCase())
        const end = start + linkedText.length
        if (TextEditService.hasLinkInPosition(content.value, start, end)) {
          const unlinked = TextEditService.removeLinkInPosition(
            content.value,
            start,
            end,
          )
          runInAction(() => (content.value = unlinked))
        }
      })
  }

  static async addLinks(article: ArticleModel, text: string, link: string) {
    article.contents
      .filter(
        (c) =>
          c instanceof TextContentModel &&
          c.type !== ContentType.TITLE &&
          !!c.value &&
          c.value.toLowerCase().includes(text.toLowerCase()),
      )
      .forEach((content: TextContentModel) => {
        const start = content.value.toLowerCase().indexOf(text.toLowerCase())
        const end = start + text.length
        if (!TextEditService.hasLinkInPosition(content.value, start, end)) {
          const linked = TextEditService.insertLinkAtPosition(
            content.value,
            link,
            start,
            end,
          )
          runInAction(() => (content.value = linked))
        }
      })
  }

  static async populate(article: ArticleModel): Promise<void> {
    if (!!article.personIds.length) {
      const persons = await PersonApi.byIds(article.personIds)
      runInAction(() => (article.persons = persons))
    }
    if (!!article.companyIds.length) {
      const companies = await CompanyApi.byIds(article.companyIds)
      runInAction(() => (article.companies = companies))
    }
  }
}
