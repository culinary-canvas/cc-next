import React from 'react'
import CookieConsent from 'react-cookie-consent'
import s from './CookieBanner.module.scss'
import Link from 'next/Link'

export function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      enableDeclineButton
      containerClasses={s.container}
      buttonClasses={s.accept}
      declineButtonClasses={s.decline}
      cookieSecurity={true}
    >
      <p>
        This web site uses cookies to enchance user experience.{' '}
        <Link href="/cookies">
          <a>Learn more</a>
        </Link>
      </p>
    </CookieConsent>
  )
}
