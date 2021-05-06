import React, { useEffect, useState } from 'react'
import { CompanyModel } from '../models/Company.model'
import s from './CompanyView.module.scss'
import { SocialMediaLinks } from '../../shared/socialMediaLinks/SocialMediaLinks'
import { classnames } from '../../services/importHelpers'
import Link from 'next/link'
import StringUtils from '../../services/utils/StringUtils'
import ReactMarkdown from 'react-markdown'
import { Image } from '../../shared/image/Image'
import { observer } from 'mobx-react-lite'

interface Props {
  company: CompanyModel
  className?: string
  card?: boolean
  children?: any
}

export const CompanyView = observer((props: Props) => {
  const { company, className, card = false, children } = props
  const [description, setDescription] = useState<string>('')

  useEffect(() => {
    if (!children) {
      if (card) {
        const maxLength = 50
        let truncated = company.description.substring(0, maxLength)
        if (company.description.length > maxLength) {
          truncated += '...'
        }
        setDescription(truncated)
      } else {
        setDescription(company.description)
      }
    }
  }, [company, children])

  return (
    <div className={classnames(s.container, className, { [s.card]: card })}>
      <Image
        imageSet={company.imageSet}
        sizes="200px"
        priority={!card}
        objectFit="contain"
        objectPosition="top"
        layout="fill"
        placeholder={() => (
          <div className={s.noImagePlaceholder}>
            <span>{company.name.substring(0, 1)}</span>
          </div>
        )}
        figureClassName={classnames(s.figure, {
          [s.noImage]: !company.imageSet?.url,
        })}
      />
      <div className={s.grid}>
        <SocialMediaLinks
          size={14}
          containerClassName={s.socialMediaContainer}
          linkClassName={s.socialMediaLink}
          facebookUrl={company.facebook}
          facebookTitle={`${company.name} @ Facebook`}
          instagramUrl={company.instagram}
          instagramTitle={`${company.name} @ Instagram`}
          twitterUrl={company.twitter}
          twitterTitle={`${company.name} @ Twitter`}
          webSiteUrl={company.web}
          webSiteTitle={`${company.name} @ Twitter`}
        />

        {card ? (
          <h2 className={s.name}>
            <Link href={`/companies/${company.slug}`}>
              <a>{company.name}</a>
            </Link>
          </h2>
        ) : (
          <h1 className={s.name}>{company.name}</h1>
        )}

        <h4 className={s.title}>
          <span>{StringUtils.toDisplayText(company.type)}</span>
          {company.partner && <span className={s.partner}>Partner</span>}
        </h4>

        {!!description && (
          <div className={s.description}>
            <ReactMarkdown
              renderers={{
                link: ({ node }) => (
                  <a href={node.url} rel="noopener" target="_blank">
                    {node.children[0].value}
                  </a>
                ),
              }}
            >
              {description}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
})
