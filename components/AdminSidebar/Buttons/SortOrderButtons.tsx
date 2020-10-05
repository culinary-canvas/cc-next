import React from 'react'
import { observer } from 'mobx-react'
import { Button } from '../../Button/Button'
import { runInAction } from 'mobx'
import './SortOrderButtons.module.scss'
import '../../../types/Sortable'
import {Sortable} from '../../../types/Sortable'

interface Props<T extends Sortable> {
  target: T
  list: T[]
  id?: string
  forbidden?: number[]
  onChange?: (changed: T[]) => any
  disabled?: boolean
}

export const SortOrderButtons = observer(
  <T extends Sortable>(props: Props<T>) => {
    const {
      target,
      list,
      id,
      forbidden = [],
      onChange,
      disabled = false,
    } = props

    return (
      <section
        className="control-buttons container sort-order button-group"
        id={id}
      >
        <Button
          disabled={
            disabled ||
            forbidden.includes(target.sortOrder) ||
            forbidden.includes(target.sortOrder - 1) ||
            target.sortOrder - 1 < 0
          }
          onClick={() => decrease()}
          onKeyPress={() => decrease()}
        >
          -
        </Button>

        <Button
          disabled={
            disabled ||
            forbidden.includes(target.sortOrder) ||
            forbidden.includes(target.sortOrder + 1) ||
            target.sortOrder + 2 > list.length
          }
          onClick={() => increase()}
          onKeyPress={() => increase()}
        >
          +
        </Button>
      </section>
    )

    function increase() {
      runInAction(() => {
        const other = list.find((s) => s.sortOrder === target.sortOrder + 1)
        target.sortOrder++
        other.sortOrder--
        onChange && onChange([target, other])
      })
    }
    function decrease() {
      runInAction(() => {
        const other = list.find((s) => s.sortOrder === target.sortOrder - 1)
        target.sortOrder--
        other.sortOrder++
        onChange && onChange([target, other])
      })
    }
  },
)
