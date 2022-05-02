import React from 'react'
import { observer } from 'mobx-react-lite'
import s from './Footer.module.scss'
import Link from 'next/link'
import { SocialMediaLinks } from '../socialMediaLinks/SocialMediaLinks'
import { COLOR } from '../../styles/_color'
import Logo from '../../../public/assets/logo.svg'

export const Footer = observer(() => {
  return (
    <footer className={s.container}>
      <div className={s.content}>
        <section>
          <img
            src={Logo}
            alt="Culinary Canvas"
            className={s.logo}
            title="Culinary Canvas"
          />

          <nav>
            <Link href="/about">
              <a>About</a>
            </Link>
            <Link href="/contact">
              <a>Contact</a>
            </Link>
            <Link href="/privacy">
              <a>Privacy</a>
            </Link>
            <Link href="/cookies">
              <a>Cookies</a>
            </Link>
          </nav>
        </section>

        <SocialMediaLinks
          color={COLOR.WHITE}
          containerClassName={s.socialMediaContainer}
          linkClassName={s.socialMediaLink}
        />

        <section className={s.copyright}>
          {new Date().getFullYear()} © Culinary Canvas
        </section>
      </div>
    </footer>
  )
})
