import React, { useRef, useState } from 'react'
import { useFormControl } from '../../services/formControl/useFormControl'
import { LeadFormObject } from './LeadFormObject'
import { runInAction } from 'mobx'
import { Button } from '../button/Button'
import { observer } from 'mobx-react'
import { Checkbox } from '../checkbox/Checkbox'
import { EmailService } from '../../services/email/Email.service'
import { FormControlFieldErrorMessage } from '../formControlFieldErrorMessage/FormControlFieldErrorMessage'
import s from './LeadForm.module.scss'
import successIcon from '../../../public/assets/icons/streamline-icon-party-confetti-whistle@140x140.svg'

export const LeadForm = observer(() => {
  const _formObject = useRef(new LeadFormObject()).current
  const [formControl, form] = useFormControl(_formObject, [
    { field: 'firstName', required: true },
    { field: 'lastName', required: true },
    {
      field: 'email',
      required: true,
      validate: (email) =>
        EmailService.validate(email)
          ? null
          : 'Please input a correct email address',
    },
  ])
  const [submitError, setSubmitError] = useState<boolean>(false)
  const [submitSuccessful, setSubmitSuccessful] = useState<boolean>(false)
  return (
    <form name="leadForm" className={s.form}>
      {submitSuccessful && (
        <div className={s.submitSuccessful}>
          <img src={successIcon} />
          <h2>All set, {form.firstName}!</h2>
          <p>
            We will drop you an email at {form.email} with more information.
          </p>
          <p>
            Don't hesitate to contact us at{' '}
            <a href="mailto:education@culinary-canvas.com">
              education@culinary-canvas.com
            </a>{' '}
            if you have any further questions.
          </p>
          <Button
            onClick={() => {
              setSubmitSuccessful(false)
              form.firstName = ''
              form.lastName = ''
              form.email = ''
              form.newsletter = false
              formControl.reset()
            }}
          >
            Ok
          </Button>
        </div>
      )}
      <h2>Want to know more?</h2>
      <p>
        Fill out this form if you want us to contact you with more information
      </p>

      <label htmlFor="firstName">
        First name*
        <FormControlFieldErrorMessage
          formControl={formControl}
          field={'firstName'}
        />
      </label>
      <input
        type="text"
        value={form.firstName}
        name="firstName"
        placeholder="E.g. Lois"
        required
        onChange={(e) => {
          runInAction(() => (form.firstName = e.target.value))
          setSubmitError(false)
        }}
        onBlur={() => formControl.setFieldBlurred('firstName')}
        disabled={formControl.disabled}
      />

      <label htmlFor="lastName">
        Last name*
        <FormControlFieldErrorMessage
          formControl={formControl}
          field={'lastName'}
        />
      </label>
      <input
        type="text"
        value={form.lastName}
        name="lastName"
        placeholder="E.g. Lane"
        required
        onChange={(e) => {
          runInAction(() => (form.lastName = e.target.value))
          setSubmitError(false)
        }}
        onBlur={() => formControl.setFieldBlurred('lastName')}
        className={
          formControl.errorFields.includes('lastName') ? s.error : null
        }
        disabled={formControl.disabled}
      />

      <label htmlFor="email">
        Email*
        <FormControlFieldErrorMessage
          formControl={formControl}
          field={'email'}
        />
      </label>
      <input
        type="email"
        value={form.email}
        name="email"
        placeholder="E.g. lois.lane@dailyplanet.com"
        required
        onChange={(e) => {
          runInAction(() => (form.email = e.target.value))
          setSubmitError(false)
        }}
        onBlur={() => formControl.setFieldBlurred('email')}
        className={formControl.errorFields.includes('email') ? s.error : null}
        disabled={formControl.disabled}
      />

      <Checkbox
        id="newsletter"
        checked={form.newsletter}
        onChange={(v) => {
          runInAction(() => (form.newsletter = v))
          setSubmitError(false)
        }}
        label="Of course I also want to subscribe to the Culinary Canvas newsletter!"
        disabled={formControl.disabled}
      />

      <Button
        disabled={formControl.isInvalid}
        type="submit"
        onClick={async (e) => {
          try {
            e.preventDefault()
            formControl.setDisabled()
            await EmailService.addEducationLeadContact(
              form.email,
              form.firstName,
              form.lastName,
              form.newsletter,
            )
            setSubmitError(false)
            setSubmitSuccessful(true)
          } catch (e) {
            setSubmitError(true)
          } finally {
            formControl.setDisabled(false)
          }
        }}
        loading={formControl.disabled}
        loadingText="Submitting..."
        className={submitError ? s.error : null}
      >
        Submit
      </Button>

      {submitError && (
        <p className={s.submitError}>
          Oops! Something went wrong. Please try again. If you still get this
          error message, please send us an email at{' '}
          <a href="mailto:education@culinary-canvas.com">
            education@culinary-canvas.com
          </a>{' '}
          instead
        </p>
      )}
    </form>
  )
})
