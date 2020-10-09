import React from 'react'
import { observer } from 'mobx-react'
import s from './Footer.module.scss'
import YearMonth from '../../domain/DateTime/YearMonth'
import Link from 'next/Link'
import { SocialMediaLinks } from '../SocialMediaLinks/SocialMediaLinks'
import { COLOR } from '../../styles/color'

export const Footer = observer(() => {
  return (
    <footer className={s.container}>
      <div className={s.content}>
        <section>
          <h3>Culinary Canvas</h3>
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

        <SocialMediaLinks color={COLOR.WHITE} />

        <section className={s.copyright}>
          {YearMonth.create().year} © Culinary Canvas
        </section>
      </div>
    </footer>
  )
})
