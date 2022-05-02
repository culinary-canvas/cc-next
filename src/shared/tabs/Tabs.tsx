import React from 'react'
import s from './Tabs.module.scss'
import { isString } from 'lodash'
import { classnames } from '../../services/importHelpers'
import StringUtils from '../../services/utils/StringUtils'

interface TabProperty {
  id: string
  label: string
}

interface Props<T extends TabProperty | string = string> {
  tabs: T[]
  selected?: string
  onSelect?: (t: string) => any
  containerClassName?: string
  children: any
  showAdd?: boolean
  onAdd?: () => any
}

export function Tabs<T extends TabProperty | string = string>(props: Props<T>) {
  const {
    tabs = [],
    selected = tabs[0],
    onSelect,
    containerClassName,
    children,
    showAdd = false,
    onAdd,
  } = props

  return (
    <>
      <div className={classnames(s.container, containerClassName)}>
        {tabs.map((tab, i) => {
          const id = getId(tab)
          const label = getLabel(tab)
          return (
            <button
              className={classnames('button', s.tab, {
                [s.selected]: id === selected,
              })}
              onClick={() => !!onSelect && onSelect(id)}
              key={id}
            >
              {label}
            </button>
          )
        })}
        {showAdd && (
          <button
            className={classnames('button', s.tab, 'add')}
            onClick={() => !!onAdd && onAdd()}
          >
            +
          </button>
        )}
      </div>
      {children}
    </>
  )

  function getId(tab: T) {
    return isString(tab) ? (tab as string) : (tab as TabProperty).id
  }
  function getLabel(tab: T) {
    return StringUtils.toDisplayText(
      isString(tab) ? (tab as string) : (tab as TabProperty).label,
    )
  }
}
