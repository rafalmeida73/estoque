import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';
import Script from 'next/script';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Roboto&family=Tinos:wght@400;700&display=swap" rel="stylesheet" />

          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap" />
          <link rel="shortcut icon" href="/favicon.ico" type="image/ico" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
          />
          <meta
            name="description"
            content="Projeto front-end Full Stack development - Senac"
          />

          {/* <!-- Open Graph / Facebook --> */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="/" />
          <meta property="og:title" content="Estoque" />
          <meta property="og:description" content="Projeto front-end Full Stack development - Senac" />
          <meta property="og:image" content="/metaTags.png" />

          {/* <!-- Twitter --> */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://metatags.io/" />
          <meta property="twitter:title" content="Estoque" />
          <meta property="twitter:description" content="Projeto front-end Full Stack development - Senac" />
          <meta property="twitter:image" content="/metaTags.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js" />

          <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js" />
        </body>
      </Html>
    );
  }
}
