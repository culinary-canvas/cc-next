import React from 'react'
import { classnames } from '../../../../../../../services/importHelpers'
import s from './GridContent.module.scss'
import { ArticlePart } from '../../../../../../../article/shared/ArticlePart'
import { SectionModel } from '../../../../../../../article/section/Section.model'
import { Size } from '../../../../../../../article/shared/format/Size'
import { observer } from 'mobx-react'
import { motion } from 'framer-motion'

interface Props<T> {
  rowStart: number
  rowEnd?: number
  columnStart: number
  columnEnd?: number
  part?: T
  isInFocus?: boolean
  isOutlier?: boolean
  isHovered?: boolean
  onMouseDown?: () => void
  onMouseUp?: () => void
  onHover?: () => void
}

export const GridContent = observer(
  <T extends ArticlePart>(props: Props<T>) => {
    const {
      rowStart,
      rowEnd = rowStart + 1,
      columnStart,
      columnEnd = columnStart + 1,
      part,
      isInFocus = false,
      isOutlier = false,
      isHovered = false,
      onMouseDown,
      onMouseUp,
      onHover,
    } = props

    return (
      <>
        <motion.button
          /*
          drag
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          dragTransition={{
            power: 0,
            modifyTarget: (target) => Math.round(target / 50) * 50,
          }}
          dragDirectionLock
          */
          onDrag={(e, info) => console.log(info)}
          key={`${rowStart}_${rowEnd}_${columnStart}_${columnEnd}`}
          style={{
            gridRowStart: rowStart,
            gridRowEnd: rowEnd,
            gridColumnStart: columnStart,
            gridColumnEnd: columnEnd,
            zIndex: isHovered ? 30 : part?.format?.layer,
            bottom: !!part ? `${part.format.layer * 2}px` : 0,
            left: !!part ? `${part.format.layer * 2}px` : 0,
          }}
          className={classnames(s.button, {
            [s.hasPart]: !!part,
            [s.inFocus]: isInFocus,
            [s.outlier]: isOutlier,
            [s.hover]: isHovered,
            [s.fullScreenHeight]:
              !!part && part instanceof SectionModel
                ? part.format.height === Size.FULL_SCREEN
                : false,
          })}
          onMouseEnter={() => !!onHover && onHover()}
          onMouseDown={() => !!onMouseDown && onMouseDown()}
          onMouseUp={() => !!onMouseUp && onMouseUp()}
        >
          {!!part && <span className={s.name}>{part.displayName}</span>}
        </motion.button>
      </>
    )
  },
)
