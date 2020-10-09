import { useReducer } from 'react'
import { SortOrder } from '../components/ArticleList/SortOrder'

export function useSortOrder<T = any>(
  initial: SortOrder<T>,
): [SortOrder, (key: keyof T) => void] {
  const [sortOrder, setSortOrder] = useReducer<
    (p: SortOrder<T>, k: keyof T) => SortOrder
  >((prev, key) => {
    let order: 'asc' | 'desc' = 'asc'
    if (prev.key === key && prev.order === 'asc') {
      order = 'desc'
    }

    return {
      key,
      order,
    }
  }, initial)

  return [sortOrder, setSortOrder]
}
