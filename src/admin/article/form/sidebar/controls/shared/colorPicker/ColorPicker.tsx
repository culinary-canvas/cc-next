import React from 'react'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import s from './ColorPicker.module.scss'
import { COLOR, ColorType } from '../../../../../../../styles/color'
import { isNil } from '../../../../../../../services/importHelpers'

interface Props {
  value: ColorType
  onSelect: (value: ColorType) => any
  id?: string
  colors?: ColorType[]
  includeTransparent?: boolean
}

export const ColorPicker = observer((props: Props) => {
  const {
    value,
    onSelect,
    id,
    colors = Object.values(COLOR),
    includeTransparent = false,
  } = props

  return (
    <div className={s.colorPicker} id={id}>
      <ul>
        {includeTransparent && (
          <li
            className={classnames(s.transparent, { [s.picked]: isNil(value) })}
          >
            <button onClick={() => onSelect(null)} />
          </li>
        )}
        {colors.map((c) => (
          <li
            key={c}
            className={classnames({
              [s.picked]: value?.toLowerCase() === c.toLowerCase(),
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
