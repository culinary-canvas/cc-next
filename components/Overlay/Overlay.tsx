import React from 'react'
import { observer } from 'mobx-react'
import './Overlay.module.scss'
import {COLOR, ColorType} from '../../styles/color'
import {isNil} from '../../services/importHelpers'

interface Props {
  text?: string
  progress?: number
  color?: ColorType
  opacity?: number
}

export const Overlay = observer((props: Props) => {
  const { text, progress, color = COLOR.BLACK, opacity = 0.5 } = props
  return (
    <>
      <div className="overlay" style={{ backgroundColor: color, opacity }} />
      {!isNil(progress) && (
        <div
          className="overlay-progress-fill"
          style={{
            width: `${Math.floor(progress * 100)}%`,
            backgroundColor: color,
            opacity: opacity + 0.1,
          }}
        />
      )}
      <div className="overlay-content-container">
        {text && <h3 className="overlay-text">{text}</h3>}
        {progress && (
          <h1 className="overlay-progress">{Math.floor(progress * 100)}%</h1>
        )}
      </div>
    </>
  )
})
