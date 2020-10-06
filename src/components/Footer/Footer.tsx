import React from 'react'
import { observer } from 'mobx-react'
import s from './Footer.module.scss'
import YearMonth from '../../domain/DateTime/YearMonth'
import Link from 'next/Link'
import facebook from '../../../public/assets/icons/streamline-icon-social-media-facebook-1@140x140.svg'
import instagram from '../../../public/assets/icons/streamline-icon-social-instagram@140x140.svg'
import pinterest from '../../../public/assets/icons/streamline-icon-social-pinterest@140x140.svg'

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

        <section className={s.socialMediaContainer}>
          <a
            href="https://www.facebook.com/CulinaryCanvasBlog/"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Facebook"
          >
            <img src={facebook} alt="Facebook" className="icon" />
          </a>

          <a
            href="https://www.instagram.com/CulinaryCanvas_/"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Instagram"
          >
            <img src={instagram} alt="Facebook" className="icon" />
          </a>
          <a
            href="https://www.pinterest.com/Culinary_Canvas/"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Pinterest"
          >
            <img src={pinterest} alt="Facebook" className="icon" />
          </a>
        </section>
        <section>{YearMonth.create().year} © Culinary Canvas</section>
      </div>
    </footer>
  )
})
