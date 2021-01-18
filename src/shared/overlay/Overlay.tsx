import React from 'react'
import { observer } from 'mobx-react'
import s from './Overlay.module.scss'
import { COLOR, ColorType } from '../../styles/_color'
import { isNil } from '../../services/importHelpers'

interface Props {
  text?: string
  progress?: number
  color?: ColorType
  opacity?: number
  children?: any
}

export const Overlay = observer((props: Props) => {
  const { text, progress, color = COLOR.BLACK, opacity = 0.5, children } = props
  return (
    <>
      <div className={s.overlay} style={{ backgroundColor: color, opacity }} />
      {!isNil(progress) && (
        <div
          className={s.progressFill}
          style={{
            width: `${Math.floor(progress * 100)}%`,
            backgroundColor: color,
            opacity: opacity + 0.1,
          }}
        />
      )}
      <div className={s.contentContainer}>
        {!!text && <h3 className={s.text}>{text}</h3>}
        {!!progress && (
          <h1 className={s.progress}>{Math.floor(progress * 100)}%</h1>
        )}
        {!!children && children}
      </div>
    </>
  )
})
