import { action, computed, observable } from 'mobx'
import { ArticlePart } from '../../../../../../../article/shared/ArticlePart'
import { GridPositionService } from '../../../../../../../article/grid/GridPosition.service'
import { ArrayUtils } from '../../../../../../../services/utils/ArrayUtils'
import { SectionModel } from '../../../../../../../article/section/Section.model'
import { Size } from '../../../../../../../article/shared/format/Size'

export class GridMap<T extends ArticlePart> {
  @observable private readonly rowsMap = new Map<number, GridRow<T>>()
  @observable private readonly appendedMap = new Map<number, GridRow<T>>()
  @observable private readonly rowCount: number
  @observable private readonly columnsCount: number
  @observable readonly parts: T[]

  @computed get rows() {
    return [
      ...Array.from(this.rowsMap.entries()),
      ...Array.from(this.appendedMap.entries()),
    ]
  }

  @action append() {
    const gridRow = new GridRow<T>()
    ArrayUtils.numbered(this.columnsCount, 1).forEach((c) =>
      gridRow.set(c, new GridColumn<T>()),
    )
    const row = this.rowCount + this.appendedMap.size + 1
    this.appendedMap.set(row, gridRow)
  }

  @action removeAppended() {
    this.appendedMap.delete(this.appendedMap.size - 1)
  }

  isRow(row: number) {
    return row <= this.rowCount
  }

  constructor(rows: number, columns: number, parts: T[]) {
    this.rowCount = rows
    this.columnsCount = columns
    this.parts = parts

    ArrayUtils.numbered(rows, 1).forEach((row) => {
      const gridRow = new GridRow<T>()
      ArrayUtils.numbered(columns, 1).forEach((column) => {
        const cellParts = GridPositionService.withStartPosition(
          parts,
          row,
          column,
        )
        const gridColumn = new GridColumn<T>(cellParts)
        gridRow.set(column, gridColumn)
      })
      this.rowsMap.set(row, gridRow)
    })
  }

  get(row: number) {
    return this.rowsMap.get(row)
  }

  isFirst(row: number) {
    return row === 1
  }

  isLast(row: number) {
    return this.rows.length === row
  }
}

export class GridRow<T extends ArticlePart> {
  @observable private readonly columnsMap = new Map<number, GridColumn<T>>()

  @computed get columns() {
    return Array.from(this.columnsMap.entries())
  }

  @computed get parts() {
    return Array.from(this.columnsMap.values()).flatMap((c) => c.parts)
  }

  @computed get isEmpty() {
    return !this.parts.length
  }

  @action set(index: number, column: GridColumn<T>) {
    this.columnsMap.set(index, column)
  }

  get(column: number) {
    return this.columnsMap.get(column)
  }

  @computed get isFullHeight() {
    return this.parts
      .filter((p) => p instanceof SectionModel)
      .some(
        (p) =>
          ((p as unknown) as SectionModel).format.height === Size.FULL_SCREEN,
      )
  }
}

export class GridColumn<T extends ArticlePart> {
  @observable readonly parts: T[] = []

  @computed get size() {
    return this.parts.length
  }

  constructor(parts: T[] = []) {
    this.parts = parts
  }
}
