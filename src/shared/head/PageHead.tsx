import React, { useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { IS_PROD } from '../../pages/_app'

interface Props {
  image?: string
  imageWidth?: number
  imageHeight?: number
  imageAlt?: string
  description?: string
  title?: string
  noIndex?: boolean
  noFollow?: boolean
}

export function PageHead(props: Props) {
  const {
    image = 'https://firebasestorage.googleapis.com/v0/b/culinary-canvas.appspot.com/o/about%2F_DSC9450.jpg?alt=media&token=f95882a3-eb5a-4f83-8f4e-c4476e2e422f',
    imageWidth,
    imageHeight,
    imageAlt = '@Yves Le Lay by Johan Ståhlberg',
    description = "At Culinary Canvas, we celebrate the craftsmanship of the world's\n" +
      'most creative culinary and beverage professionals. Their ingenuity\n' +
      'inspires us to look at food and drink through a uniquely creative\n' +
      'lens.',
    title = 'Culinary Canvas',
    noIndex = false,
    noFollow = false,
  } = props
  const router = useRouter()
  const hashtag = useRef<string>('#culinarycanvas').current
  const url = useRef<string>(
    `${process.env.NEXT_PUBLIC_SITE_URL}${router.asPath}`,
  ).current

  const fullTitle =
    title !== 'Culinary Canvas' ? `${title} | Culinary Canvas` : title

  const robots = []
  if (noIndex || !IS_PROD) {
    robots.push('noindex')
  }
  if (noFollow || !IS_PROD) {
    robots.push('nofollow')
  }
  const robotsValue = !!robots.length && robots.join(', ')

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="title" key="title" content={fullTitle} />
      <meta name="description" content={description} />
      {robotsValue && <meta name="robots" content={robotsValue} />}
      <meta
        name="copyright"
        content={`Copyright (c) Culinary Canvas ${new Date().getFullYear()}`}
      />
      <meta property="quote" key="quote" content={description} />
      <meta property="image" key="image" content={image} />
      <meta property="og:type" key="og:type" content="website" />
      <meta property="og:title" key="og:title" content={fullTitle} />
      <meta property="og:quote" key="og:quote" content={description} />
      <meta property="og:hashtag" key="og:hashtag" content={hashtag} />
      <meta property="og:image" key="og:image" content={image} />
      <meta property="og:image:type" key="og:image:type" content="image/*" />
      <meta property="og:image:alt" key="og:image:alt" content={imageAlt} />
      {!!imageWidth && (
        <meta
          property="og:image:width"
          key="og:image:width"
          content={String(imageWidth)}
        />
      )}
      {!!imageWidth && (
        <meta
          property="og:image:height"
          key="og:image:height"
          content={String(imageHeight)}
        />
      )}
      <meta property="og:url" key="og:url" content={url} />
      <meta
        property="og:site_name"
        key="og:site_name"
        content="Culinary Canvas"
      />
      <meta
        property="og:description"
        key="og:description"
        content={description}
      />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}
