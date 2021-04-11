import { action, computed, observable, reaction, makeObservable } from 'mobx';
import { GridPosition } from '../../../../../grid/GridPosition'
import { ArticlePart } from '../../../../../models/ArticlePart'
import { GridPositionService } from '../../../../../grid/GridPosition.service'

export class GridManager {
  constructor(part: ArticlePart, parts: ArticlePart[]) {
    makeObservable(this);
    this.part = part
    this.parts = parts
    this.updatePartOnChange()
  }

  @observable private readonly part: ArticlePart
  @observable private readonly parts: ArticlePart[]
  @observable private _markedRows = new Set<number>()
  @observable private _markedColumns = new Set<number>()
  @observable private firstMarkedRow: number
  @observable private firstMarkedColumn: number
  @observable private lastMarkedRow: number
  @observable private lastMarkedColumn: number
  @observable isMarking = false
  @observable private initialGridPosition: GridPosition

  @computed private get hasMarked() {
    return !!this._markedRows.size && !!this._markedColumns.size
  }

  @computed get gridPosition() {
    return !this.hasMarked
      ? null
      : new GridPosition(
          this.markedColumns[0],
          this.markedColumns[this._markedColumns.size - 1] + 1,
          this.markedRows[0],
          this.markedRows[this._markedRows.size - 1] + 1,
        )
  }

  @computed private get markedRows() {
    return Array.from(this._markedRows).sort((a, b) => a - b)
  }

  @computed private get markedColumns() {
    return Array.from(this._markedColumns).sort((a, b) => a - b)
  }

  @action start(row: number, column: number) {
    this.initialGridPosition = this.part.format.gridPosition
    this.isMarking = true
    this.markRow(row)
    this.markColumn(column)
  }

  @action stop() {
    if (this.isMarking) {
      this.isMarking = false
      this.clear()
    }
  }

  @action hovering(row: number, column: number) {
    if (this.isMarking) {
      this.unmarkLastRowBasedOnDirection(row)
      this.unmarkLastColumnBasedOnDirection(column)
      this.markRow(row)
      this.markColumn(column)
    }
  }

  @action private markColumn(column: number) {
    if (!this._markedColumns.size) {
      this.firstMarkedColumn = column
    }
    this._markedColumns.add(column)
    this.lastMarkedColumn = column
  }

  @action private markRow(row: number) {
    if (!this._markedRows.size) {
      this.firstMarkedRow = row
    }
    this._markedRows.add(row)
    this.lastMarkedRow = row
  }

  @action private unmarkLastColumnBasedOnDirection(column: number) {
    if (
      (this.lastMarkedColumn !== this.firstMarkedColumn &&
        column >= this.firstMarkedColumn &&
        column < this.lastMarkedColumn) ||
      (column <= this.firstMarkedColumn && column > this.lastMarkedColumn)
    ) {
      this._markedColumns.delete(this.lastMarkedColumn)
    }
  }

  @action private unmarkLastRowBasedOnDirection(row: number) {
    if (
      (this.lastMarkedRow !== this.firstMarkedRow &&
        row >= this.firstMarkedRow &&
        row < this.lastMarkedRow) ||
      (row <= this.firstMarkedRow && row > this.lastMarkedRow)
    ) {
      this._markedRows.delete(this.lastMarkedRow)
    }
  }

  @action private clear() {
    this.firstMarkedRow = null
    this.firstMarkedColumn = null
    this.lastMarkedColumn = null
    this.lastMarkedRow = null
    this._markedRows = new Set()
    this._markedColumns = new Set()
    this.initialGridPosition = null
  }

  private updatePartOnChange() {
    reaction(
      () => this.gridPosition,
      () => !!this.gridPosition && this.updatePart(),
    )
  }

  @action private updatePart() {
    const overlappingBefore = GridPositionService.overlappingParts(
      this.parts,
      this.initialGridPosition,
      this.part,
    )
    this.part.format.gridPosition = this.gridPosition
    Array.of(this.part, ...overlappingBefore).forEach((p) =>
      GridPositionService.autoSetLayersInPosition(
        this.parts,
        p.format.gridPosition,
      ),
    )
  }
}
