import { useState } from 'react'
import { useUnmount } from './useUnmount'
import { useAutorun } from './useAutorun'
import {Article} from '../domain/Article/Article'
import {useEnv} from '../services/AppEnvironment'
import {ArticleService} from '../domain/Article/Article.service'

export function useArticle(titleForUrl: string): Article {
  const env = useEnv()
  const [article, setArticle] = useState<Article>()

  useAutorun(() => {
    if (
      !env.articleStore.current ||
      env.articleStore.current.titleForUrl !== titleForUrl
    ) {
      if (!!titleForUrl) {
        env.articleStore.getByTitleForUrl(titleForUrl).then((a) => {
          setArticle(a)
          env.articleStore.setCurrent(a)
        })
      } else {
        const a = ArticleService.create()
        setArticle(a)
        env.articleStore.setCurrent(a)
      }
    } else {
      setArticle(env.articleStore.current)
    }
  }, [env.articleStore, titleForUrl])

  useUnmount(() => {
    env.articleStore.setCurrent(null)
  })

  return article
}
