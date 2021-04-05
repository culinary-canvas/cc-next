import React, { useEffect } from 'react'
import { GetStaticProps } from 'next'
import { PageHead } from '../../head/PageHead'
import { AppService } from '../../services/App.service'
import s from '../about/about.module.scss'
import { initFirebase } from '../../services/firebase/Firebase'
import { Company } from '../../company/Company'
import { useTransformToModel } from '../../hooks/useTransformToModel'
import { CompanyModel } from '../../company/Company.model'
import { useRouter } from 'next/router'
import { isServer } from '../_app'
import { useMenu } from '../../menu/Menu.context'
import { menuOptions } from '../../menu/menuOptions'

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
            Every chef knows that a successful kitchen isn’t a one man show,
            but teamwork towards a common goal (and the perfect plate). We are
            very proud of all or partners where we, together, can spread the
            joy of creative culinary work in all its forms.
          </p>
          <Company company={company} card />
        </article>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { firestore } = initFirebase()

  const companyResponse = await firestore()
    .collection('companies')
    .where('slug', '==', 'culinary-arts-academy-switzerland-caas')
    .get()

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
