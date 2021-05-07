import React, { useEffect, useRef, useState } from 'react'
import s from './contact.module.scss'
import { GetStaticProps } from 'next'
import { SocialMediaLinks } from '../../shared/socialMediaLinks/SocialMediaLinks'
import { PageHead } from '../../shared/head/PageHead'
import Image from 'next/image'
import { ImageService } from '../../services/Image.service'

export default function Contact() {
  const url = useRef(
    'https://firebasestorage.googleapis.com/v0/b/culinary-canvas.appspot.com/o/contact%2F_DSC9508.jpg?alt=media&token=aebc373c-b3b2-40be-8f56-dbab72a71ee2',
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
        title="Contact"
        description="Send us an email or contact us via social media. We’re serving creativity."
        image="https://firebasestorage.googleapis.com/v0/b/culinary-canvas.appspot.com/o/contact%2F_DSC9508.jpg?alt=media&token=aebc373c-b3b2-40be-8f56-dbab72a71ee2"
        imageAlt="@Högtorps gård by Johan Ståhlberg"
      />

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
            <SocialMediaLinks
              containerClassName={s.socialMediaContainer}
              linkClassName={s.socialMediaLink}
            />
          </section>
          {!!imageSize && (
            <Image
              width={imageSize?.width}
              height={imageSize?.height}
              layout="responsive"
              priority={true}
              quality={70}
              className={s.image}
              alt="@Högtorps gård by Johan Ståhlberg"
              src={url}
            />
          )}
        </article>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} }
}
