import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { Article } from '../../../components/Article/Article'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ArticleApi } from '../../../domain/Article/Article.api'
import { Article as _Article } from '../../../domain/Article/Article'
import { useTransform } from '../../../hooks/useTransform'
import { PlainObject } from '../../../types/PlainObject'
import s from './articlePage.module.scss'
import Head from 'next/head'
import { ContentType } from '../../../domain/Text/ContentType'
import { TextContent } from '../../../domain/Text/TextContent'

interface Props {
  articleData: PlainObject<_Article>
}

const ArticlePage = observer(({ articleData }: Props) => {
  const router = useRouter()
  const article = useTransform([articleData], _Article)[0]
  const [quote, setQuote] = useState<string>()
  const [image, setImage] = useState<string>()
  const [description, setDescription] = useState<string>(
    '' +
      "At Culinary Canvas, we celebrate the craftsmanship of the world's\n" +
      'most creative culinary and beverage professionals. Their ingenuity\n' +
      'inspires us to look at food and drink through a uniquely creative\n' +
      'lens.',
  )
  const [title, setTitle] = useState<string>()
  const hashtag = useRef<string>('#culinarycanvas').current
  const currentUrl = useRef<string>(
    'https://culinary-canvas.com' + router.asPath,
  ).current

  useEffect(() => {
    console.log('setting custom values')
    setQuote('This is the quote')
    setImage(article.imageContent.url)
    setDescription(
      (article.titleSection.sortedContents.find(
        (c) => c.type === ContentType.SUB_HEADING,
      ) as TextContent)?.value || '',
    )
    setTitle(article.title)
    // title.replace('"', '&quot;')
  }, [article])

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!article) {
    return null
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="title" content={title} />
        <meta property="quote" content={quote} />
        <meta name="description" content={description} />
        <meta property="image" content={image} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:quote" content={quote} />
        <meta property="og:hashtag" content={hashtag} />
        <meta property="og:image" content={image} />
        <meta property="og:image:type" content="image/*" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Culinary Canvas" />
        <meta property="og:description" content={description} />
      </Head>
      <main className={s.container}>
        <Article article={article} />
      </main>
    </>
  )
})

interface StaticProps {
  slug: string
  [key: string]: string
}

export const getStaticPaths: GetStaticPaths<StaticProps> = async () => {
  const articles = await ArticleApi.all()

  return {
    paths: articles.map((article) => ({
      params: {
        slug: article.slug,
      },
    })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<
  Props & { [key: string]: any },
  StaticProps
> = async ({ params }) => {
  const articleData = await ArticleApi.bySlug(params.slug)

  return {
    props: {
      articleData,
    },
    revalidate: 1,
  }
}

export default ArticlePage
