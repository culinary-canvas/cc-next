import ArticleApi from '../../article/Article.api'
import { ArticleService } from '../../article/Article.service'

export async function setArticleTypeAsTag(userId: string) {
  const articles = await ArticleApi.all()
  return Promise.all(
    articles.map(async (article) => {
      await ArticleService.setArticleTypeAsTag(article, userId)
      await ArticleApi.save(article, userId)
    }),
  )
}
