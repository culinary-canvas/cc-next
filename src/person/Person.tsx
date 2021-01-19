import React, { useEffect, useState } from 'react'
import { PersonModel } from './Person.model'
import s from './Person.module.scss'
import { SocialMediaLinks } from '../shared/socialMediaLinks/SocialMediaLinks'
import Image from 'next/image'
import { classnames } from '../services/importHelpers'
import Link from 'next/link'

interface Props {
  person: PersonModel
}

export function Person({ person }: Props) {
  const [description, setDescription] = useState<string>('')

  useEffect(() => {
    const maxLength = 50
    let truncated = person.description.substring(0, maxLength)
    if (person.description.length > maxLength) {
      truncated += '...'
    }
    setDescription(truncated)
  }, [person])

  return (
    <div className={classnames(s.container)}>
      <figure>
        {!!person.image?.cropped?.url ? (
          <Image
            quality={50}
            objectFit="cover"
            objectPosition="center"
            layout="fill"
            src={person.image?.cropped?.url}
            alt={person.image?.alt}
          />
        ) : (
          <span>{person.name.substring(0, 1)}</span>
        )}
      </figure>
      <SocialMediaLinks
        size={14}
        containerClassName={s.socialMediaContainer}
        linkClassName={s.socialMediaLink}
        facebookUrl={person.facebook}
        facebookTitle={`${person.name} @ Facebook`}
        instagramUrl={person.instagram}
        instagramTitle={`${person.name} @ Instagram`}
        twitterUrl={person.twitter}
        twitterTitle={`${person.name} @ Twitter`}
        webSiteUrl={person.web}
        webSiteTitle={`${person.name} @ Twitter`}
      />
      <h2>
        <Link href={`/persons/${person.slug}`}>
          <a>{person.name}</a>
        </Link>
      </h2>

      <h4>{person.title}</h4>

      <p>{description}</p>
    </div>
  )
}
