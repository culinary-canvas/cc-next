import { ArticleApi } from '../../article/Article.api'
import { Size } from '../../article/shared/format/Size'
import { ImageContentModel } from '../../article/content/image/ImageContent.model'
import { ImageFit } from '../../article/content/image/ImageFit'

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
        })
    })
    ArticleApi.save(article, userId)
  })
}
