import React from 'react'
import { Tag } from './Tag'
import { classnames } from '../../services/importHelpers'
import s from './TagsView.module.scss'
import { useRouter } from 'next/router'

interface Props {
  tagNames: string[]
  id?: string
  containerClassName?: string
}

export function TagsView(props: Props) {
  const { id, tagNames: tags, containerClassName } = props
  const router = useRouter()

  return (
    <section
      id={id}
      className={classnames(s.tagsContainer, containerClassName)}
    >
      {tags.map((tag) => (
        <Tag
          key={tag}
          tag={tag}
          onClick={() => router.push(`/articles/tags/${tag}`)}
        />
      ))}
    </section>
  )
}