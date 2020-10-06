import React, { useState } from 'react'
import styles from './Tags.module.scss'
import { observer } from 'mobx-react'
import { Button } from '../Button/Button'
import { useAutorun } from '../../hooks/useAutorun'
import { Tag } from '../../domain/Tag/Tag'
import { COLOR } from '../../styles/color'
import { useEnv } from '../../services/AppEnvironment'
import { useRouter } from 'next/router'
import { classnames } from '../../services/importHelpers'
import StringUtils from '../../services/utils/StringUtils'
import { TagApi } from '../../domain/Tag/Tag.api'
import { useAuth } from '../../services/auth/Auth'

interface Props {
  selected: string[]
  onRemove?: (tag: Tag) => any
  onAdd?: (tag: Tag) => any
  id?: string
  edit?: boolean
  selectedBackgroundColor?: string
}

export const Tags = observer((props: Props) => {
  const {
    id,
    selected,
    onRemove,
    onAdd,
    edit = true,
    selectedBackgroundColor = COLOR.GREY_LIGHT,
  } = props
  const env = useEnv()
  const auth = useAuth()

  const [showInput, setShowInput] = useState<boolean>(false)
  const [newTag, setNewTag] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)
  const [tags, setTags] = useState<Tag[]>([])
  const router = useRouter()

  useAutorun(() => {
    if (edit) {
      setTags(env.tagStore.tags)
    } else {
      setTags(env.tagStore.get(selected))
    }
  }, [edit, env.tagStore, selected])

  return (
    <div id={id} className={styles.tagsContainer}>
      <div className={styles.tags}>
        {tags.map((tag) => {
          const isSelected = selected.includes(tag.id)
          return (
            <Button
              key={tag.id}
              onClick={(e) => {
                e.preventDefault()
                if (edit) {
                  isSelected ? onRemove(tag) : onAdd(tag)
                } else {
                  env.articleStore.setTagIdFilter(tag.id)
                  // TODO nav
                  // router.navigate({ url: '/', method: 'anchor' })
                }
              }}
              className={classnames({ [styles.selected]: isSelected })}
              color={isSelected ? COLOR.BLACK : COLOR.GREY_DARK}
              style={{
                color: isSelected ? COLOR.BLACK : COLOR.GREY_DARK,
                backgroundColor: isSelected && selectedBackgroundColor,
              }}
            >
              {tag.name}
            </Button>
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
            className="add-tag"
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
    </div>
  )

  async function add(user) {
    setSaving(true)
    if (!env.tagStore.exists(newTag)) {
      const tagToAdd = new Tag()
      tagToAdd.name = newTag
      const persisted = await TagApi.save(tagToAdd, user)
      env.tagStore.add([persisted])
      onAdd(persisted)
    }
    setShowInput(false)
    setNewTag('')
    setSaving(false)
  }
})
