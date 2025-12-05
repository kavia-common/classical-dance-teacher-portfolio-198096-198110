import React, { useMemo, useState } from 'react';
import { apiFetch } from '../utils/api';

// PUBLIC_INTERFACE
/**
 * BookingForm: Public booking/contact form that submits to POST /api/bookings.
 * - Validates required fields: name, email, phone, message, preferredDate
 * - Uses environment-based API base via apiFetch
 * - Avoids admin token headers (public endpoint)
 * - Accessibility: labels, aria-invalid, aria-describedby, aria-live status
 * - Honeypot field to deter bots
 */
export default function BookingForm({ defaultValues = {} }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredDate: '',
    ...(defaultValues || {}),
    // honeypot not part of external defaultValues
    company: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [statusMsg, setStatusMsg] = useState('');

  const requiredFields = useMemo(
    () => ['name', 'email', 'phone', 'message', 'preferredDate'],
    []
  );

  const validate = () => {
    const errs = {};
    requiredFields.forEach((k) => {
      if (!String(form[k] || '').trim()) {
        errs[k] = 'This field is required.';
      }
    });
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (form.phone && !/^[\d+()\-\s]{7,}$/.test(form.phone)) {
      errs.phone = 'Please enter a valid phone.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // PUBLIC_INTERFACE
  /** Submit booking to backend; returns true on success. */
  const submitBooking = async () => {
    // If honeypot is filled, silently treat as success but do not submit
    if (form.company && form.company.trim().length > 0) {
      return true;
    }
    // Build payload explicitly without admin headers
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
      preferredDate: form.preferredDate,
    };
    await apiFetch('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // No admin token header
      body: JSON.stringify(payload),
    });
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('idle');
    setStatusMsg('');
    if (!validate()) {
      setStatus('error');
      setStatusMsg('Please correct the highlighted fields.');
      return;
    }
    try {
      setStatus('submitting');
      await submitBooking();
      setStatus('success');
      setStatusMsg('Thank you! Your booking request has been sent.');
      // reset form (keep preferredDate empty)
      setForm({
        name: '',
        email: '',
        phone: '',
        message: '',
        preferredDate: '',
        company: '',
      });
      setErrors({});
    } catch (err) {
      setStatus('error');
      setStatusMsg(err?.message || 'Failed to send booking. Please try again.');
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="booking-form-heading"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
      }}
    >
      <h3
        id="booking-form-heading"
        style={{ gridColumn: '1 / -1', marginTop: 0, color: '#2563EB' }}
      >
        Request a Booking
      </h3>

      {/* Name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label htmlFor="bf-name" style={{ color: '#374151', fontWeight: 600 }}>
          Name<span aria-hidden="true" style={{ color: '#EF4444' }}> *</span>
        </label>
        <input
          id="bf-name"
          name="name"
          type="text"
          value={form.name}
          onChange={onChange}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'bf-name-err' : undefined}
          placeholder="Your full name"
          required
          style={inputStyle}
        />
        {errors.name && (
          <span id="bf-name-err" role="alert" style={errorStyle}>
            {errors.name}
          </span>
        )}
      </div>

      {/* Email */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label htmlFor="bf-email" style={{ color: '#374151', fontWeight: 600 }}>
          Email<span aria-hidden="true" style={{ color: '#EF4444' }}> *</span>
        </label>
        <input
          id="bf-email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'bf-email-err' : undefined}
          placeholder="you@example.com"
          required
          style={inputStyle}
        />
        {errors.email && (
          <span id="bf-email-err" role="alert" style={errorStyle}>
            {errors.email}
          </span>
        )}
      </div>

      {/* Phone */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label htmlFor="bf-phone" style={{ color: '#374151', fontWeight: 600 }}>
          Phone<span aria-hidden="true" style={{ color: '#EF4444' }}> *</span>
        </label>
        <input
          id="bf-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={onChange}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'bf-phone-err' : undefined}
          placeholder="+1 234 567 8901"
          required
          style={inputStyle}
        />
        {errors.phone && (
          <span id="bf-phone-err" role="alert" style={errorStyle}>
            {errors.phone}
          </span>
        )}
      </div>

      {/* Preferred Date */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label htmlFor="bf-date" style={{ color: '#374151', fontWeight: 600 }}>
          Preferred Date<span aria-hidden="true" style={{ color: '#EF4444' }}> *</span>
        </label>
        <input
          id="bf-date"
          name="preferredDate"
          type="date"
          value={form.preferredDate}
          onChange={onChange}
          aria-invalid={!!errors.preferredDate}
          aria-describedby={errors.preferredDate ? 'bf-date-err' : undefined}
          required
          style={inputStyle}
        />
        {errors.preferredDate && (
          <span id="bf-date-err" role="alert" style={errorStyle}>
            {errors.preferredDate}
          </span>
        )}
      </div>

      {/* Message */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
        <label
          htmlFor="bf-message"
          style={{ color: '#374151', fontWeight: 600 }}
        >
          Message<span aria-hidden="true" style={{ color: '#EF4444' }}> *</span>
        </label>
        <textarea
          id="bf-message"
          name="message"
          value={form.message}
          onChange={onChange}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'bf-message-err' : undefined}
          placeholder="Tell us about your request..."
          required
          rows={4}
          style={{
            ...inputStyle,
            resize: 'vertical',
          }}
        />
        {errors.message && (
          <span id="bf-message-err" role="alert" style={errorStyle}>
            {errors.message}
          </span>
        )}
      </div>

      {/* Honeypot (visually hidden but accessible name suggests company) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
      >
        <label htmlFor="bf-company">Company</label>
        <input
          id="bf-company"
          name="company"
          type="text"
          value={form.company}
          onChange={onChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Actions and Status */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <button
          type="submit"
          disabled={status === 'submitting'}
          style={{
            background: '#2563EB',
            color: '#fff',
            border: 'none',
            padding: '0.6rem 1rem',
            borderRadius: 8,
            cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            boxShadow: '0 1px 2px rgba(37,99,235,0.25)',
          }}
        >
          {status === 'submitting' ? 'Sending…' : 'Send Booking Request'}
        </button>

        <div
          aria-live="polite"
          aria-atomic="true"
          style={{ minHeight: 20, color: status === 'error' ? '#EF4444' : '#2563EB' }}
        >
          {statusMsg}
        </div>
      </div>

      <style>
        {`
          @media (max-width: 640px) {
            form[aria-labelledby="booking-form-heading"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </form>
  );
}

const inputStyle = {
  padding: '0.55rem 0.75rem',
  borderRadius: 8,
  border: '1px solid #E5E7EB',
  outlineColor: '#2563EB',
  color: '#111827',
  background: '#fff',
};

const errorStyle = {
  color: '#EF4444',
  fontSize: '0.9rem',
};
