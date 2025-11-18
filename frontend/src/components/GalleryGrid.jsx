import React from 'react';

// PUBLIC_INTERFACE
export default function GalleryGrid({ images = [] }) {
  /** Responsive gallery grid with lazy-loaded images. */
  if (!images.length) {
    images = Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      alt: `Performance ${i + 1}`,
      src: `https://picsum.photos/seed/dance${i}/600/400`,
    }));
  }
  return (
    <div className="grid grid-3">
      {images.map((img) => (
        <figure key={img.id} className="card" style={{ overflow: 'hidden' }}>
          <img
            src={img.src}
            alt={img.alt}
            loading="lazy"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <figcaption className="u-p-4 text-muted">{img.alt}</figcaption>
        </figure>
      ))}
    </div>
  );
}
