import React from 'react'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import './ColorPicker.module.scss'
import { COLOR, ColorType } from '../../styles/color'

interface Props {
  value: ColorType
  onSelect: (value: ColorType) => any
  id?: string
  colors?: ColorType[]
}

export const ColorPicker = observer((props: Props) => {
  const { value, onSelect, id, colors = Object.values(COLOR) } = props

  return (
    <div className="color-picker" id={id}>
      <ul>
        {colors.map((c) => (
          <li
            key={c}
            className={classnames({
              picked: value?.toLowerCase() === c.toLowerCase(),
            })}
            style={{ backgroundColor: c }}
          >
            <button onClick={() => onSelect(c)} />
          </li>
        ))}
      </ul>
    </div>
  )
})
