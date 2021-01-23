import { Model } from '../db/Model'
import { OrderByParams } from './OrderByParams'
import { PagingParams } from './PagingParams'

export type QueryParams<T extends Model> = OrderByParams<T> & PagingParams
