import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from './Alert';
import { BookingSchema } from '../utils/validators';

// PUBLIC_INTERFACE
export default function BookingForm({ onSubmit, submitting = false, serverError, serverSuccess }) {
  /** Booking form with validation. */
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(BookingSchema)
  });

  return (
    <form className="card u-p-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-2">
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" {...register('name')} required />
          {errors.name && <span className="text-muted">{errors.name.message}</span>}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register('email')} required />
          {errors.email && <span className="text-muted">{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" type="tel" {...register('phone')} />
          {errors.phone && <span className="text-muted">{errors.phone.message}</span>}
        </div>
        <div>
          <label htmlFor="classType">Class</label>
          <select id="classType" {...register('classType')} required>
            <option value="">Select a class</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          {errors.classType && <span className="text-muted">{errors.classType.message}</span>}
        </div>
        <div>
          <label htmlFor="date">Preferred Date</label>
          <input id="date" type="date" {...register('date')} required />
          {errors.date && <span className="text-muted">{errors.date.message}</span>}
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea id="message" rows={4} {...register('message')} />
          {errors.message && <span className="text-muted">{errors.message.message}</span>}
        </div>
      </div>

      <div className="u-mt-4" style={{ display: 'flex', gap: '.75rem' }}>
        <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Booking...' : 'Book Class'}</button>
        <button className="btn btn-ghost" type="reset">Reset</button>
      </div>

      <div className="u-mt-4">
        {serverError && <Alert type="error" title="Error" message={serverError} />}
        {serverSuccess && <Alert type="success" title="Success" message={serverSuccess} />}
      </div>
    </form>
  );
}
