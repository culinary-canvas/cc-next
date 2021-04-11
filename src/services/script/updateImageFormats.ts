import { ArticleApi } from '../../article/Article.api'
import { Size } from '../../article/models/Size'
import { ImageContentModel } from '../../article/models/ImageContent.model'
import { ImageFit } from '../../article/models/ImageFit'
import { HorizontalAlign } from '../../article/models/HorizontalAlign'
import { VerticalAlign } from '../../article/models/VerticalAlign'

export async function updateImageFormats(userId: string) {
  const articles = await ArticleApi.all()
  articles.forEach((article) => {
    article.sections.forEach((section) => {
      section.contents
        .filter((content) => {
          console.log(content)
          return content instanceof ImageContentModel
        })
        .forEach((content: ImageContentModel) => {
          const fit =
            section.format.height === Size.FIT_CONTENT
              ? ImageFit.CONTAIN
              : ImageFit.COVER
          console.log('setting fit', fit)
          content.format.fit = fit
          content.format.horizontalAlign = HorizontalAlign.CENTER
          content.format.verticalAlign = VerticalAlign.CENTER
        })
    })
    ArticleApi.save(article, userId)
  })
}
