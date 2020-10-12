import React from 'react'
import envelope from '../../../../public/assets/icons/streamline-icon-envelope@140x140.svg'
import facebook from '../../../../public/assets/icons/streamline-icon-social-media-facebook-1@140x140.svg'
import twitter from '../../../../public/assets/icons/streamline-icon-social-media-twitter@140x140.svg'
import linkedIn from '../../../../public/assets/icons/streamline-icon-professional-network-linkedin@140x140.svg'
import pinterest from '../../../../public/assets/icons/streamline-icon-social-pinterest@140x140.svg'
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  TwitterShareButton,
} from 'react-share'
import { ArticleModel } from '../../Article.model'
import { useRouter } from 'next/router'
import s from './Share.module.scss'
import { classnames } from '../../../services/importHelpers'

interface Props {
  article: ArticleModel
  containerClassName?: string
}

export const Share = (props: Props) => {
  const { article, containerClassName } = props
  const router = useRouter()

  const quote = `${article.title} @ Culinary Canvas`
  const image = article.imageContent.set.s.url
  const hashtag = 'culinarycanvas'
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}${router.asPath}`
  const description = !!article.subHeading
    ? `${article.title} — ${article.subHeading} @ Culinary Canvas`
    : `${article.title} @ Culinary Canvas`
  const title = `${article.title} @ Culinary Canvas`

  return (
    <>
      {/*
      <HelmetMetaData
        quote={quote}
        image={image}
        description={description}
        hashtag={hashtag}
      />
*/}
      <section className={classnames(s.container, containerClassName)}>
        <EmailShareButton
          url={url}
          subject={`"${article.title}" @ Culinary Canvas`}
          body={`I found this article at Culinary Canvas: ${article.title} \nFollow this link to read it:`}
        >
          <img src={envelope} alt="Share via email" className="icon" />
        </EmailShareButton>

        <FacebookShareButton url={url} quote={quote} hashtag={`#${hashtag}`}>
          <img src={facebook} alt="Share on Facebook" className="icon" />
        </FacebookShareButton>

        <TwitterShareButton url={url} title={title} hashtags={[hashtag]}>
          <img src={twitter} alt="Share on Twitter" className="icon" />
        </TwitterShareButton>

        <LinkedinShareButton
          url={url}
          title={title}
          summary={description}
          source="https://culinary-canvas.com"
        >
          <img src={linkedIn} alt="Share on LinkedIn" className="icon" />
        </LinkedinShareButton>

        <PinterestShareButton url={url} media={image} description={description}>
          <img src={pinterest} alt="Share on Pinterest" className="icon" />
        </PinterestShareButton>
      </section>
    </>
  )
}
