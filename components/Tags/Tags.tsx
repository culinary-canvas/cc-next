import React, {useState} from 'react'
import './Tags.module.scss'
import {observer} from 'mobx-react'
import {Button} from '../Button/Button'
import {Tag} from '../../domain/Tag/Tag'
import {useEnv} from '../../services/AppEnvironment'
import {classnames} from '../../services/importHelpers'
import {COLOR} from '../../styles/color'
import StringUtils from '../../services/utils/StringUtils'
import {TagApi} from '../../domain/Tag/Tag.api'

interface Props {
  selected: string[]
  onRemove: (tag: Tag) => any
  onAdd: (tag: Tag) => any
  id?: string
}

export const Tags = observer((props: Props) => {
  const { id, selected, onRemove, onAdd } = props
  const env = useEnv()

  const [showInput, setShowInput] = useState<boolean>(false)
  const [newTag, setNewTag] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)

  return (
    <div id={id} className="tags-container">
      <div className="tags">
        {env.tagStore.tags.map((tag) => {
          const isSelected = selected.includes(tag.id)
          return (
            <Button
              key={tag.id}
              onClick={() => (isSelected ? onRemove(tag) : onAdd(tag))}
              className={classnames({ selected: isSelected })}
              color={isSelected ? COLOR.BLACK : COLOR.GREY_DARK}
            >
              {tag.name}
            </Button>
          )
        })}
        {!showInput && (
          <Button onClick={() => setShowInput(true)} className="add-button">
            +
          </Button>
        )}
      </div>
      {showInput && (
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
    </div>
  )

  async function add() {
    setSaving(true)
    if (!env.tagStore.exists(newTag)) {
      const tagToAdd = new Tag()
      tagToAdd.name = newTag
      const persisted = await TagApi.save(tagToAdd)
      env.tagStore.add([persisted])
      onAdd(persisted)
    }
    setShowInput(false)
    setNewTag('')
    setSaving(false)
  }
})
