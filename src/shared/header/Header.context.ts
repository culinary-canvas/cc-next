import 'firebase/auth'
import { createContext, useContext, useState } from 'react'
import { ArticleModel } from '../../article/models/Article.model'

export interface HeaderContextI {
  readonly currentArticle: ArticleModel
  readonly setCurrentArticle: (article: ArticleModel) => void
}

export function useHeaderState(): HeaderContextI {
  const [currentArticle, setCurrentArticle] = useState<ArticleModel>()

  return {
    currentArticle,
    setCurrentArticle,
  }
}

export const HeaderContext = createContext<HeaderContextI>(null)

export function useHeader(): HeaderContextI {
  const context = useContext<HeaderContextI>(HeaderContext)
  if (context === undefined) {
    throw new Error('An error occurred when initializing Header context')
  }
  return context
}
