import React from 'react';

// PUBLIC_INTERFACE
export default function Achievements() {
  /** Highlighted achievements section. */
  const items = [
    { title: '20+ Years Teaching', desc: 'Experience guiding students at all levels.' },
    { title: 'International Performances', desc: 'Stages across 10+ countries.' },
    { title: 'Award-Winning', desc: 'Recognized for excellence in classical dance.' },
  ];
  return (
    <div className="grid grid-3">
      {items.map((it) => (
        <article key={it.title} className="card u-p-6">
          <h3 style={{ margin: 0 }}>{it.title}</h3>
          <p className="text-muted">{it.desc}</p>
        </article>
      ))}
    </div>
  );
}
