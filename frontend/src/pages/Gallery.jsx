import React, { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { fetchGallery } from '../services/galleryService';
import GalleryGrid from '../components/GalleryGrid';
import SEO from '../components/SEO';

// PUBLIC_INTERFACE
export default function Gallery() {
  /** Gallery page fetching images. */
  const { call, data, loading, error } = useApi(fetchGallery);

  useEffect(() => { call(); }, [call]);

  return (
    <div>
      <SEO title="Gallery" />
      {loading && <p>Loading gallery...</p>}
      {error && <p className="text-muted">Failed to load gallery.</p>}
      {!loading && <GalleryGrid images={data || []} />}
    </div>
  );
}
