import { ArticleModel } from '../../article/models/Article.model'
import { Model } from '../db/Model'

export interface OrderByParams<T extends Model> {
  orderBy?: keyof T
  sortOrder?: 'asc' | 'desc'
}
