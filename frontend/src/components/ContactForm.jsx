import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from './Alert';
import { ContactSchema } from '../utils/validators';

// PUBLIC_INTERFACE
export default function ContactForm({ onSubmit, submitting = false, serverError, serverSuccess }) {
  /** Contact form with validation. */
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ContactSchema)
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
        <div className="grid-2" style={{ gridColumn: '1 / -1' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="subject">Subject</label>
            <input id="subject" {...register('subject')} required />
            {errors.subject && <span className="text-muted">{errors.subject.message}</span>}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="message">Message</label>
            <textarea id="message" rows={5} {...register('message')} required />
            {errors.message && <span className="text-muted">{errors.message.message}</span>}
          </div>
        </div>
      </div>

      <div className="u-mt-4" style={{ display: 'flex', gap: '.75rem' }}>
        <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send Message'}</button>
        <button className="btn btn-ghost" type="reset">Reset</button>
      </div>

      <div className="u-mt-4">
        {serverError && <Alert type="error" title="Error" message={serverError} />}
        {serverSuccess && <Alert type="success" title="Success" message={serverSuccess} />}
      </div>
    </form>
  );
}
