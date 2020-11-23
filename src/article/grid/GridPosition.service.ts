import { GridPosition } from './GridPosition'
import { action, toJS } from 'mobx'
import { CSSProperties } from 'react'
import { ArticlePart } from '../ArticlePart'
import { inRange } from 'lodash'
import { ArrayUtils } from '../../services/utils/ArrayUtils'

export class GridPositionService {
  static gridPositionAsCss(gridPosition: GridPosition) {
    const css: CSSProperties = {}
    css.gridColumnStart = gridPosition.startColumn
    css.gridColumnEnd = gridPosition.endColumn
    css.gridRowStart = gridPosition.startRow
    css.gridRowEnd = gridPosition.endRow
    return css
  }

  static overlaps(
    part: ArticlePart,
    startRow: number,
    endRow: number,
    startColumn: number,
    endColumn: number,
  ): boolean {
    const partPos = part.format.gridPosition

    const columnInSpan = ArrayUtils.numbered(
      partPos.endColumn - partPos.startColumn,
      partPos.startColumn,
    ).some((column) => inRange(column, startColumn, endColumn))

    const rowInSpan = ArrayUtils.numbered(
      partPos.endRow - partPos.startRow,
      partPos.startRow,
    ).some((row) => inRange(row, startRow, endRow))

    return columnInSpan && rowInSpan
  }

  static isInPosition(part: ArticlePart, row: number, column: number): boolean {
    return (
      part.format.gridPosition.startRow <= row &&
      part.format.gridPosition.endRow > row &&
      part.format.gridPosition.startColumn <= column &&
      part.format.gridPosition.endColumn > column
    )
  }

  static overlappingParts<T extends ArticlePart>(
    parts: T[],
    gridPosition: GridPosition,
    excludedPart?: T | T[],
  ): T[] {
    const excludedParts = ArrayUtils.asArray(excludedPart)
    const overlapping = parts
      .filter((p) => !excludedParts.some((e) => p.uid === e.uid))
      .filter((p) =>
        this.overlaps(
          p,
          gridPosition.startRow,
          gridPosition.endRow,
          gridPosition.startColumn,
          gridPosition.endColumn,
        ),
      )
    return [
      ...overlapping,
      ...overlapping.flatMap((o) =>
        this.overlappingParts(parts, o.format.gridPosition, [
          ...overlapping,
          ...excludedParts,
        ]),
      ),
    ]
  }

  static hasInPosition(parts: ArticlePart[], row: number, column: number) {
    return parts.some((part) => this.isInPosition(part, row, column))
  }

  static withStartPosition<T extends ArticlePart>(
    parts: T[],
    row: number,
    column: number,
  ): T[] {
    return parts.filter(
      (part) =>
        part.format.gridPosition.startColumn === column &&
        part.format.gridPosition.startRow === row,
    )
  }

  @action
  static moveUp(row: number, parts: ArticlePart[]) {
    const target = this.partsStartingOnRow(parts, row)
    const replaces = this.partsStartingOnRow(parts, row - 1)

    target.forEach((p) => this._moveUp(p))
    replaces.forEach((p) => this._moveDown(p))
  }

  @action
  static moveDown(row: number, parts: ArticlePart[]) {
    const target = this.partsStartingOnRow(parts, row)
    const replaces = this.partsStartingOnRow(parts, row + 1)

    target.forEach((p) => this._moveDown(p))
    replaces.forEach((p) => this._moveUp(p))
  }

  private static _moveUp(p: ArticlePart) {
    p.format.gridPosition.startRow = p.format.gridPosition.startRow - 1
    p.format.gridPosition.endRow = p.format.gridPosition.endRow - 1
  }

  private static _moveDown(p: ArticlePart) {
    p.format.gridPosition.startRow = p.format.gridPosition.startRow + 1
    p.format.gridPosition.endRow = p.format.gridPosition.endRow + 1
  }

  @action
  static addRow(afterRow: number, parts: ArticlePart[]) {
    const rows = this.numberOfRows(parts)

    for (let i = rows + 1; i > afterRow; i--) {
      const rowParts = this.partsStartingOnRow(parts, i)
      rowParts.forEach((p) => this._moveDown(p))
    }
  }

  static numberOfRows(parts: ArticlePart[]) {
    return parts.reduce(
      (max, part) =>
        part.format.gridPosition.endRow - 1 > max
          ? part.format.gridPosition.endRow - 1
          : max,
      0,
    )
  }

  static partsStartingOnRow(parts: ArticlePart[], row: number) {
    return parts.filter((p) => p.format.gridPosition.startRow === row)
  }

  static partsEndingOnRow(parts: ArticlePart[], row: number) {
    return parts.filter((p) => p.format.gridPosition.endRow === row)
  }

  static deleteRow(row: number, parts: ArticlePart[]) {
    const rows = this.numberOfRows(parts) + 1
    for (let i = row; i <= rows; i++) {
      const partsToShrink = this.partsEndingOnRow(parts, i)
      console.log('parts to shrink', i, toJS(partsToShrink))
      partsToShrink.forEach(
        (p) =>
          (p.format.gridPosition.endRow = p.format.gridPosition.endRow - 1),
      )
      if (i > row) {
        const partsToMoveUp = this.partsStartingOnRow(parts, i)
        partsToMoveUp.forEach((p) => this._moveUp(p))
      }
    }
  }

  static autoSetLayersInPosition(
    parts: ArticlePart[],
    gridPosition: GridPosition,
  ) {
    this.overlappingParts(parts, gridPosition)
      .sort((p1, p2) =>
        this.sort(p1.format.gridPosition, p2.format.gridPosition),
      )
      .forEach((p, i) => (p.format.layer = i))
  }

  static sort(gridPosition1: GridPosition, gridPosition2: GridPosition) {
    if (gridPosition1.startRow < gridPosition2.startRow) {
      return -1
    }
    if (gridPosition1.startRow > gridPosition2.startRow) {
      return 1
    }

    if (gridPosition1.startColumn < gridPosition2.startColumn) {
      return -1
    }
    if (gridPosition1.startColumn > gridPosition2.startColumn) {
      return 1
    }

    if (
      gridPosition1.endRow - gridPosition1.startRow >
      gridPosition2.endRow - gridPosition2.startRow
    ) {
      return -1
    }
    if (
      gridPosition1.endRow - gridPosition1.startRow <
      gridPosition2.endRow - gridPosition2.startRow
    ) {
      return 1
    }
    if (
      gridPosition1.endColumn - gridPosition1.startColumn >
      gridPosition2.endColumn - gridPosition2.startColumn
    ) {
      return -1
    }
    if (
      gridPosition1.endColumn - gridPosition1.startColumn <
      gridPosition2.endColumn - gridPosition2.startColumn
    ) {
      return 1
    }
    return 0
  }

  static layerUp(hoveringPart: ArticlePart, parts: ArticlePart[]) {
    this.overlappingParts(
      parts,
      hoveringPart.format.gridPosition,
      hoveringPart,
    ).forEach((p) => {
      if (p.format.layer > hoveringPart.format.layer) {
        p.format.layer -= 1
      }
    })
    hoveringPart.format.layer += 1
  }

  static layerDown(hoveringPart: ArticlePart, parts: ArticlePart[]) {
    this.overlappingParts(
      parts,
      hoveringPart.format.gridPosition,
      hoveringPart,
    ).forEach((p) => {
      if (p.format.layer < hoveringPart.format.layer) {
        p.format.layer += 1
      }
    })
    hoveringPart.format.layer -= 1
  }
}
