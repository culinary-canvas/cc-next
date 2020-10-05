import React from 'react'
import { Helmet } from 'react-helmet'
import { NavigationService } from '../../services/navigation/Navigation.service'

interface Props {
  quote: string
  image: string
  description: string
  hashtag: string
}

export function HelmetMetaData(props: Props) {
  const {
    quote = '',
    image,
    description = 'Culinary Canvas description here',
    hashtag = '#culinarycanvas',
  } = props
  //TODO nav
  const { response }: any = null //useResponse()
  const currentUrl = 'https://culinary-canvas.com' + response.location.pathname
  const title = NavigationService.getPageTitle(response)
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="title" content={title} />
      <meta property="quote" content={quote} />
      <meta name="description" content={description} />
      <meta property="image" content={image} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:quote" content={quote} />
      <meta property="og:hashtag" content={hashtag} />
      <meta property="og:image" content={image} />
      <meta property="og:image:type" content="image/*" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="CampersTribe" />
      <meta property="og:description" content={description} />
    </Helmet>
  )
}
