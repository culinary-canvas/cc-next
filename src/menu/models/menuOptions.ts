import { MenuOption } from './MenuOption'
import StringUtils from '../../services/utils/StringUtils'
import { ArticleType } from '../../article/models/ArticleType'

export const menuOptions = {
  ALL: new MenuOption('All', '/'),
  index: new MenuOption(
    'Index',
    `/${StringUtils.toLowerKebabCase(ArticleType.DISH)}`,
  ),
  articles: new MenuOption(
    'Articles',
    `/${StringUtils.toLowerKebabCase(ArticleType.PORTRAIT)}`,
  ),
  about: new MenuOption(
    'About',
    `/${StringUtils.toLowerKebabCase(ArticleType.RECIPE)}`,
  ),
  [ArticleType.TIDBITS]: new MenuOption(
    'Tidbits',
    `/${StringUtils.toLowerKebabCase(ArticleType.TIDBITS)}`,
  ),
  PARTNERS: new MenuOption('Partners', '/partners', [
    new MenuOption('Education', '/education'),
  ]),
}
