export interface FormControlFieldConfig<T, U = any> {
  field: keyof T | string
  required?: boolean
  validate?: (v: U) => string | true
}
