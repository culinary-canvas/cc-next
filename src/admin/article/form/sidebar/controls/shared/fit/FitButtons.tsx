import React from 'react'
import './FitButtons.module.scss'
import { Button } from '../../../../../../../form/button/Button'
import { Fit } from '../../../../../../../article/shared/Fit'
import s from './FitButtons.module.scss'
import { classnames } from '../../../../../../../services/importHelpers'

interface Props {
  selected: Fit
  onSelected: (v: Fit) => any
  id: string
}

export function FitButtons(props: Props) {
  const { selected, onSelected, id } = props

  return (
    <div id={id} className={s.container}>
      {[Fit.ARTICLE, Fit.SCREEN_WIDTH, Fit.FULL_SCREEN].map((fit) => (
        <Button
          key={fit}
          toggleable
          onClick={() => onSelected(fit)}
          selected={selected === fit}
          className={classnames(s[`fit-${fit}`], s.button)}
        >
          <span className={s.containerSpan} />
          <span className={classnames(s[`fit-${fit}`], s.contentSpan)} />
        </Button>
      ))}
    </div>
  )
}
