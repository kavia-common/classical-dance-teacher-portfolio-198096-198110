import React, { useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Bharatanatyam Classes & Schedule component.
 * Displays Bharatanatyam-only offerings with levels, kids batch, and weekend workshops.
 * Uses mock static data, Ocean Professional styling, and is accessible/responsive.
 */
export default function ClassesSchedule({ data }) {
  // Bharatanatyam-only mock schedule with realistic placeholders
  const mock = useMemo(
    () =>
      data || [
        {
          id: 'bn-beginner-sat',
          style: 'Bharatanatyam',
          level: 'Beginner',
          day: 'Saturday',
          time: '10:00 AM – 11:30 AM',
          duration: '90 mins',
          mode: 'In-person',
          location: 'Studio A',
          instructor: 'Guru Lakshmi',
          notes: 'Foundations: adavus, basic mudras, posture, rhythm alignment.',
        },
        {
          id: 'bn-kids-sun',
          style: 'Bharatanatyam',
          level: 'Kids Batch (7–12 yrs)',
          day: 'Sunday',
          time: '9:00 AM – 10:00 AM',
          duration: '60 mins',
          mode: 'In-person',
          location: 'Studio B',
          instructor: 'Assistant Teacher',
          notes: 'Playful learning: simple adavus, storytelling, and rhythm games.',
        },
        {
          id: 'bn-intermediate-wed',
          style: 'Bharatanatyam',
          level: 'Intermediate',
          day: 'Wednesday',
          time: '6:00 PM – 7:30 PM',
          duration: '90 mins',
          mode: 'Hybrid',
          location: 'Studio A + Zoom',
          instructor: 'Guru Lakshmi',
          notes: 'Varnam practice, jatis, abhinaya depth, stamina building.',
        },
        {
          id: 'bn-advanced-fri',
          style: 'Bharatanatyam',
          level: 'Advanced',
          day: 'Friday',
          time: '5:30 PM – 7:30 PM',
          duration: '120 mins',
          mode: 'In-person',
          location: 'Studio A',
          instructor: 'Guru Lakshmi',
          notes: 'Advanced repertoire, complex talas, performance polish.',
        },
        {
          id: 'bn-workshop-weekend',
          style: 'Bharatanatyam',
          level: 'Weekend Workshop',
          day: '1st Saturday',
          time: '2:00 PM – 4:00 PM',
          duration: '120 mins',
          mode: 'In-person',
          location: 'Studio A',
          instructor: 'Guest Artist',
          notes: 'Monthly theme-based workshop: choreography, nritta nuances, or abhinaya labs.',
        },
      ],
    [data]
  );

  // Bharatanatyam-only: filter by level instead of style
  const levels = ['All Levels', ...Array.from(new Set(mock.map((m) => m.level)))];
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

  const filtered = useMemo(
    () => (selectedLevel === 'All Levels' ? mock : mock.filter((m) => m.level === selectedLevel)),
    [mock, selectedLevel]
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
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2 id="classes-heading" style={{ color: '#2563EB', margin: 0 }}>
            Bharatanatyam Classes & Schedule
          </h2>
          <p style={{ marginTop: 6, color: '#4B5563' }}>
            Weekly sessions, kids batch, and weekend workshops. All timings are local.
          </p>
        </div>

        <label htmlFor="level-filter" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#374151' }}>Filter by Level:</span>
          <select
            id="level-filter"
            aria-label="Filter Bharatanatyam classes by level"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              color: '#111827',
              background: '#fff',
              outlineColor: '#2563EB',
            }}
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        role="list"
        aria-label="Bharatanatyam class schedule"
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
                Bharatanatyam — <span style={{ color: '#2563EB' }}>{c.level}</span>
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
                <dt style={{ fontWeight: 600 }}>Duration</dt>
                <dd style={{ margin: 0 }}>{c.duration}</dd>
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
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <span aria-hidden="true" style={{ color: '#6B7280', fontSize: '0.85rem' }}>
                Limited seats. Pre-booking recommended.
              </span>
              <button
                type="button"
                aria-label={`Request booking for Bharatanatyam ${c.level} on ${c.day} at ${c.time}`}
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
