import React from 'react'
import './AddSection.module.scss'
import { SectionModel } from '../../../../article/section/Section.model'
import { ContentService } from '../../../../article/content/Content.service'
import s from './AddSection.module.scss'
import { SectionService } from '../../../../article/section/Section.service'

interface Props {
  onSelect: (section: SectionModel) => any
}

export function AddSection(props: Props) {
  const { onSelect } = props

  return (
    <button
      className={s.addSectionButton}
      onClick={() => {
        const content = ContentService.create()
        const section = SectionService.create()
        SectionService.addContent(content, section)
        onSelect(section)
      }}
    >
      Add
    </button>
  )
}
