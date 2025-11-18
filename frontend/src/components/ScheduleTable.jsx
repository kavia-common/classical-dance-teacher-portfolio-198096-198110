import React from 'react';

// PUBLIC_INTERFACE
export default function ScheduleTable({ schedule = [] }) {
  /** Class schedule displayed in a table. */
  if (!schedule.length) {
    schedule = [
      { day: 'Mon', time: '6:00 PM', class: 'Beginner' },
      { day: 'Wed', time: '6:00 PM', class: 'Intermediate' },
      { day: 'Fri', time: '6:30 PM', class: 'Advanced' },
    ];
  }
  return (
    <div className="card u-p-6" role="region" aria-label="Weekly schedule">
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            <th align="left">Day</th>
            <th align="left">Time</th>
            <th align="left">Class</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((s, idx) => (
            <tr key={`${s.day}-${idx}`}>
              <td>{s.day}</td>
              <td>{s.time}</td>
              <td>{s.class}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
