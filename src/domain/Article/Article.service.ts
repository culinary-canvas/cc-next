import { Article } from './Article'
import { ArticleType } from './ArticleType'
import { Section } from '../Section/Section'
import { action } from 'mobx'
import { SectionService } from '../Section/Section.service'
import { SectionPreset } from '../Section/SectionPreset'
import StringUtils from '../../services/utils/StringUtils'
import { ImageContent } from '../Image/ImageContent'
import { StorageService } from '../../services/storage/Storage.service'

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
    const article = new Article()
    article.type = type

    const section = new Section()
    section.sortOrder = 0
    SectionService.applyPreset(
      SectionPreset.HALF_SCREEN_IMAGE_TITLE_SUB_BYLINE,
      section,
    )
    article.sections = [section]
    return article
  }

  @action
  static addSection(section: Section, article: Article) {
    section.sortOrder = article.sections.length
    article.sections.push(section)
  }

  static moveSection(section: Section, newSortOrder: number, article: Article) {
    article.sections.find(
      (s) => s.uid !== section.uid && s.sortOrder === newSortOrder,
    ).sortOrder = section.sortOrder
    section.sortOrder = newSortOrder
  }

  static removeSection(section: Section, article: Article) {
    article.sections = article.sections
      .sort((s1, s2) => s1.sortOrder - s2.sortOrder)
      .filter((s) => s.uid !== section.uid)
      .map((s, i) => {
        s.sortOrder = i
        return s
      })
  }

  static createSlug(article: Article) {
    return StringUtils.toLowerKebabCase(article.titleContent?.value)
  }

  static async uploadNewImages(
    article: Article,
    onProgress: (progress: number, message: string) => any,
    initialProgress = 0,
  ) {
    const newImagesCount = article.contents
      .filter((c) => c instanceof ImageContent && !!c.set.original?.url)
      .reduce((sum, content: ImageContent) => {
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

    const contentsWithImagesToUpload: ImageContent[] = article.contents.filter(
      (content) =>
        content instanceof ImageContent &&
        !!content.set.original?.url &&
        (StorageService.isLocal(content.set.original.url) ||
          StorageService.isLocal(content.set.cropped.url) ||
          StorageService.isLocal(content.set.xl.url) ||
          StorageService.isLocal(content.set.l.url) ||
          StorageService.isLocal(content.set.m.url) ||
          StorageService.isLocal(content.set.s.url)),
    ) as ImageContent[]

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
}
