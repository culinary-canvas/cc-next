import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import s from './GridControlMenu.module.scss'
import DownArrow from '../../../../../../../../public/assets/icons/streamline-icon-keyboard-arrow-down@140x140.svg'
import UpArrow from '../../../../../../../../public/assets/icons/streamline-icon-keyboard-arrow-up@140x140.svg'
import LayerUp from '../../../../../../../../public/assets/icons/streamline-icon-layers-select-front@140x140.svg'
import LayerDown from '../../../../../../../../public/assets/icons/streamline-icon-layers-select@140x140.svg'
import EditPosition from '../../../../../../../../public/assets/icons/streamline-icon-cursor-select-2@140x140.svg'
import { classnames } from '../../../../../../../services/importHelpers'
import { GridPositionService } from '../../../../../../../article/grid/GridPosition.service'
import { GridMap } from './GridMap'
import { ArticlePart } from '../../../../../../../article/ArticlePart'
import { SectionModel } from '../../../../../../../article/section/Section.model'
import { GridControlMenuButton } from './GridControlMenuButton'
import { Modal } from '../../../../../../../shared/modal/Modal'

interface Props<T extends ArticlePart> {
  gridMap: GridMap<T>
  row: number
  part: T
  columnDefinitions: string[]
  onRowUpClick: () => any
  onRowDownClick: () => any
  onDeleteRow: (parts: T[]) => any
  onEditPosition: () => any
}

export const GridControlMenu = observer(
  <T extends ArticlePart>(props: Props<T>) => {
    const {
      gridMap,
      row,
      part,
      onRowUpClick,
      onRowDownClick,
      onDeleteRow,
      onEditPosition,
    } = props

    const [modalVisible, showModal] = useState<boolean>(false)
    const [isRowDownDisabled, disableRowDown] = useState<boolean>(false)
    const [isRowUpDisabled, disableRowUp] = useState<boolean>(false)
    const [isDeleteRowDisabled, disableDeleteRow] = useState<boolean>(false)
    const [isLayerUpDisabled, disableLayerUp] = useState<boolean>(false)
    const [isLayerDownDisabled, disableLayerDown] = useState<boolean>(false)

    useEffect(() => {
      disableRowDown(gridMap.isFirst(row) || gridMap.isLast(row))
      disableRowUp(
        gridMap.isFirst(row) || (row === 2 && part instanceof SectionModel),
      )
      disableDeleteRow(gridMap.isFirst(row))
      disableLayerUp(
        !part ||
          part.format.layer >=
            GridPositionService.overlappingParts(
              gridMap.parts,
              part.format.gridPosition,
            ).length -
              1,
      )
      disableLayerDown(!part || part.format.layer === 0)
    }, [gridMap, part, row])

    return (
      <>
        <div className={classnames(s.menu)} style={{ gridRow: row }}>
          <section className={s.section}>
            <GridControlMenuButton
              label="Add row"
              onClick={() => {
                const afterRow = !!part ? part.format.gridPosition.endRow : row
                !gridMap.isRow(afterRow + 1)
                  ? gridMap.append()
                  : GridPositionService.addRow(afterRow, gridMap.parts)
              }}
            >
              +
            </GridControlMenuButton>

            <GridControlMenuButton
              label="Delete row"
              disabled={isDeleteRowDisabled}
              onClick={() => {
                if (!gridMap.isRow(row)) {
                  gridMap.removeAppended()
                } else if (!gridMap.get(row).isEmpty) {
                  showModal(true)
                } else {
                  GridPositionService.deleteRow(row, gridMap.parts)
                }
              }}
            >
              -
            </GridControlMenuButton>

            <GridControlMenuButton
              label="Move row up"
              disabled={isRowUpDisabled}
              onClick={() => {
                GridPositionService.moveUp(row, gridMap.parts)
                onRowUpClick()
              }}
            >
              <img src={UpArrow} />
            </GridControlMenuButton>

            <GridControlMenuButton
              label="Move row down"
              disabled={isRowDownDisabled}
              onClick={() => {
                GridPositionService.moveDown(row, gridMap.parts)
                onRowDownClick()
              }}
            >
              <img src={DownArrow} />
            </GridControlMenuButton>
          </section>

          {!!part && (
            <section className={s.section}>
              <GridControlMenuButton
                label="Edit placement"
                disabled={false}
                onClick={() => onEditPosition()}
              >
                <img src={EditPosition} />
              </GridControlMenuButton>

              <GridControlMenuButton
                label="Bring forward"
                disabled={isLayerUpDisabled}
                onClick={() => GridPositionService.layerUp(part, gridMap.parts)}
              >
                <img src={LayerUp} />
              </GridControlMenuButton>

              <GridControlMenuButton
                label="Bring backward"
                disabled={isLayerDownDisabled}
                onClick={() =>
                  GridPositionService.layerDown(part, gridMap.parts)
                }
              >
                <img src={LayerDown} />
              </GridControlMenuButton>
            </section>
          )}
        </div>

        {modalVisible && (
          <Modal
            title="Confirm remove row"
            message={`Section${
              gridMap.get(row).parts.length > 1 ? 's' : ''
            } "${gridMap
              .get(row)
              .parts.map((p) => p.displayName)
              .join('", "')}" will also be deleted. This cannot be undone.`}
            onOk={() => {
              showModal(false)
              onDeleteRow(gridMap.get(row).parts)
              GridPositionService.deleteRow(row, gridMap.parts)
            }}
            onCancel={() => showModal(false)}
          />
        )}
      </>
    )
  },
)
