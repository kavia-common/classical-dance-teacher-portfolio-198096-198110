import React from 'react';
import { Helmet } from 'react-helmet-async';
import { buildTitle, defaultMeta } from '../utils/seo';

// PUBLIC_INTERFACE
export default function SEO({ title, description, url, image }) {
  /** Inject SEO meta tags into the document head. */
  const finalTitle = buildTitle(title || defaultMeta.title);
  const desc = description || defaultMeta.description;
  const img = image || defaultMeta.image;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={desc} />
      {url ? <meta property="og:url" content={url} /> : null}
      {img ? <meta property="og:image" content={img} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
