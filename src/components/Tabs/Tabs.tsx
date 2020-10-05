import React from 'react'
import './Tabs.module.scss'
import { useObserver } from 'mobx-react'
import { isString } from 'lodash'
import {classnames} from '../../services/importHelpers'
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
    selected,
    onSelect,
    containerClassName,
    children,
    showAdd = false,
    onAdd,
  } = props

  return useObserver(() => (
    <>
      <div className={classnames('tabs-container', containerClassName)}>
        {tabs.map((tab, i) => {
          const id = getId(tab)
          const label = getLabel(tab)
          return (
            <button
              className={classnames('button', 'tab', {
                selected: (!selected && i === 0) || id === selected,
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
            className={classnames('button', 'tab', 'add')}
            onClick={() => !!onAdd && onAdd()}
          >
            +
          </button>
        )}
      </div>
      {children}
    </>
  ))

  function getId(tab: T) {
    return isString(tab) ? (tab as string) : (tab as TabProperty).id
  }
  function getLabel(tab: T) {
    return StringUtils.toDisplayText(
      isString(tab) ? (tab as string) : (tab as TabProperty).label,
    )
  }
}
