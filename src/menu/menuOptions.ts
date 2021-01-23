import { MenuOption } from './MenuOption'
import StringUtils from '../services/utils/StringUtils'
import { ArticleType } from '../article/shared/ArticleType'

export const menuOptions = {
  ALL: new MenuOption('All', '/'),
  [ArticleType.DISH]: new MenuOption(
    'Dishes',
    `/${StringUtils.toLowerKebabCase(ArticleType.DISH)}`,
  ),
  [ArticleType.PORTRAIT]: new MenuOption(
    'Portraits',
    `/${StringUtils.toLowerKebabCase(ArticleType.PORTRAIT)}`,
  ),
  [ArticleType.RECIPE]: new MenuOption(
    'Recipes',
    `/${StringUtils.toLowerKebabCase(ArticleType.RECIPE)}`,
  ),
}