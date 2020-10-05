import React from 'react'
import envelope from '../../assets/icons/streamline-icon-envelope@140x140.svg'
import facebook from '../../assets/icons/streamline-icon-social-media-facebook-1@140x140.svg'
import twitter from '../../assets/icons/streamline-icon-social-media-twitter@140x140.svg'
import linkedIn from '../../assets/icons/streamline-icon-professional-network-linkedin@140x140.svg'
import pinterest from '../../assets/icons/streamline-icon-social-pinterest@140x140.svg'
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  TwitterShareButton,
} from 'react-share'
import './Share.module.scss'
import { Article } from '../../domain/Article/Article'
import { NavigationService } from '../../services/navigation/Navigation.service'
import { HelmetMetaData } from '../HelmetMetaData/HelmetMetaData'

interface Props {
  article: Article
}

export const Share = (props: Props) => {
  const { article } = props
  // TODO nav
  const { response }: any = null //useResponse()

  const quote = `${article.title} @ Culinary Canvas`
  const image = article.imageContent.set.s.url
  const hashtag = 'culinarycanvas'
  const url = `https://culinary-canvas.com${response.location.pathname}`
  const description = !!article.subHeading
    ? `${article.title} — ${article.subHeading} @ Culinary Canvas`
    : `${article.title} @ Culinary Canvas description`
  const title = NavigationService.getPageTitle(response)

  return (
    <>
      <HelmetMetaData
        quote={quote}
        image={image}
        description={description}
        hashtag={hashtag}
      />
      <section className="container share">
        <EmailShareButton
          url={window.location.href}
          className="share-button"
          subject={`"${article.title}" @ Culinary Canvas`}
          body={`I found this article at Culinary Canvas: ${article.title} \nFollow this link to read it:`}
        >
          <img src={envelope} alt="Logotype" className="icon" />
        </EmailShareButton>

        <FacebookShareButton
          url={url}
          className="share-button"
          quote={quote}
          hashtag={`#${hashtag}`}
        >
          <img src={facebook} alt="Logotype" className="icon" />
        </FacebookShareButton>

        <TwitterShareButton
          url={url}
          className="share-button"
          title={title}
          hashtags={[hashtag]}
        >
          <img src={twitter} alt="Logotype" className="icon" />
        </TwitterShareButton>

        <LinkedinShareButton
          url={url}
          title={title}
          summary={description}
          source="https://culinary-canvas.com"
          className="share-button"
        >
          <img src={linkedIn} alt="Logotype" className="icon" />
        </LinkedinShareButton>

        <PinterestShareButton
          url={url}
          media={image}
          description={description}
          className="share-button"
        >
          <img src={pinterest} alt="Logotype" className="icon" />
        </PinterestShareButton>
      </section>
    </>
  )
}
