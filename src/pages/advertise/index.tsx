import React from 'react'
import { PageHead } from '../../components/PageHead/PageHead'
import {GetStaticProps} from 'next'

export default function Advertise() {
  return (
    <>
      <PageHead noIndex noFollow />

      <main className="container page">
        <article className="content">
          <h1>Advertise with us</h1>
          <section>
            <p>Information about advertising on culinary-canvas.com</p>
          </section>
        </article>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} }
}

