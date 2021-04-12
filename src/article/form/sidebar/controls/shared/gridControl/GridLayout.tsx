import React, { useCallback, useReducer, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { GridPositionService } from '../../../../../grid/GridPosition.service'
import { GridContent } from './GridContent'
import { ArticlePart } from '../../../../../models/ArticlePart'
import { GridMap } from './GridMap'

interface Props<T extends ArticlePart> {
  gridMap: GridMap<T>
  currentPart: T
  outlierColumns: number[]
  disable: boolean
  disableHoverOfRows: number[]
  onHover: (row: number, column: number, part?: T) => void
  onClick: (part: T) => void
}

export const GridLayout = observer(<T extends ArticlePart>(props: Props<T>) => {
  const {
    gridMap,
    currentPart,
    outlierColumns,
    disable,
    disableHoverOfRows,
    onHover,
    onClick,
  } = props

  const [hoveringColumn, setHoveringColumn] = useState<number>()
  const [hoveringPart, setHoveringPart] = useState<T>()
  const [hoveringRow, setHoveringRow] = useReducer<
    (prevState: number, action: { row?: number; disable?: number[] }) => number
  >((row, set) => {
    if (!!set.row && !disableHoverOfRows.includes(set.row)) {
      return set.row
    }
  }, null)

  const onAreaHover = useCallback(
    (row: number, column: number, part?: T) => {
      setHoveringColumn(column)
      setHoveringPart(part)
      setHoveringRow({ row })
    },
    [setHoveringColumn, setHoveringPart, setHoveringRow],
  )

  return (
    <>
      {gridMap?.rows.map(([row, gridRow]) =>
        gridRow.columns.map(([column, gridColumn]) => (
          <React.Fragment key={`${row}_${column}`}>
            {!gridColumn.parts.length &&
            !GridPositionService.hasInPosition(gridMap.parts, row, column) ? (
              <GridContent
                key={`Area${row}_${column}`}
                rowStart={row}
                columnStart={column}
                isOutlier={outlierColumns.includes(column)}
                isHovered={
                  !hoveringPart &&
                  row === hoveringRow &&
                  column === hoveringColumn
                }
                onHover={() => {
                  if (!disable) {
                    onAreaHover(row, column)
                    onHover(row, column)
                  }
                }}
              />
            ) : (
              gridColumn.parts.map((part) => (
                <GridContent
                  key={part.uid}
                  part={part}
                  rowStart={part.format.gridPosition.startRow}
                  rowEnd={part.format.gridPosition.endRow}
                  columnStart={part.format.gridPosition.startColumn}
                  columnEnd={part.format.gridPosition.endColumn}
                  isInFocus={currentPart.uid === part.uid}
                  isHovered={hoveringPart?.uid === part.uid}
                  onHover={() => {
                    if (!disable) {
                      onAreaHover(row, column, part)
                      onHover(row, column, part)
                    }
                  }}
                  onMouseDown={() => !disable && onClick(part)}
                />
              ))
            )}
          </React.Fragment>
        )),
      )}
    </>
  )
})
