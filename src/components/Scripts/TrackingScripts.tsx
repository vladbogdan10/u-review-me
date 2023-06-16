import React, { useEffect } from 'react';
import Script from 'next/script';

const TrackingScripts = () => {
  const gTagId = 'G-1234567890';

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore
      window[`ga-disable-${gTagId}`] = true;
    }
  }, []);

  return (
    <>
      {/* cookie consent */}
      <Script
        src="/scripts/cookieconsent.min.js"
        strategy="beforeInteractive"
      />
      <Script src="/scripts/cmp-v2.js" strategy="beforeInteractive" />
      {/* google analytics*/}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gTagId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag('js', new Date());
          gtag('config', '${gTagId}');
      `}
      </Script>
    </>
  );
};

export default TrackingScripts;
