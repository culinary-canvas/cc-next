import { Field } from './Field'

export interface ValidationResult<T, U = any> {
  field: Field<T>
  value: U
  valid: boolean
  errorMessage?: string
}
