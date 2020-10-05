import 'reflect-metadata'
import React from 'react'
import { AppEnvironment } from '../services/AppEnvironment'
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'

class MyDocument extends Document<{ env: AppEnvironment }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return initialProps
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="Culinary Canvas" content="The Culinary Canvas features" />
          <link rel="manifest" href="manifest.json" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="favicon-16x16.png"
          />
          <link rel="stylesheet" href="https://use.typekit.net/bzr7lju.css" />

          <link rel="apple-touch-icon" href="apple-touch-icon" />

          <title>Culinary Canvas</title>
        </Head>
        <Main />
        <NextScript />
      </Html>
    )
  }
}

export default MyDocument
