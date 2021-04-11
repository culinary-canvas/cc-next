import { Sortable } from '../types/Sortable'

export class SortableService {
  static getSorted<T extends Sortable>(
    sortables: T[],
    order: 'asc' | 'desc' = 'asc',
  ): T[] {
    return sortables
      .slice()
      .sort((s1, s2) =>
        order === 'asc'
          ? s1.sortOrder - s2.sortOrder
          : s2.sortOrder - s1.sortOrder,
      )
  }

  static ungapSortOrders(sortables: Sortable[]) {
    this.getSorted(sortables).forEach((s, i) => {
      s.sortOrder = i
    })
  }
}
