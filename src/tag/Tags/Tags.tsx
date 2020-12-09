import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Button } from '../../form/button/Button'
import { TagModel } from '../Tag.model'
import StringUtils from '../../services/utils/StringUtils'
import { TagApi } from '../Tag.api'
import { useAuth } from '../../services/auth/Auth'
import { Tag } from './Tag'
import { classnames } from '../../services/importHelpers'
import styles from './Tags.module.scss'

interface Props {
  selected: string[]
  onRemove?: (tag: string) => any
  onAdd?: (tag: string) => any
  id?: string
  edit?: boolean
  containerClassName?: string
  backgroundColor?: string
}

export function Tags (props: Props) {
  const {
    id,
    selected,
    onRemove,
    onAdd,
    edit = false,
    containerClassName,
    backgroundColor,
  } = props
  const auth = useAuth()

  const [showInput, setShowInput] = useState<boolean>(false)
  const [newTag, setNewTag] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)
  const [tags, setTags] = useState<string[]>([])
  const [all, setAll] = useState<string[]>([])

  useEffect(() => {
    if (edit) {
      TagApi.all().then((all) => setAll(all.map((t) => t.name)))
    }
  }, [edit])

  useEffect(() => {
    const distinct = new Set<string>([...selected, ...all])
    setTags(Array.from(distinct).sort((t1, t2) => t1.localeCompare(t2)))
  }, [all, selected])

  return (
    <section
      id={id}
      className={classnames(styles.tagsContainer, containerClassName)}
    >
      <div className={styles.tags}>
        {tags.map((tag) => {
          const isSelected = selected.includes(tag)
          return (
            <Tag
              key={tag}
              tag={tag}
              selected={isSelected}
              backgroundColor={backgroundColor}
              onClick={
                edit
                  ? () => {
                      isSelected ? onRemove(tag) : onAdd(tag)
                    }
                  : undefined
              }
            />
          )
        })}
        {edit && !showInput && (
          <Button
            onClick={() => setShowInput(true)}
            className={styles.addButton}
          >
            +
          </Button>
        )}
      </div>
      {edit && showInput && (
        <>
          <input
            type="text"
            value={newTag}
            onChange={(e) =>
              setNewTag(StringUtils.toDisplayText(e.target.value))
            }
            onKeyPress={async (e) => {
              if (e.key === 'Enter' || e.keyCode === 13) {
                add(auth.user)
              }
            }}
            placeholder="New tag"
          />
          <Button
            onClick={() => add(auth.user)}
            onKeyPress={() => add(auth.user)}
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

  async function add(user) {
    setSaving(true)

    if (!tags.includes(newTag)) {
      const tagToAdd = new TagModel()
      tagToAdd.name = newTag
      await TagApi.save(tagToAdd, auth.user)
      onAdd(newTag)
    }
    setShowInput(false)
    setNewTag('')
    setSaving(false)
  }
}
