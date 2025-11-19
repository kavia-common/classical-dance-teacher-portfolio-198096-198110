import React, { useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Classes & Schedule component.
 * Displays upcoming classes with a simple filter. Uses mock static data and is accessible/responsive.
 */
export default function ClassesSchedule({ data }) {
  const mock = useMemo(
    () => data || [
      {
        id: 'bharatanatyam-beginner',
        style: 'Bharatanatyam',
        level: 'Beginner',
        day: 'Saturday',
        time: '10:00 AM - 11:30 AM',
        mode: 'In-person',
        location: 'Studio A',
        instructor: 'Guru Lakshmi',
        notes: 'Foundations of adavus, mudras, and rhythm.',
      },
      {
        id: 'kathak-intermediate',
        style: 'Kathak',
        level: 'Intermediate',
        day: 'Sunday',
        time: '11:00 AM - 12:30 PM',
        mode: 'Online',
        location: 'Zoom',
        instructor: 'Guru Lakshmi',
        notes: 'Chakkars, footwork (tatkaar), abhinaya practice.',
      },
      {
        id: 'odissi-beginner',
        style: 'Odissi',
        level: 'Beginner',
        day: 'Wednesday',
        time: '6:00 PM - 7:30 PM',
        mode: 'In-person',
        location: 'Studio B',
        instructor: 'Guest Faculty',
        notes: 'Basic stances, torso movements, and repertoire intro.',
      },
      {
        id: 'fusion-open',
        style: 'Classical Fusion',
        level: 'Open',
        day: 'Friday',
        time: '5:30 PM - 7:00 PM',
        mode: 'In-person',
        location: 'Studio A',
        instructor: 'Ensemble',
        notes: 'Creative choreography blending styles. All levels welcome.',
      },
    ],
    [data]
  );

  const styles = ['All', ...Array.from(new Set(mock.map(m => m.style)))];
  const [selectedStyle, setSelectedStyle] = useState('All');

  const filtered = useMemo(
    () => (selectedStyle === 'All' ? mock : mock.filter(m => m.style === selectedStyle)),
    [mock, selectedStyle]
  );

  return (
    <section
      id="classes"
      aria-labelledby="classes-heading"
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
          <h2 id="classes-heading" style={{ color: '#2563EB', margin: 0 }}>Classes & Schedule</h2>
          <p style={{ marginTop: 6, color: '#4B5563' }}>Upcoming sessions and weekly timings.</p>
        </div>

        <label htmlFor="style-filter" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#374151' }}>Filter:</span>
          <select
            id="style-filter"
            aria-label="Filter classes by dance style"
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              color: '#111827',
              background: '#fff',
              outlineColor: '#2563EB',
            }}
          >
            {styles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <div
        role="list"
        aria-label="Class schedule"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        {filtered.map((c) => (
          <article
            key={c.id}
            role="listitem"
            style={{
              border: '1px solid #E5E7EB',
              borderRadius: 12,
              padding: '1rem',
              background: 'linear-gradient(180deg, rgba(245,158,11,0.07) 0%, #fff 100%)',
            }}
          >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <h3 style={{ margin: 0, color: '#111827', fontSize: '1.05rem' }}>
                {c.style} — <span style={{ color: '#2563EB' }}>{c.level}</span>
              </h3>
              <span style={{ color: '#F59E0B', fontWeight: 600, fontSize: '0.9rem' }}>{c.mode}</span>
            </header>
            <dl style={{ margin: 0, color: '#374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <dt style={{ fontWeight: 600 }}>Day</dt>
                <dd style={{ margin: 0 }}>{c.day}</dd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <dt style={{ fontWeight: 600 }}>Time</dt>
                <dd style={{ margin: 0 }}>{c.time}</dd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <dt style={{ fontWeight: 600 }}>Location</dt>
                <dd style={{ margin: 0 }}>{c.location}</dd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <dt style={{ fontWeight: 600 }}>Instructor</dt>
                <dd style={{ margin: 0 }}>{c.instructor}</dd>
              </div>
            </dl>
            {c.notes && <p style={{ marginTop: 8, color: '#4B5563' }}>{c.notes}</p>}
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                aria-label={`Request booking for ${c.style} ${c.level} on ${c.day} at ${c.time}`}
                onClick={() => alert('Booking flow coming soon')}
                style={{
                  background: '#2563EB',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 0.9rem',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  boxShadow: '0 1px 2px rgba(37,99,235,0.25)',
                }}
              >
                Request Booking
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
