import React, { useEffect, useState } from 'react'
import { TagApi } from '../Tag.api'
import { useAuth } from '../../services/auth/Auth'
import { Tag } from './Tag'
import { classnames } from '../../services/importHelpers'
import s from './TagsEdit.module.scss'
import { Button } from '../../form/button/Button'
import StringUtils from '../../services/utils/StringUtils'
import { TagModel } from '../Tag.model'
import { COLOR } from '../../styles/_color'

interface Props {
  selected: string[]
  onRemove: (tag: string) => any
  onAdd: (tag: string) => any
  id?: string
  containerClassName?: string
}

export function TagsEdit(props: Props) {
  const { id, selected, onRemove, onAdd, containerClassName } = props
  const auth = useAuth()

  const [showInput, setShowInput] = useState<boolean>(false)
  const [newTag, setNewTag] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)
  const [tags, setTags] = useState<string[]>([])
  const [all, setAll] = useState<string[]>([])

  useEffect(() => {
    TagApi.all().then((all) => setAll(all.map((t) => t.name)))
  }, [])

  useEffect(() => {
    const distinct = new Set<string>([...selected, ...all])
    setTags(Array.from(distinct).sort((t1, t2) => t1.localeCompare(t2)))
  }, [all, selected])

  return (
    <section
      id={id}
      className={classnames(s.tagsContainer, containerClassName)}
    >
      {tags.map((tag) => {
        const isSelected = selected.includes(tag)
        return (
          <Tag
            key={tag}
            tag={tag}
            color={isSelected ? COLOR.GREY_DARK : COLOR.GREY}
            onClick={() => (isSelected ? onRemove(tag) : onAdd(tag))}
          />
        )
      })}
      {!showInput && (
        <Button onClick={() => setShowInput(true)} className={s.addButton}>
          +
        </Button>
      )}
      {showInput && (
        <>
          <input
            type="text"
            value={newTag}
            onChange={(e) =>
              setNewTag(StringUtils.toDisplayText(e.target.value))
            }
            onKeyPress={async (e) => {
              if (e.key === 'Enter' || e.keyCode === 13) {
                add()
              }
            }}
            placeholder="New tag"
          />
          <Button
            onClick={() => add()}
            onKeyPress={() => add()}
            loading={saving}
            loadingText="Adding..."
            className="add-button"
          >
            Add
          </Button>
        </>
      )}
    </section>
  )

  async function add() {
    setSaving(true)

    if (!tags.includes(newTag)) {
      const tagToAdd = new TagModel()
      tagToAdd.name = newTag
      await TagApi.save(tagToAdd, auth.userId)
      onAdd(newTag)
    }
    setShowInput(false)
    setNewTag('')
    setSaving(false)
  }
}
