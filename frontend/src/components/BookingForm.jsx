import React, { useEffect, useMemo, useState } from 'react';
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
export default function BookingForm({ defaultValues = {}, selectedOption = null }) {
  // Compute today's date in local timezone as yyyy-mm-dd for input[type="date"].
  // We normalize by zeroing local time components, not using UTC, to avoid timezone shifts that could allow a past date.
  const getTodayLocalYMD = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const [form, setForm] = useState(() => {
    const today = getTodayLocalYMD();
    const initial = {
      name: '',
      email: '',
      phone: '',
      message: '',
      preferredDate: '',
      ...(defaultValues || {}),
      // honeypot not part of external defaultValues
      company: '',
    };
    // Default to today if empty or invalid
    if (!initial.preferredDate) {
      initial.preferredDate = today;
    } else {
      // Normalize if provided default is in the past
      try {
        if (initial.preferredDate < today) {
          initial.preferredDate = today;
        }
      } catch {
        initial.preferredDate = today;
      }
    }
    return initial;
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [statusMsg, setStatusMsg] = useState('');

  // Keep a reactive min date so if the user keeps the page open overnight the min updates.
  const [minDate, setMinDate] = useState(getTodayLocalYMD());
  useEffect(() => {
    const update = () => setMinDate(getTodayLocalYMD());
    // Update at midnight local time
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0).getTime() - now.getTime();
    const t1 = setTimeout(() => {
      update();
      // After first midnight, update every 24h
      const t2 = setInterval(update, 24 * 60 * 60 * 1000);
      // Store interval id on window to be cleared on unmount via clearInterval inside cleanup
      // but we can just return a function from setTimeout scope; instead track it in closure:
      (update)._interval = t2;
    }, Math.max(1000, msUntilMidnight)); // ensure at least 1s
    return () => {
      clearTimeout(t1);
      if ((update)._interval) clearInterval((update)._interval);
    };
  }, []);

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
    // Past date guard
    if (form.preferredDate) {
      // Compare as yyyy-mm-dd strings which are lexicographically sortable
      if (form.preferredDate < (minDate || '')) {
        errs.preferredDate = 'Please choose today or a future date.';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    // If changing the date, enforce min and auto-correct
    if (name === 'preferredDate') {
      const today = minDate;
      const next = value && value < today ? today : value || today;
      setForm((prev) => ({ ...prev, [name]: next }));
      // Clear or set errors accordingly
      setErrors((prev) => {
        const ne = { ...prev };
        if (next < today) {
          ne.preferredDate = 'Please choose today or a future date.';
        } else {
          delete ne.preferredDate;
        }
        return ne;
      });
      return;
    }
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
      selectedOption: selectedOption
        ? {
            id: selectedOption.id,
            style: selectedOption.style,
            level: selectedOption.level,
            day: selectedOption.day,
            time: selectedOption.time,
            duration: selectedOption.duration,
            mode: selectedOption.mode,
            location: selectedOption.location,
            instructor: selectedOption.instructor,
          }
        : null,
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
      // reset form (default preferredDate to today)
      setForm((prev) => ({
        name: '',
        email: '',
        phone: '',
        message: '',
        preferredDate: minDate,
        company: '',
      }));
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
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <h3
        id="booking-form-heading"
        style={{ gridColumn: '1 / -1', marginTop: 0, color: 'var(--primary)' }}
      >
        Request a Booking
      </h3>

      {selectedOption && (
        <div
          role="group"
          aria-label="Selected class details"
          style={{
            gridColumn: '1 / -1',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '0.4rem 0.75rem',
            padding: '0.75rem',
            border: '1px dashed var(--border)',
            borderRadius: 8,
            background: 'linear-gradient(180deg, rgba(245,158,11,0.07) 0%, var(--surface) 100%)',
            color: 'var(--text)',
            marginBottom: '0.25rem',
          }}
        >
          <div style={{ fontWeight: 700, gridColumn: '1 / -1', color: 'var(--secondary)' }}>
            You’re booking:
          </div>
          <span style={{ color: 'var(--muted)' }}>Style</span>
          <span>{selectedOption.style}</span>
          <span style={{ color: 'var(--muted)' }}>Level</span>
          <span>{selectedOption.level}</span>
          <span style={{ color: 'var(--muted)' }}>Day</span>
          <span>{selectedOption.day}</span>
          <span style={{ color: 'var(--muted)' }}>Time</span>
          <span>{selectedOption.time}</span>
          <span style={{ color: 'var(--muted)' }}>Duration</span>
          <span>{selectedOption.duration}</span>
        </div>
      )}

      {/* Name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label htmlFor="bf-name" style={{ color: 'var(--muted)', fontWeight: 600 }}>
          Name<span aria-hidden="true" style={{ color: 'var(--error)' }}> *</span>
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
        <label htmlFor="bf-email" style={{ color: 'var(--muted)', fontWeight: 600 }}>
          Email<span aria-hidden="true" style={{ color: 'var(--error)' }}> *</span>
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
        <label htmlFor="bf-phone" style={{ color: 'var(--muted)', fontWeight: 600 }}>
          Phone<span aria-hidden="true" style={{ color: 'var(--error)' }}> *</span>
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
        <label htmlFor="bf-date" style={{ color: 'var(--muted)', fontWeight: 600 }}>
          Preferred Date<span aria-hidden="true" style={{ color: 'var(--error)' }}> *</span>
        </label>
        <input
          id="bf-date"
          name="preferredDate"
          type="date"
          value={form.preferredDate}
          onChange={onChange}
          min={minDate}
          aria-invalid={!!errors.preferredDate}
          aria-describedby={errors.preferredDate ? 'bf-date-err' : 'bf-date-help'}
          required
          style={inputStyle}
        />
        {!errors.preferredDate && (
          <span id="bf-date-help" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
            Date cannot be in the past.
          </span>
        )}
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
          style={{ color: 'var(--muted)', fontWeight: 600 }}
        >
          Message<span aria-hidden="true" style={{ color: 'var(--error)' }}> *</span>
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
            background: 'var(--primary)',
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
          style={{ minHeight: 20, color: status === 'error' ? 'var(--error)' : 'var(--primary)' }}
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
          form[aria-labelledby="booking-form-heading"] * {
            box-sizing: border-box;
            max-width: 100%;
          }
        `}
      </style>
    </form>
  );
}

const inputStyle = {
  padding: '0.55rem 0.75rem',
  borderRadius: 8,
  border: '1px solid var(--border)',
  outlineColor: 'var(--primary)',
  color: 'var(--text)',
  background: 'var(--surface)',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
};

const errorStyle = {
  color: 'var(--error)',
  fontSize: '0.9rem',
};
