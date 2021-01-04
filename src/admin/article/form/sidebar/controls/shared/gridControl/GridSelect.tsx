import React, { useState } from 'react'
import { GridManager } from './GridManager'
import { ArticlePart } from '../../../../../../../article/shared/ArticlePart'
import { useAutorun } from '../../../../../../../hooks/useAutorun'
import { GridMap } from './GridMap'
import { classnames } from '../../../../../../../services/importHelpers'
import s from './GridSelect.module.scss'
import { observer } from 'mobx-react'

interface Props<T extends ArticlePart> {
  gridMap: GridMap<T>
  currentPart: T
  onSelectDone: (row: number, column: number) => void
}

export const GridSelect = observer(<T extends ArticlePart>(props: Props<T>) => {
  const { gridMap, currentPart, onSelectDone } = props
  const [handler, setHandler] = useState<GridManager>(
    new GridManager(currentPart, gridMap.parts),
  )

  useAutorun(() => {
    if (!handler || !handler.isMarking) {
      setHandler(new GridManager(currentPart, gridMap.parts))
    }
  }, [currentPart, gridMap])

  return (
    <>
      {gridMap.rows.map(([row, gridRow]) =>
        gridRow.columns.map(([column]) => (
          <button
            key={`${row}_${column}`}
            style={{
              gridRowStart: row,
              gridColumnStart: column,
            }}
            className={classnames(s.button, {
              [s.fullHeight]: gridRow.isFullHeight,
            })}
            onMouseEnter={() => handler.hovering(row, column)}
            onMouseDown={() => {
              if (handler.isMarking) {
                onSelectDone(
                  handler.gridPosition.startRow,
                  handler.gridPosition.startColumn,
                )
                handler.stop()
              } else {
                handler.start(row, column)
              }
            }}
          />
        )),
      )}
    </>
  )
})
