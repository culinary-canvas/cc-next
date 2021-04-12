import ArticleApi from '../../article/Article.api'

export async function setShowOnStartPage(userId: string) {
  const articles = await ArticleApi.all()

  await Promise.all(
    articles.map((article) => {
      article.showOnStartPage = true
      console.log(`${article.title} -> showOnStartPage = true`)
      ArticleApi.save(article, userId)
    }),
  )
}
