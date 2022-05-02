import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import React from 'react'
import Logo from '../../../public/assets/logo.svg'
import { COLOR } from '../../styles/_color'
import { SocialMediaLinks } from '../socialMediaLinks/SocialMediaLinks'
import s from './Footer.module.scss'

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
          facebookUrl={'https://www.facebook.com/CulinaryCanvasBlog/'}
          facebookTitle={'Follow us on Facebook'}
          instagramUrl={'https://www.instagram.com/CulinaryCanvas_/'}
          instagramTitle={'Follow us on Instagram'}
          pinterestUrl={'https://www.pinterest.com/Culinary_Canvas/'}
          pinterestTitle={'Follow us on Pinterest'}
        />

        <section className={s.copyright}>
          {new Date().getFullYear()} © Culinary Canvas
        </section>
      </div>
    </footer>
  )
})
