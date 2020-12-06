import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import s from './ColorPicker.module.scss'
import { COLOR, ColorType } from '../../../../../../../styles/color'
import { isNil } from '../../../../../../../services/importHelpers'
import { AlphaPicker, BlockPicker } from 'react-color'
import { Button } from '../../../../../../../form/button/Button'
import { animated, config, useSpring } from 'react-spring'

interface Props {
  value: ColorType | string
  onSelect: (value: ColorType | string) => any
  id?: string
  colors?: ColorType[]
  additionalColors?: string[]
  showTransparent?: boolean
  background?: boolean
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

  return (
    <div className={s.container} id={id}>
      <Button
        className={s.button}
        color={value || COLOR.GREY_LIGHTER}
        onClick={() => showModal(!isModalVisible)}
        circle
        style={{
          backgroundColor: background ? value : undefined,
        }}
      >
        {isNil(value) ? 'transparent' : value}
      </Button>
      {isModalVisible && (
        <animated.div className={s.colorPicker} style={{ opacity }}>
          <Button className={s.closeButton} onClick={() => showModal(false)}>
            X
          </Button>
          <BlockPicker
            width="100%"
            colors={palette}
            color={value}
            onChangeComplete={(color) => onSelect(color.hex)}
          />
          <AlphaPicker
            className={s.alphaContainer}
            color={value}
            onChangeComplete={(color) => console.log(color)}
          />
        </animated.div>
      )}
    </div>
  )
})
