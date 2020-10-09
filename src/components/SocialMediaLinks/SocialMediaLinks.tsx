import React, { useMemo } from 'react'
import s from './SocialMediaLinks.module.scss'
import facebook from '../../../public/assets/icons/streamline-icon-social-media-facebook-1@140x140.svg'
import instagram from '../../../public/assets/icons/streamline-icon-social-instagram@140x140.svg'
import pinterest from '../../../public/assets/icons/streamline-icon-social-pinterest@140x140.svg'
import { ICON, IconSizeType } from '../../styles/icon'
import {COLOR} from '../../styles/color'

interface Props {
  color?: typeof COLOR.WHITE | typeof COLOR.BLACK
  size?: IconSizeType
}

export function SocialMediaLinks(props: Props) {
  const { color = COLOR.WHITE, size = ICON.SIZE.M } = props

  const colorClassName = useMemo(
    () => (color === COLOR.WHITE ? 'white' : 'black'),
    [color],
  )

  return (
    <section className={s.socialMediaContainer}>
      <a
        href="https://www.facebook.com/CulinaryCanvasBlog/"
        target="_blank"
        rel="noopener noreferrer"
        title="Follow us on Facebook"
      >
        <img
          src={facebook}
          alt="Facebook"
          className={s[colorClassName]}
          style={{ width: size }}
        />
      </a>

      <a
        href="https://www.instagram.com/CulinaryCanvas_/"
        target="_blank"
        rel="noopener noreferrer"
        title="Follow us on Instagram"
      >
        <img
          src={instagram}
          alt="Instagram"
          className={s[colorClassName]}
          style={{ width: size }}
        />
      </a>
      <a
        href="https://www.pinterest.com/Culinary_Canvas/"
        target="_blank"
        rel="noopener noreferrer"
        title="Follow us on Pinterest"
      >
        <img
          src={pinterest}
          alt="Pinterest"
          className={s[colorClassName]}
          style={{ width: size }}
        />
      </a>
    </section>
  )
}
