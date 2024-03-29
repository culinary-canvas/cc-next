import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PersonModel } from '../models/Person.model'
import s from './PersonView.module.scss'
import { SocialMediaLinks } from '../../shared/socialMediaLinks/SocialMediaLinks'
import { classnames } from '../../services/importHelpers'
import Link from 'next/link'
import { TextContentService } from '../../article/services/TextContent.service'
import { ImageService } from '../../services/Image.service'
import { Image } from '../../shared/image/Image'

interface Props {
  person: PersonModel
  className?: string
  card?: boolean
}

export function PersonView(props: Props) {
  const { person, className, card = false } = props
  const [description, setDescription] = useState<string>('')

  useEffect(() => {
    if (card) {
      const maxLength = 50
      let truncated = person.description.substring(0, maxLength)
      if (person.description.length > maxLength) {
        truncated += '...'
      }
      setDescription(truncated)
    } else {
      setDescription(person.description)
    }
  }, [person])

  return (
    <div className={classnames(s.container, className, { [s.card]: card })}>
      <Image
        sizes="200px"
        imageSet={person.imageSet}
        priority={!card}
        figureClassName={classnames(s.figure, {
          [s.noImage]: !person.imageSet?.url,
        })}
        objectFit="cover"
        objectPosition="center"
        layout="fill"
        placeholder={() => (
          <div className={s.noImagePlaceholder}>
            <span>{person.name.substring(0, 1)}</span>
          </div>
        )}
      />
      <div className={s.grid}>
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

        {card ? (
          <h2 className={s.name}>
            <Link href={`/persons/${person.slug}`}>
              <a>{person.name}</a>
            </Link>
          </h2>
        ) : (
          <h1 className={s.name}>{person.name}</h1>
        )}

        {!!person.title && (
          <h3 className={s.title}>
            <span>{person.title}</span>
          </h3>
        )}

        {!!description && <p className={s.description}>{description}</p>}
      </div>
    </div>
  )
}
