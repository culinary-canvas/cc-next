import { Model } from '../db/Model'
import { isNil } from '../importHelpers'
import { OrderByParams } from '../api/OrderByParams'
import { PagingParams } from '../api/PagingParams'
import { Query } from '@firebase/firestore-types'

export class FirestoreHelper {
  static addPagingIfPresent(query: Query, options: PagingParams): Query {
    if (!!options.limit) {
      query = query.limit(options.limit)
    }
    if (!isNil(options.startAfter)) {
      query = query.startAfter(options.startAfter)
    }
    return query
  }

  static addOrderByIfPresent<T extends Model>(
    query: Query,
    options: OrderByParams<T>,
  ): Query {
    if (!!options.orderBy) {
      return query.orderBy(options.orderBy as string, options.sortOrder)
    }
    return query
  }
}
