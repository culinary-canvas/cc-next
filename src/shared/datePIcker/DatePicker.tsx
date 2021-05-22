import ReactDatePicker, {
  getDefaultLocale,
  registerLocale,
  setDefaultLocale,
} from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import sv from 'date-fns/locale/sv'

registerLocale('sv', sv)
setDefaultLocale('sv')

interface Props {
  selected: Date
  onChange: (d: Date) => any
  containerClassName?: string
  className?: string
  disabled?: boolean
}

export function DatePicker(props: Props) {
  const {
    selected,
    onChange,
    className,
    containerClassName,
    disabled = false,
  } = props
  return (
    <ReactDatePicker
      showTimeSelect
      dateFormat="HH:mm EEEE d MMMM yyyy"
      wrapperClassName={containerClassName}
      className={className}
      locale="sv"
      selected={selected}
      onChange={(d) => onChange(d as Date)}
      popperPlacement="bottom-end"
      disabled={disabled}
    />
  )
}
