import React from 'react'
import './FitButtons.module.scss'
import { Button } from '../../Button/Button'
import {Fit} from '../../../domain/Section/Fit'

interface Props {
  selected: Fit
  onSelected: (v: Fit) => any
  id: string
}

export function FitButtons(props: Props) {
  const { selected, onSelected, id } = props

  return (
    <div id={id} className="control-buttons container fit">
      {[Fit.ARTICLE, Fit.SCREEN_WIDTH, Fit.FULL_SCREEN].map((fit) => (
        <Button
          key={fit}
          toggleable
          onClick={() => onSelected(fit)}
          selected={selected === fit}
          className={`fit-${fit} control-button`}
        >
          <span className="container" />
          <span className="content" />
        </Button>
      ))}
    </div>
  )
}
