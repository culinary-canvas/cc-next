import React, { useEffect, useState } from 'react'
import { CompanyModel } from './Company.model'
import s from './Company.module.scss'
import { SocialMediaLinks } from '../shared/socialMediaLinks/SocialMediaLinks'
import Image from 'next/image'
import { classnames } from '../services/importHelpers'
import Link from 'next/link'
import StringUtils from '../services/utils/StringUtils'

interface Props {
  company: CompanyModel
}

export function Company({ company }: Props) {
  const [description, setDescription] = useState<string>('')

  useEffect(() => {
    const maxLength = 50
    let truncated = company.description.substring(0, maxLength)
    if (company.description.length > maxLength) {
      truncated += '...'
    }
    setDescription(truncated)
  }, [company])

  return (
    <div className={classnames(s.container)}>
      <figure
        className={classnames({ [s.noImage]: !company.image?.cropped?.url })}
      >
        {!!company.image?.cropped?.url ? (
          <Image
            quality={50}
            objectFit="contain"
            objectPosition="center"
            layout="fill"
            src={company.image?.cropped?.url}
            alt={company.image?.alt}
          />
        ) : (
          <span>{company.name.substring(0, 1)}</span>
        )}
      </figure>
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
      <h2>
        <Link href={`/companies/${company.slug}`}>
          <a>{company.name}</a>
        </Link>
      </h2>

      <h4>{StringUtils.toDisplayText(company.type)}</h4>

      <p>{description}</p>
    </div>
  )
}
