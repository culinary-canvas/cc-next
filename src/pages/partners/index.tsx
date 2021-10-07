import React, { useEffect } from 'react'
import { GetStaticProps } from 'next'
import { PageHead } from '../../shared/head/PageHead'
import { AppService } from '../../services/App.service'
import s from '../about/about.module.scss'
import { firebase } from '../../services/firebase/Firebase'
import { CompanyView } from '../../company/view/CompanyView'
import { useTransformToModel } from '../../hooks/useTransformToModel'
import { CompanyModel } from '../../company/models/Company.model'
import { useRouter } from 'next/router'
import { isServer } from '../_app'
import { useMenu } from '../../menu/Menu.context'
import { menuOptions } from '../../menu/models/menuOptions'
import { collection, getDocs, query, where } from 'firebase/firestore'

interface Props {
  companyData: any
}

export default function About({ companyData }: Props) {
  const company = useTransformToModel(companyData, CompanyModel)
  const router = useRouter()

  const { setActiveMenuOption } = useMenu()
  useEffect(() => {
    setActiveMenuOption(menuOptions.PARTNERS)
  }, [])

  if (router.isFallback) {
    if (isServer) {
      return null
    }
    router.replace('/')
    return null
  }

  return (
    <>
      <PageHead
        title="Partners"
        image={AppService.DEFAULT_SHARE_IMAGE}
        imageAlt={AppService.DEFAULT_SHARE_IMAGE_ALT}
      />

      <main className={s.container}>
        <article className={s.content}>
          <h1>Our partners</h1>
          <p>
            Every chef knows that a successful kitchen isn’t a one man show, but
            teamwork towards a common goal (and the perfect plate). We are very
            proud of all or partners where we, together, can spread the joy of
            creative culinary work in all its forms.
          </p>
          <CompanyView company={company} card />
        </article>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { db } = firebase()

  const companyResponse = await getDocs(
    query(
      collection(db, 'companies'),
      where('slug', '==', 'culinary-arts-academy-switzerland-caas'),
    ),
  )

  const companyData: { [key: string]: any } = {
    ...companyResponse.docs[0].data(),
    id: companyResponse.docs[0].id,
  }

  return {
    props: {
      companyData: JSON.parse(JSON.stringify(companyData)),
    },
  }
}
