import 'firebase/auth'
import { createContext, useContext, useState } from 'react'
import { ArticleModel } from '../article/Article.model'
import { MenuOption } from './MenuOption'

export interface Breadcrumb {
  text: string
  href?: string
}

export interface MenuContextI {
  readonly currentArticle: ArticleModel
  readonly setCurrentArticle: (article: ArticleModel) => void
  readonly breadcrumbs: Breadcrumb[]
  readonly setBreadcrumbs: (contents: Breadcrumb[]) => void
  readonly activeMenuOption: MenuOption
  readonly setActiveMenuOption: (option: MenuOption) => void
}

export function useMenuState(): MenuContextI {
  const [currentArticle, setCurrentArticle] = useState<ArticleModel>()
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([])
  const [activeMenuOption, setActiveMenuOption] = useState<MenuOption>()

  return {
    currentArticle,
    setCurrentArticle,
    breadcrumbs,
    setBreadcrumbs,
    activeMenuOption,
    setActiveMenuOption,
  }
}

export const MenuContext = createContext<MenuContextI>(null)

export function useMenu(): MenuContextI {
  const context = useContext<MenuContextI>(MenuContext)
  if (context === undefined) {
    throw new Error('An error occurred when initializing Menu context')
  }
  return context
}
