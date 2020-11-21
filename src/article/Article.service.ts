import { ArticleModel } from './Article.model'
import { ArticleType } from './ArticleType'
import { SectionModel } from './section/Section.model'
import { action } from 'mobx'
import { SectionService } from './section/Section.service'
import { SectionPreset } from './section/SectionPreset'
import StringUtils from '../services/utils/StringUtils'
import { ImageContentModel } from './content/image/ImageContent.model'
import { StorageService } from '../services/storage/Storage.service'
import { GridPositionService } from './grid/GridPosition.service'
import { GridPosition } from './grid/GridPosition'

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
    SectionService.applyPreset(SectionPreset.HALF_SCREEN_TITLE, section)
    article.sections = [section]
    return article
  }

  @action
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
    article.sections.push(section)
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
    article.sections = article.sections.filter((s) => s.uid !== section.uid)
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
}
