import React from 'react'
import './Tooltip.module.scss'
import ReactTooltip from 'react-tooltip'

interface Props {
  id?: string
}

export function Tooltip(props: Props) {
  return (
    <ReactTooltip
      id={props.id}
      effect="solid"
      place="top"
      backgroundColor={'rgba(0,0,0,0.5)'}
      className="tooltip"
    />
  )
}
