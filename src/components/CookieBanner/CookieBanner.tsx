import React from 'react'
import CookieConsent from 'react-cookie-consent'
import './CookieBanner.module.scss'
import Link from 'next/Link'

export function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      enableDeclineButton
      containerClasses="cookie-banner container"
      buttonClasses="cookie-banner accept-button"
      declineButtonClasses="cookie-banner decline-button"
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
