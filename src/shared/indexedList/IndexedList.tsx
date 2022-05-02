import { get } from 'lodash'
import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { ImageSet } from '../../image/models/ImageSet'
import { groupBy } from '../../services/utils/groupBy'
import s from './IndexedList.module.scss'

type Indexable = { name: string; slug: string; imageSet: ImageSet }
type WithLetter = { letter: string; object: Indexable }

interface Props {
  objects: Indexable[]
  pathPrefix: string
  smallPaths: string[]
}

export function IndexedList({ objects, pathPrefix, smallPaths = [] }: Props) {
  const groupedByLetter = useMemo<[string, WithLetter[]][]>(() => {
    const withLetter: WithLetter[] = objects.map((object) => ({
      object,
      letter: object.name.substring(0, 1),
    }))
    return Array.from(groupBy(withLetter, 'letter').entries())
  }, [objects])

  return (
    <>
      {groupedByLetter.map(([letter, objs]) => (
        <section key={letter} className={s.section}>
          <h2>{letter}</h2>
          <ul>
            {objs.map((o) => (
              <li key={o.object.slug}>
                <Image
                  className={s.image}
                  src={o.object.imageSet.url}
                  width={80}
                  height={80}
                  objectFit="cover"
                />
                <div className={s.textContainer}>
                  <h4>
                    <Link href={`${pathPrefix}/${o.object.slug}`}>
                      <a>{o.object.name}</a>
                    </Link>
                  </h4>
                  <small>
                    {smallPaths
                      .map((path) => get(o.object, path))
                      .filter((v) => !!v)
                      .join(' / ')}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
