import { generateSEOMetadata, generateStructuredData } from '../lib/seo';

// SEO component for Astro pages
export default function SEO({ pageName, locale }) {
  const metadata = generateSEOMetadata(pageName, locale);
  const structuredData = generateStructuredData(locale);
  
  return (
    <>
      {/* Basic Meta Tags */}
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`https://niledosecafe.com${locale === 'ar' ? '' : '/en'}${pageName === 'home' ? '' : `/${pageName}`}`} />
      
      {/* Alternate Language Links */}
      <link rel="alternate" hreflang="ar" href={`https://niledosecafe.com${pageName === 'home' ? '' : `/${pageName}`}`} />
      <link rel="alternate" hreflang="en" href={`https://niledosecafe.com/en${pageName === 'home' ? '' : `/${pageName}`}`} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:image" content={`https://niledosecafe.com${metadata.ogImage}`} />
      <meta property="og:url" content={`https://niledosecafe.com${locale === 'ar' ? '' : '/en'}${pageName === 'home' ? '' : `/${pageName}`}`} />
      <meta property="og:type" content={metadata.ogType} />
      <meta property="og:site_name" content={locale === 'ar' ? 'النيل دوز كافية' : 'Nile Dose Cafe'} />
      <meta property="og:locale" content={locale === 'ar' ? 'ar_SA' : 'en_US'} />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={metadata.twitterCard} />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
      <meta name="twitter:image" content={`https://niledosecafe.com${metadata.ogImage}`} />
      
      {/* Favicon */}
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Direction for RTL/LTR */}
      <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} />
    </>
  );
}
