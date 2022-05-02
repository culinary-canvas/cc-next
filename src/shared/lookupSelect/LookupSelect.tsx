import { observer } from 'mobx-react-lite'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import viewIcon from '../../../public/assets/icons/streamline-icon-view-1@140x140.svg'
import { isNil } from '../../services/importHelpers'
import { DomUtils } from '../../services/utils/DomUtils'
import { Button } from '../button/Button'
import s from './LookupSelect.module.scss'

interface Props<T extends { [key: string]: any }> {
  id?: string
  selected?: T
  onSelect: (selected: T) => any
  onInput: (input: string) => T[] | Promise<T[]>
  onCreate?: (input: string) => Promise<void> | void
  url?: string
  keyField?: keyof T
  displayField: keyof T
  showEmptyOption?: boolean
  disabled?: boolean
  placeholder?: string
}

export const LookupSelect = observer(
  <T extends { [key: string]: any }>(props: Props<T>) => {
    const {
      id = uuid(),
      selected,
      onSelect,
      onInput,
      keyField = 'id',
      displayField,
      showEmptyOption,
      disabled = false,
      onCreate,
      url,
      placeholder = 'Type to search',
    } = props

    const optionsId = useRef(uuid()).current

    const [input, setInput] = useState<string>('')
    const [options, setOptions] = useState<T[]>([])
    const [focused, setFocused] = useState<boolean>(false)
    const [creating, setCreating] = useState<boolean>(false)
    const [focusedOption, setFocusedOption] = useState<number | 'create'>()
    const [showCreate, setShowCreate] = useState<boolean>(false)

    const loadOptions = useCallback(
      async (v: string) => {
        const newOptions = await onInput(v)
        setOptions(
          newOptions
            .slice()
            .sort((o1, o2) =>
              String(o1[displayField]).localeCompare(o2[displayField]),
            ),
        )
      },
      [onInput],
    )

    useEffect(() => {
      setShowCreate(
        onCreate &&
          input !== '' &&
          (!selected || selected[displayField] !== input) &&
          !options.some((o) => o.name === input),
      )
    }, [input, selected, displayField, options, onCreate])

    useEffect(() => {
      setInput(!!selected ? selected[displayField] : '')
    }, [selected])

    useEffect(() => {
      function clickListener(e: MouseEvent) {
        if (
          !DomUtils.hasIdOrParentWithId(e.target as HTMLElement, [
            id,
            optionsId,
          ])
        ) {
          setFocused(false)
          !selected && setInput('')
        }
      }

      window.addEventListener('mousedown', clickListener)
      return () => window.removeEventListener('mousedown', clickListener)
    }, [selected, id, optionsId])

    useEffect(() => {
      if (!isNil(focusedOption)) {
        const o = Array.from(document.getElementById(optionsId)?.children).find(
          (_, i) => i === focusedOption,
        ) as HTMLButtonElement
        if (o) {
          o.focus({ preventScroll: true })
        }
      }
    }, [focusedOption])

    return (
      <div className={s.container} id={id}>
        <input
          disabled={disabled}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            loadOptions(e.target.value)
          }}
          placeholder={placeholder}
          onFocus={() => {
            loadOptions('')
            setFocused(true)
          }}
        />
        {!!url && !!selected && input === selected[displayField] && (
          <a
            className={s.linkButton}
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            <img src={viewIcon} alt="Go to" />
          </a>
        )}
        {focused && (
          <div className={s.select} id={optionsId}>
            {!options.length && (
              <button onClick={() => null} disabled>
                No matches
              </button>
            )}

            {showEmptyOption &&
              (!selected || input === selected[displayField]) && (
                <button
                  onClick={() => {
                    onSelect(null)
                    setInput('')
                    setFocused(false)
                  }}
                >
                  (None)
                </button>
              )}

            {options.map((o) => (
              <button
                key={o[keyField]}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setInput('')
                    onSelect(o)
                    setFocused(false)
                  }
                }}
                onClick={() => {
                  onSelect(o)
                  setInput('')
                  setFocused(false)
                }}
              >
                {o[displayField]}
              </button>
            ))}

            {showCreate && !options.some((o) => o.name === input) && (
              <Button
                className={s.createButton}
                onClick={async () => {
                  setCreating(true)
                  onCreate(input)
                  setInput('')
                  setCreating(false)
                  setTimeout(() => setFocused(false), 1000)
                }}
                loading={creating}
                loadingText={`Adding ${input}...`}
              >
                Add<span>{input}</span>
              </Button>
            )}
          </div>
        )}
      </div>
    )
  },
)
