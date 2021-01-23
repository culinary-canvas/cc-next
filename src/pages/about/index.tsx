import React from 'react'
import s from './about.module.scss'
import { COLOR } from '../../styles/_color'
import { GetStaticProps } from 'next'
import { PageHead } from '../../head/PageHead'
import { SocialMediaLinks } from '../../shared/socialMediaLinks/SocialMediaLinks'

export default function About() {
  return (
    <>
      <PageHead
        title="About"
        image="https://firebasestorage.googleapis.com/v0/b/culinary-canvas.appspot.com/o/about%2F_DSC9450.jpg?alt=media&token=f95882a3-eb5a-4f83-8f4e-c4476e2e422f"
        imageAlt="@Yves Le Lay by Johan Ståhlberg"
      />

      <main className={s.container}>
        <h1>Culinary Canvas</h1>
        <article className={s.content}>
          <section>
            <p>
              At Culinary Canvas, we celebrate the craftsmanship of the world's
              most creative culinary and beverage professionals. Their ingenuity
              inspires us to look at food and drink through a uniquely creative
              lens.
            </p>

            <p>
              Here you’ll discover insightful profiles on culinary creators from
              the far corners of the globe, learn how their signature dishes
              came into being, and get exclusive step-by-step guides to help you
              bring their creations to life in your own kitchen.
            </p>

            <p>We’re serving creativity. Drink up!</p>

            <SocialMediaLinks
              containerClassName={s.socialMediaContainer}
              linkClassName={s.socialMediaLink}
            />

            <img
              className={s.image}
              alt="@Yves Le Lay by Johan Ståhlberg"
              src="https://firebasestorage.googleapis.com/v0/b/culinary-canvas.appspot.com/o/about%2F_DSC9450.jpg?alt=media&token=f95882a3-eb5a-4f83-8f4e-c4476e2e422f"
            />
          </section>
        </article>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} }
}
