import classNames from 'classnames'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CompanyApi } from '../../company/Company.api'
import { CompanyModel } from '../../company/models/Company.model'
import { useTransformToModels } from '../../hooks/useTransformToModels'
import { PersonModel } from '../../person/models/Person.model'
import { PersonApi } from '../../person/Person.api'
import { PersonService } from '../../person/Person.service'
import { Button } from '../../shared/button/Button'
import { PageHead } from '../../shared/head/PageHead'
import { IndexedList } from '../../shared/indexedList/IndexedList'
import { isServer } from '../_app'
import s from './index.module.scss'

interface Props {
  personsData: any[]
  companiesData: any[]
}

function Index({ personsData, companiesData }: Props) {
  const persons = useTransformToModels(personsData, PersonModel)
  const companies = useTransformToModels(companiesData, CompanyModel)
  const router = useRouter()

  const [viewing, setViewing] = useState<'persons' | 'companies'>('persons')

  const toggle = useCallback(
    () => setViewing(viewing === 'persons' ? 'companies' : 'persons'),
    [viewing],
  )

  const objects = useMemo(
    () => (viewing === 'persons' ? persons : companies),
    [viewing, persons, companies],
  )

  const pathPrefix = useMemo(
    () => (viewing === 'persons' ? '/persons' : '/companies'),
    [viewing],
  )

  const smallPaths = useMemo(
    () => (viewing === 'persons' ? ['title', 'company.name'] : ['type']),
    [viewing],
  )

  useEffect(() => {
    PersonService.populate(persons, companies)
  }, [persons, companies])

  useEffect(() => window.scrollTo({ behavior: 'smooth', top: 0 }), [])

  if (router.isFallback) {
    if (isServer) {
      return null
    }
    router.replace('/')
    return null
  }

  return (
    <>
      <PageHead title={`Culinary Canvas — Index`} />

      <main className={classNames(s.container)}>
        <article className={s.list}>
          <header>
            <h1>Index</h1>
            <div className={s.toggleButtons}>
              <Button
                toggleable
                onClick={toggle}
                selected={viewing === 'persons'}
              >
                Persons
              </Button>
              <Button
                toggleable
                onClick={toggle}
                selected={viewing === 'companies'}
              >
                Companies
              </Button>
            </div>
          </header>
          <IndexedList
            objects={objects}
            pathPrefix={pathPrefix}
            smallPaths={smallPaths}
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const personsData = await PersonApi.allNoTransform()
  const companiesData = await CompanyApi.allNoTransform()

  return {
    props: {
      personsData: JSON.parse(JSON.stringify(personsData)),
      companiesData: JSON.parse(JSON.stringify(companiesData)),
    },
  }
}

export default Index
