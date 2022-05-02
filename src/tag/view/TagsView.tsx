import React from 'react'
import { Tag } from '../tag/Tag'
import { classnames } from '../../services/importHelpers'
import s from './TagsView.module.scss'
import { useRouter } from 'next/router'

interface Props {
  tagNames: string[]
  id?: string
  containerClassName?: string
  onHover?: () => any
  onBlur?: () => any
}

export function TagsView(props: Props) {
  const { id, onHover, onBlur, tagNames: tags, containerClassName } = props
  const router = useRouter()

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <section
      id={id}
      className={classnames(s.tagsContainer, containerClassName)}
      onMouseOver={() => !!onHover && onHover()}
      onMouseOut={() => !!onBlur && onBlur()}
    >
      {tags.map((tag) => (
        <Tag key={tag} tag={tag} onClick={() => router.push(`/tags/${tag}`)} />
      ))}
    </section>
  )
}
