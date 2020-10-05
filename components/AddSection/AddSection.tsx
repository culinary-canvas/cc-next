import React from 'react'
import './AddSection.module.scss'
import {Section} from '../../domain/Section/Section'
import {ContentService} from '../../domain/Content/Content.service'

interface Props {
  onSelect: (section: Section) => any
}

export function AddSection(props: Props) {
  const { onSelect } = props

  return (
    <button
      className="add-section-button"
      onClick={() => {
        const content = ContentService.create()
        const section = new Section()
        section.contents.push(content)
        onSelect(section)
      }}
    >
      Add
    </button>
  )
}
