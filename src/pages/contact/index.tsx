import React from 'react'
import { SocialMediaLinks } from '../../components/SocialMediaLinks/SocialMediaLinks'
import s from './contact.module.scss'
import { COLOR } from '../../styles/color'

export default function Contact() {
  return (
    <main className={s.container}>
      <article className={s.content}>
        <h1>Contact</h1>
        <section>
          <span className={s.emailContainer}>
            <h4>E-mail</h4>
            <a href="mailto:info@culinary-canvas" title="Send us an email">
              info@culinary-canvas.com
            </a>
          </span>
          <SocialMediaLinks color={COLOR.BLACK} />
        </section>
        <img
          alt="@Högtorps gård by Johan Ståhlberg"
          src="https://firebasestorage.googleapis.com/v0/b/culinary-canvas.appspot.com/o/contact%2F_DSC9508.jpg?alt=media&token=aebc373c-b3b2-40be-8f56-dbab72a71ee2"
        />
      </article>
    </main>
  )
}
