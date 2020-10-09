import { Article } from '../../domain/Article/Article'

export interface SortOrder<T = any> {
  key: keyof T
  order: 'asc' | 'desc'
}
