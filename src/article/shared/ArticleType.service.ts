import { ArticleType } from './ArticleType'
import StringUtils from '../../services/utils/StringUtils'

export class ArticleTypeService {
  static findByKebabCase(type: string): ArticleType {
    return Object.values(ArticleType).find(
      (t) => StringUtils.toLowerKebabCase(t) === type,
    )
  }
}
