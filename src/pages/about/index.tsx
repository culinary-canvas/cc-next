import React, { useEffect, useRef, useState } from 'react'
import s from './about.module.scss'
import { GetStaticProps } from 'next'
import { PageHead } from '../../shared/head/PageHead'
import { SocialMediaLinks } from '../../shared/socialMediaLinks/SocialMediaLinks'
import { AppService } from '../../services/App.service'
import Image from 'next/image'
import { ImageService } from '../../services/Image.service'

export default function About() {
  const url = useRef(
    'https://firebasestorage.googleapis.com/v0/b/culinary-canvas.appspot.com/o/about%2F_DSC9450.jpg?alt=media&token=f95882a3-eb5a-4f83-8f4e-c4476e2e422f',
  ).current

  const [imageSize, setImageSize] = useState<{
    width: number
    height: number
  }>()

  useEffect(
    () => ImageService.getWidthAndHeight(url).then((s) => setImageSize(s)),
    [],
  )

  return (
    <>
      <PageHead
        title="About"
        image={AppService.DEFAULT_SHARE_IMAGE}
        imageAlt={AppService.DEFAULT_SHARE_IMAGE_ALT}
      />

      <main className={s.container}>
        <article className={s.content}>
          <h1>Culinary Canvas</h1>
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
              facebookUrl={'https://www.facebook.com/CulinaryCanvasBlog/'}
              facebookTitle={'Follow us on Facebook'}
              instagramUrl={'https://www.instagram.com/CulinaryCanvas_/'}
              instagramTitle={'Follow us on Instagram'}
              pinterestUrl={'https://www.pinterest.com/Culinary_Canvas/'}
              pinterestTitle={'Follow us on Pinterest'}
            />

            {!!imageSize && (
              <Image
                width={imageSize?.width}
                height={imageSize?.height}
                layout="responsive"
                priority={true}
                quality={70}
                className={s.image}
                alt="@Yves Le Lay by Johan Ståhlberg"
                src={url}
              />
            )}
          </section>
        </article>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} }
}
