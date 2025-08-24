import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <>
    <Head>
      <link href='/styles/globals.css' rel='stylesheet'/>
    </Head>
    <Html lang="sk">
        <body className='overflow-x-hidden background-white'>
          <Main />
          <NextScript />
        </body>
      </Html></>
  )
}
