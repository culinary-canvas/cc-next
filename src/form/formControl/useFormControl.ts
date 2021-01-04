import { useEffect, useState } from 'react'
import { Model } from '../../services/db/Model'
import { FormControlFieldConfig } from './FormControlFieldConfig'
import { FormControl } from './FormControl'

export function useFormControl<T extends Model>(
  formObject: T,
  fieldConfigs?: FormControlFieldConfig[],
): [FormControl<T>, T] {
  const [formControl, setFormControl] = useState<FormControl<T>>(
    !!formObject && new FormControl(formObject, fieldConfigs),
  )
  const id = formObject?.id

  useEffect(() => {
    if (
      (!formControl || formControl.mutable.id !== formObject.id) &&
      !!formObject
    ) {
      setFormControl(new FormControl(formObject, fieldConfigs))
    }
  }, [fieldConfigs, formControl, formObject, id])

  return [formControl, formControl?.mutable]
}
