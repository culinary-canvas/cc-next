import React from 'react'
import './AddSection.module.scss'
import { Section } from '../../domain/Section/Section'
import { ContentService } from '../../domain/Content/Content.service'
import s from './AddSection.module.scss'

interface Props {
  onSelect: (section: Section) => any
}

export function AddSection(props: Props) {
  const { onSelect } = props

  return (
    <button
      className={s.addSectionButton}
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
