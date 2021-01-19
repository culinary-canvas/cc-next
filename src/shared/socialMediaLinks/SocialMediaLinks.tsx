import React, { useMemo } from 'react'
import s from './SocialMediaLinks.module.scss'
import facebook from '../../../public/assets/icons/streamline-icon-social-media-facebook-1@140x140.svg'
import instagram from '../../../public/assets/icons/streamline-icon-social-instagram@140x140.svg'
import pinterest from '../../../public/assets/icons/streamline-icon-social-pinterest@140x140.svg'
import twitter from '../../../public/assets/icons/streamline-icon-social-media-twitter@140x140.svg'
import link from '../../../public/assets/icons/streamline-icon-hyperlink@140x140.svg'
import { ICON, IconSizeType } from '../../styles/_icon'
import { COLOR } from '../../styles/_color'
import { classnames } from '../../services/importHelpers'

interface Props {
  color?: typeof COLOR.WHITE | typeof COLOR.BLACK
  size?: IconSizeType
  containerClassName?: string
  linkClassName?: string
  facebookUrl?: string
  facebookTitle?: string
  instagramUrl?: string
  instagramTitle?: string
  pinterestUrl?: string
  pinterestTitle?: string
  twitterUrl?: string
  twitterTitle?: string
  webSiteUrl?: string
  webSiteTitle?: string
}

export function SocialMediaLinks(props: Props) {
  const {
    color = COLOR.WHITE,
    size = ICON.SIZE.M,
    containerClassName,
    linkClassName,
    facebookUrl = 'https://www.facebook.com/CulinaryCanvasBlog/',
    facebookTitle = 'Follow us on Facebook',
    instagramUrl = 'https://www.instagram.com/CulinaryCanvas_/',
    instagramTitle = 'Follow us on Instagram',
    pinterestUrl = 'https://www.pinterest.com/Culinary_Canvas/',
    pinterestTitle = 'Follow us on Pinterest',
    twitterUrl,
    twitterTitle,
    webSiteUrl,
    webSiteTitle,
  } = props

  const colorClassName = useMemo(
    () => (color === COLOR.WHITE ? 'white' : 'black'),
    [color],
  )

  return (
    <section className={classnames(s.socialMediaContainer, containerClassName)}>
      {!!facebookUrl && (
        <a
          className={linkClassName}
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={facebookTitle}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={facebook}
            alt="Facebook"
            className={s[colorClassName]}
            style={{ width: size }}
          />
        </a>
      )}

      {!!instagramUrl && (
        <a
          className={linkClassName}
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={instagramTitle}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={instagram}
            alt="Instagram"
            className={s[colorClassName]}
            style={{ width: size }}
          />
        </a>
      )}

      {!!pinterestUrl && (
        <a
          className={linkClassName}
          href={pinterestUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={pinterestTitle}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={pinterest}
            alt="Pinterest"
            className={s[colorClassName]}
            style={{ width: size }}
          />
        </a>
      )}

      {!!twitterUrl && (
        <a
          className={linkClassName}
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={twitterUrl}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={twitter}
            alt="Twitter"
            className={s[colorClassName]}
            style={{ width: size }}
          />
        </a>
      )}

      {!!webSiteUrl && (
        <a
          className={linkClassName}
          href={webSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={webSiteTitle}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={link}
            alt="Link"
            className={s[colorClassName]}
            style={{ width: size }}
          />
        </a>
      )}
    </section>
  )
}
