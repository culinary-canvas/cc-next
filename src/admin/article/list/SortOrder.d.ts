import { ArticleModel } from '../../../article/Article.model'

export interface SortOrder<T = any> {
  key: keyof T
  order: 'asc' | 'desc'
}
