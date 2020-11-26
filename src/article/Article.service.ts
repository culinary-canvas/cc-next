import { ArticleModel } from './Article.model'
import { ArticleType } from './ArticleType'
import { SectionModel } from './section/Section.model'
import { action } from 'mobx'
import { SectionService } from './section/Section.service'
import { SectionPreset } from './section/SectionPreset'
import StringUtils from '../services/utils/StringUtils'
import { ImageContentModel } from './content/image/ImageContent.model'
import { StorageService } from '../services/storage/Storage.service'

export class ArticleService {
  private static readonly IMAGE_SET_PROPERTY_NAMES = [
    'original',
    'cropped',
    'xl',
    'l',
    'm',
    's',
  ]

  @action
  static create(type = ArticleType.DISH) {
    const article = new ArticleModel()
    article.type = type

    const section = new SectionModel()
    section.sortOrder = 0
    SectionService.applyPreset(
      SectionPreset.HALF_SCREEN_IMAGE_TITLE_SUB_BYLINE,
      section,
    )
    article.sections = [section]
    return article
  }

  @action
  static addSection(section: SectionModel, article: ArticleModel) {
    section.sortOrder = article.sections.length
    article.sections.push(section)
  }

  static moveSection(
    section: SectionModel,
    newSortOrder: number,
    article: ArticleModel,
  ) {
    article.sections.find(
      (s) => s.uid !== section.uid && s.sortOrder === newSortOrder,
    ).sortOrder = section.sortOrder
    section.sortOrder = newSortOrder
  }

  static removeSection(section: SectionModel, article: ArticleModel) {
    article.sections = article.sections
      .sort((s1, s2) => s1.sortOrder - s2.sortOrder)
      .filter((s) => s.uid !== section.uid)
      .map((s, i) => {
        s.sortOrder = i
        return s
      })
  }

  static createSlug(article: ArticleModel) {
    return StringUtils.toLowerKebabCase(article.titleContent?.value)
  }

  static async uploadNewImages(
    article: ArticleModel,
    onProgress: (progress: number, message: string) => any,
    initialProgress = 0,
  ) {
    const newImagesCount = article.contents
      .filter((c) => c instanceof ImageContentModel && !!c.set.original?.url)
      .reduce((sum, content: ImageContentModel) => {
        let newSum = sum
        newSum += StorageService.isLocal(content.set.original.url) ? 1 : 0
        newSum += StorageService.isLocal(content.set.cropped.url) ? 1 : 0
        newSum += StorageService.isLocal(content.set.xl.url) ? 1 : 0
        newSum += StorageService.isLocal(content.set.l.url) ? 1 : 0
        newSum += StorageService.isLocal(content.set.m.url) ? 1 : 0
        newSum += StorageService.isLocal(content.set.s.url) ? 1 : 0
        return newSum
      }, 0)

    const progressPerImage = 0.5 / newImagesCount

    let accProgress = initialProgress

    const contentsWithImagesToUpload: ImageContentModel[] = article.contents.filter(
      (content) =>
        content instanceof ImageContentModel &&
        !!content.set.original?.url &&
        (StorageService.isLocal(content.set.original.url) ||
          StorageService.isLocal(content.set.cropped.url) ||
          StorageService.isLocal(content.set.xl.url) ||
          StorageService.isLocal(content.set.l.url) ||
          StorageService.isLocal(content.set.m.url) ||
          StorageService.isLocal(content.set.s.url)),
    ) as ImageContentModel[]

    return Promise.all(
      contentsWithImagesToUpload.map(async (content) => {
        return Promise.all(
          this.IMAGE_SET_PROPERTY_NAMES.filter((key) =>
            StorageService.isLocal(content.set[key].url),
          ).map(async (key) => {
            const image = content.set[key]
            image.url = await StorageService.storeFileFromLocalUrl(
              image.url,
              image.fileName,
              `articles/${article.slug}`,
              (uploadProgress) => {
                const newProgress =
                  accProgress + uploadProgress * progressPerImage

                return onProgress(newProgress, image.fileName)
              },
            )
            accProgress += progressPerImage
          }),
        )
      }),
    )
  }

  @action
  static changeSortOrderUp(target: ArticleModel, all: ArticleModel[]) {
    const other = all
      .filter((a) => a.sortOrder > target.sortOrder)
      .reduce((found, a) => (a.sortOrder < found.sortOrder ? a : found))
    target.sortOrder++
    other.sortOrder--
    return [target, other]
  }

  @action
  static changeSortOrderDown(target: ArticleModel, all: ArticleModel[]) {
    const other = all
      .filter((a) => a.sortOrder < target.sortOrder)
      .reduce((found, a) => (a.sortOrder > found.sortOrder ? a : found))
    console.log(target.sortOrder, other.sortOrder)
    target.sortOrder--
    other.sortOrder++
    return [target, other]
  }
}
