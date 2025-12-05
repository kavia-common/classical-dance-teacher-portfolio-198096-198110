import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Achievements section component.
 * Renders a grid of achievements using provided or default mock data.
 */
export default function Achievements({ items }) {
  const achievements = items || [
    {
      title: 'Balashree Award',
      year: '2011',
      description: ' A national honor recognizing outstanding creativity and talent in children across India in fields like art, science, literature, and performance..',
    },
    {
      title: 'Mysore Dasara Award',
      year: '2011',
      description: 'A prestigious honor presented during Karnataka’s grand Dasara festival, recognizing excellence in Bharatanatyam and celebrating India’s rich classical dance heritage.',
    },
    {
      title: 'Kalaratnam Award',
      year: '2012',
      description: 'A distinguished honor celebrating mastery and contribution to Bharatanatyam, recognizing exceptional artistry and dedication to this classical dance form.',
    },
    {
      title: 'Kalashree Award',
      year: '2013',
      description: 'A prestigious recognition honoring exceptional skill and dedication in Bharatanatyam, celebrating excellence in this classical dance tradition.',
    },
  ];

  return (
    <section
      id="achievements"
      aria-labelledby="achievements-heading"
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
          <h2 id="achievements-heading" style={{ color: '#2563EB', margin: 0 }}>Achievements</h2>
          <p style={{ marginTop: 6, color: '#4B5563' }}>Highlights and milestones from the journey.</p>
        </div>
        <span aria-hidden="true" style={{ color: '#F59E0B', fontWeight: 600 }}>Celebrating excellence</span>
      </div>

      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          listStyle: 'none',
          padding: 0,
          marginTop: '1.25rem',
        }}
      >
        {achievements.map((a, idx) => (
          <li
            key={`${a.title}-${idx}`}
            style={{
              border: '1px solid #E5E7EB',
              borderRadius: 12,
              padding: '1rem',
              background: 'linear-gradient(180deg, rgba(37,99,235,0.06) 0%, #fff 100%)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <h3 style={{ margin: 0, color: '#111827', fontSize: '1.05rem' }}>{a.title}</h3>
              <span style={{ color: '#2563EB', fontWeight: 600, fontSize: '0.9rem' }}>{a.year}</span>
            </div>
            <p style={{ margin: 0, color: '#374151', lineHeight: 1.5 }}>{a.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
