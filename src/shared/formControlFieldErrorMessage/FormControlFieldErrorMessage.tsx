import React, { useState } from 'react'
import { FormControl } from '../../services/formControl/FormControl'
import { Field } from '../../services/formControl/Field'
import { useReaction } from '../../hooks/useReaction'
import s from './FormControlFieldErrorMessage.module.scss'

interface Props<T> {
  formControl: FormControl<T>
  field: Field<T>
}

export function FormControlFieldErrorMessage<T>({
  formControl,
  field,
}: Props<T>) {
  const [message, setMessage] = useState<string>()

  useReaction(
    () => formControl.errorFields.includes(field),
    (hasError) => {
      setMessage(
        hasError ? formControl.getValidationResult(field).errorMessage : null,
      )
    },
  )

  return <span className={s.message}>{message}</span>
}
