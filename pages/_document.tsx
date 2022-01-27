import Document, { Html, Head, Main, NextScript } from "next/document";
import { NextSeo } from "next-seo";

import { GA_TRACKING_ID } from "../utils/gtag";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
          `,
            }}
          />
          <title>UnOfficial Map for Miami Hack Week January 2022</title>
          <NextSeo
            title="UnOfficial Map for Miami Hack Week January 2022"
            description="Miami Hack Week Map app by NorusTech"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
