import { ArticleApi } from '../../article/Article.api'
import { ArticleType } from '../../article/shared/ArticleType'

export async function changeArticleTypeHOW_TOToRECIPE(userId: string) {
  const articles = await ArticleApi.all()
  articles
    .filter((a) => a.type === ArticleType.HOW_TO)
    .forEach((article) => {
      article.type = ArticleType.RECIPE
      ArticleApi.save(article, userId)
    })
}
