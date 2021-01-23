import React, { useCallback, useEffect, useReducer, useState } from 'react'
import './GridControl.module.scss'
import s from './GridControl.module.scss'
import { GridPositionService } from '../../../../../../../article/grid/GridPosition.service'
import { ArticlePart } from '../../../../../../../article/shared/ArticlePart'
import { useAdmin } from '../../../../../../Admin'
import { GridMap } from './GridMap'
import { GridControlMenu } from './GridControlMenu'
import { observer } from 'mobx-react'
import { GridSelect } from './GridSelect'
import { GridLayout } from './GridLayout'

interface Props<T extends ArticlePart> {
  parts: T[]
  currentPart: T
  columnDefinitions: string[]
  outlierColumns?: number[]
  id: string
  onDelete: (parts: T[]) => any
}

export const GridControl = observer(
  <T extends ArticlePart>(props: Props<T>) => {
    const {
      parts,
      columnDefinitions,
      currentPart,
      id,
      outlierColumns = [],
      onDelete,
    } = props

    const admin = useAdmin()
    const [gridMap, setGridMap] = useState<GridMap<T>>()
    const [isSelecting, selecting] = useState<boolean>(false)
    const [rowsHoverDisabled, disableHoverOfRows] = useState<number[]>([])
    const [hoveredRow, hoverRow] = useReducer<
      (
        prevState: number,
        action: { row?: number; disable?: number[] },
      ) => number
    >((row, set) => {
      disableHoverOfRows(set.disable || [])
      return !!set.row && !rowsHoverDisabled.includes(set.row) ? set.row : null
    }, null)

    useEffect(() => {
      setGridMap(
        new GridMap(
          GridPositionService.numberOfRows(parts),
          columnDefinitions.length,
          parts,
        ),
      )
    }, [parts, columnDefinitions])

    const onGridBlur = useCallback(() => {
      hoverRow({ row: null })
    }, [hoverRow])

    const onAreaHover = useCallback(
      (row: number, part?: T) => {
        if (!isSelecting) {
          hoverRow({ row })
        }
      },
      [hoverRow],
    )

    const onAreaClick = useCallback(
      (part: T) => {
        if (!!part && part.uid !== currentPart.uid) {
          admin.setArticlePart(part)
        }
      },
      [currentPart],
    )

    return (
      <article
        id={id}
        className={s.container}
        style={{ gridTemplateColumns: columnDefinitions.join(' ') }}
        onMouseLeave={() => onGridBlur()}
      >
        <GridLayout
          gridMap={gridMap}
          currentPart={currentPart}
          outlierColumns={outlierColumns}
          disable={isSelecting}
          disableHoverOfRows={rowsHoverDisabled}
          onHover={(row, column, part) => onAreaHover(row, part)}
          onClick={(part) => onAreaClick(part)}
        />

        {isSelecting && (
          <GridSelect
            currentPart={currentPart}
            gridMap={gridMap}
            onSelectDone={(row, column) => {
              onAreaHover(row, currentPart)
              selecting(false)
            }}
          />
        )}

        {!!hoveredRow && !isSelecting && (
          <GridControlMenu
            gridMap={gridMap}
            row={currentPart.format.gridPosition.startRow}
            part={currentPart}
            columnDefinitions={columnDefinitions}
            onDeleteRow={(parts) => onDelete(parts)}
            onRowUpClick={() =>
              hoverRow({
                row: currentPart.format.gridPosition.startRow - 1,
                disable: [currentPart.format.gridPosition.startRow],
              })
            }
            onRowDownClick={() =>
              hoverRow({
                row: currentPart.format.gridPosition.startRow + 1,
                disable: [
                  currentPart.format.gridPosition.startRow - 1,
                  currentPart.format.gridPosition.startRow,
                ],
              })
            }
            onEditPosition={() => selecting(!isSelecting)}
          />
        )}
      </article>
    )
  },
)
