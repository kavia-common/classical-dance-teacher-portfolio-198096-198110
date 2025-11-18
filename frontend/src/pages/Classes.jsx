import React, { useCallback, useState } from 'react';
import ClassCard from '../components/ClassCard';
import ScheduleTable from '../components/ScheduleTable';
import BookingForm from '../components/BookingForm';
import { createBooking } from '../services/bookingService';
import { useApi } from '../hooks/useApi';
import SEO from '../components/SEO';

// PUBLIC_INTERFACE
export default function Classes() {
  /** Classes & schedule page with booking form. */
  const classes = [
    { title: 'Beginner', level: 'Foundation', description: 'Basics of posture, rhythm, and steps.' },
    { title: 'Intermediate', level: 'Technique', description: 'Complex sequences and expressions.' },
    { title: 'Advanced', level: 'Performance', description: 'Choreography and stage presence.' },
  ];

  const { call, loading, error } = useApi(createBooking);
  const [success, setSuccess] = useState('');

  const onBook = useCallback(async (payload) => {
    setSuccess('');
    try {
      await call(payload);
      setSuccess('Booking received. We will contact you shortly.');
    } catch {}
  }, [call]);

  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      <SEO title="Classes & Schedule" />
      <div className="grid grid-3">
        {classes.map((c) => (
          <ClassCard key={c.title} {...c} onBook={() => {}} />
        ))}
      </div>
      <ScheduleTable />
      <BookingForm
        onSubmit={onBook}
        submitting={loading}
        serverError={error}
        serverSuccess={success}
      />
    </div>
  );
}
