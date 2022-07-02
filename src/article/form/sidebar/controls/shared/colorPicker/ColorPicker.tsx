import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { SketchPicker } from 'react-color'
import { config, useSpring } from 'react-spring'
import { classnames, isNil } from '../../../../../../services/importHelpers'
import { Button } from '../../../../../../shared/button/Button'
import { Modal } from '../../../../../../shared/modal/Modal'
import { COLOR, ColorType } from '../../../../../../styles/_color'
import s from './ColorPicker.module.scss'

interface Props {
  value: ColorType | string
  onSelect: (value: ColorType | string) => any
  id?: string
  colors?: ColorType[]
  additionalColors?: string[]
  showTransparent?: boolean
  background?: boolean
  small?: boolean
}

export const ColorPicker = observer((props: Props) => {
  const {
    value,
    onSelect,
    id,
    colors,
    additionalColors,
    showTransparent,
    background = false,
    small = false,
  } = props

  const [isModalVisible, showModal] = useState<boolean>(false)
  const [palette, setPalette] = useState<string[]>([])

  const { opacity } = useSpring({
    opacity: isModalVisible ? 1 : 0,
    config: config.stiff,
  })

  useEffect(() => {
    const p = new Set<string>()
    if (showTransparent) {
      p.add('transparent')
    }
    if (!!colors) {
      colors.forEach((c) => p.add(c.toLowerCase()))
    } else {
      Object.values(COLOR).forEach((c) => p.add(c.toLowerCase()))
    }

    if (!!additionalColors) {
      additionalColors.forEach((c) => p.add(c.toLowerCase()))
    }
    setPalette(Array.from(p))
  }, [colors, additionalColors, showTransparent])
  const [y, setY] = useState<number>()

  return (
    <>
      <div
        className={classnames(s.container, { [s.small]: small })}
        id={id}
        ref={(el) => !!el && setY(el.getBoundingClientRect().y)}
      >
        <Button
          className={classnames(s.button, {
            [s.transparent]: value === 'transparent',
          })}
          color={value || COLOR.GREY_LIGHTER}
          onClick={() => showModal(!isModalVisible)}
          style={{
            backgroundColor: background ? value : undefined,
          }}
        >
          {!small && (isNil(value) ? 'transparent' : value)}
        </Button>
      </div>
      {isModalVisible && (
        <Modal y={y} style={{ padding: '0.2rem' }}>
          <Button className={s.closeButton} onClick={() => showModal(false)}>
            Close
          </Button>
          <SketchPicker
            presetColors={palette}
            color={value}
            onChangeComplete={(color) => onSelect(color.hex)}
            className={s.colorPicker}
          />
        </Modal>
      )}
    </>
  )
})
