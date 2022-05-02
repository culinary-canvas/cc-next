import sv from 'date-fns/locale/sv'
import React from 'react'
import ReactDatePicker, {
  ReactDatePickerProps,
  registerLocale,
  setDefaultLocale,
} from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import s from './DatePicker.module.scss'

registerLocale('sv', sv)
setDefaultLocale('sv')

interface Props extends ReactDatePickerProps {
  containerClassName?: string
}

export function DatePicker({
  showWeekNumbers = true,
  showTimeSelect = true,
  dateFormat = 'HH:mm EEEE d MMMM yyyy',
  containerClassName,
  ...props
}: Props) {
  return (
    <ReactDatePicker
      showTimeSelect={showTimeSelect}
      showWeekNumbers={showWeekNumbers}
      dateFormat={dateFormat}
      locale="sv"
      popperPlacement="bottom-end"
      wrapperClassName={containerClassName}
      popperClassName={s.popper}
      calendarClassName={s.calendar}
      {...props}
    />
  )
}
