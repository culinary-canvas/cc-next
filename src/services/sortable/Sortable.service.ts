import {Sortable} from '../../types/Sortable'
import {isNil} from '../importHelpers'

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

  static fixSortOrders<T extends Sortable>(sortables: Sortable[]) {
    this.fixDuplicateSortOrders(sortables)
    this.fixMissingSortOrders(sortables)
    this.ungapSortOrders(sortables)
  }

  private static resetSortOrders(sortables: Sortable[]) {
    sortables.forEach((s, i) => (s.sortOrder = i))
  }

  private static fixDuplicateSortOrders(sortables: Sortable[]) {
    const counts = new Map<number, number>()
    sortables.forEach((s) => {
      if (counts.has(s.sortOrder)) {
        counts.set(s.sortOrder, counts.get(s.sortOrder) + 1)
      } else {
        counts.set(s.sortOrder, 1)
      }
    })
    if (Array.from(counts.values()).some((v) => v > 1)) {
      this.resetSortOrders(sortables)
    }
  }

  private static fixMissingSortOrders(sortables: Sortable[]) {
    if (sortables.some((s) => isNil(s.sortOrder))) {
      this.resetSortOrders(sortables)
    }
  }

  static ungapSortOrders(sortables: Sortable[]) {
    this.getSorted(sortables).forEach((s, i) => {
      s.sortOrder = i
    })
  }
}
