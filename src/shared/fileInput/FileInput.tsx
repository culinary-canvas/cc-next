import React, { useEffect, useRef } from 'react'
import s from './FileInput.module.scss'
import classnames from 'classnames'

interface Props {
  onChange: (file: File) => void
  onClick?: (e: MouseEvent) => void
  children?: any
  id?: string
  className?: string
  display?: boolean
  open?: boolean
}

export const FileInput = (props: Props) => {
  const {
    onChange,
    onClick,
    children,
    id,
    className,
    display = false,
    open = false,
  } = props

  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (open) {
      inputRef.current.click()
    }
  }, [open])

  return (
    <label className={classnames([s.fileInput, className])} htmlFor={id}>
      <input
        type="file"
        id={id}
        ref={inputRef}
        onChange={(e: any) => onChange(e.target.files[0])}
        onClick={(e) => !!onClick && onClick((e as unknown) as MouseEvent)}
        accept="image/*"
      />
      <span aria-label="File name">{children}</span>
      {display && (
        <span className="button" role="button" tabIndex={0}>
          Select image
        </span>
      )}
    </label>
  )
}
