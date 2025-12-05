import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Gallery section component.
 * Displays a responsive grid of images with captions. Uses placeholders if no images provided.
 */
export default function Gallery({ images }) {
  // Use placeholder assets if none are provided
  const gallery = images || [
    {
      src: 'https://images.pexels.com/photos/26856873/pexels-photo-26856873.jpeg?q=80&w=1200&auto=format&fit=crop',
      alt: 'Classical dance pose silhouette on stage',
      caption: 'Graceful pose on stage',
    },
    {
      src: 'https://images.pexels.com/photos/31880368/pexels-photo-31880368.jpeg?q=80&w=1200&auto=format&fit=crop',
      alt: 'Traditional costume detail',
      caption: 'Traditional costume details',
    },
    {
      src: 'https://images.pexels.com/photos/16039776/pexels-photo-16039776.jpeg?q=80&w=1200&auto=format&fit=crop',
      alt: 'Practice session in studio',
      caption: 'Practice session',
    },
    {
      src: 'https://images.pexels.com/photos/20134504/pexels-photo-20134504.jpeg?q=80&w=1200&auto=format&fit=crop',
      alt: 'Performance with live musicians',
      caption: 'Performance night',
    },
    {
      src: 'https://images.pexels.com/photos/20134505/pexels-photo-20134505.jpeg?q=80&w=1200&auto=format&fit=crop',
      alt: 'Anklet bells and footwork',
      caption: 'Rhythmic footwork',
    },
    {
      src: 'https://images.pexels.com/photos/33638407/pexels-photo-33638407.jpeg?q=80&w=1200&auto=format&fit=crop',
      alt: 'Elegant hand gestures closeup',
      caption: 'Elegant mudras',
    },
  ];

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      style={{
        margin: '2rem 0',
        padding: '2rem',
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h2 id="gallery-heading" style={{ color: '#2563EB', margin: 0 }}>Gallery</h2>
          <p style={{ marginTop: 6, color: '#4B5563' }}>Glimpses from performances and practice.</p>
        </div>
        <span aria-hidden="true" style={{ color: '#F59E0B', fontWeight: 600 }}>Visual stories</span>
      </div>

      <div
        role="list"
        aria-label="Photo gallery"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '0.75rem',
          marginTop: '1rem',
        }}
      >
        {gallery.map((img, idx) => (
          <figure
            key={`${img.src}-${idx}`}
            role="listitem"
            style={{
              margin: 0,
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid #E5E7EB',
              background: '#f9fafb',
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              style={{
                display: 'block',
                width: '100%',
                height: 180,
                objectFit: 'cover',
              }}
            />
            {img.caption && (
              <figcaption style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', color: '#374151', background: '#ffffff' }}>
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
