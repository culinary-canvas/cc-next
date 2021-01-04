import { MenuOptionDefinition } from './MenuOptionDefinition'
import StringUtils from '../services/utils/StringUtils'
import { ArticleType } from '../article/shared/ArticleType'

export const menuOptions: MenuOptionDefinition[] = [
  new MenuOptionDefinition({
    path: '/',
    label: 'All',
  }),
  new MenuOptionDefinition({
    path: `/${StringUtils.toLowerKebabCase(ArticleType.DISH)}`,
    label: 'Dishes',
    articleType: ArticleType.DISH,
  }),
  new MenuOptionDefinition({
    path: `/${StringUtils.toLowerKebabCase(ArticleType.RECIPE)}`,
    label: 'Recipes',
    articleType: ArticleType.RECIPE,
  }),
  new MenuOptionDefinition({
    path: `/${StringUtils.toLowerKebabCase(ArticleType.PORTRAIT)}`,
    label: 'Portraits',
    articleType: ArticleType.PORTRAIT,
  }),
  new MenuOptionDefinition({
    path: '/admin',
    label: 'Admin',
    isAdmin: true,
    includeSubRoutes: true,
    hideOnMobile: true,
  }),
  new MenuOptionDefinition({
    path: '/admin/articles/grid-preview',
    label: 'Preview start page',
    isAdmin: true,
  }),
  new MenuOptionDefinition({
    name: 'signOut',
    label: 'Sign out',
    isAdmin: true,
  }),
]
