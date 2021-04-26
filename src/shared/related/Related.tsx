import React, { useRef, useState } from 'react'
import s from './Related.module.scss'
import { Spinner } from '../spinner/Spinner'
import { useOnScrollIntoView } from '../../hooks/useOnScrollIntoView'
import { COLOR } from '../../styles/_color'
import { ICON } from '../../styles/_icon'

interface Props {
  onInView: () => Promise<any>
  children: any
}

export function Related(props: Props) {
  const { onInView, children } = props

  const [ref, setRef] = useState<HTMLElement>()
  const [show, setShow] = useState<boolean>(false)

  useOnScrollIntoView(
    ref,
    async () => {
      await onInView()
      setShow(true)
    },
    [onInView],
    {
      relativeOffset: 0.7,
    },
  )

  return (
    <section ref={(r) => setRef(r)} className={s.container}>
      {show ? (
        children
      ) : (
        <div className={s.spinnerContainer}>
          <Spinner
            className={s.spinner}
            color={COLOR.GREY}
            size={ICON.SIZE.L}
          />
        </div>
      )}
    </section>
  )
}
