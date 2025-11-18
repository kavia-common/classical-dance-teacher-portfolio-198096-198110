import React, { useCallback, useState } from 'react';
import ContactForm from '../components/ContactForm';
import { sendContact } from '../services/contactService';
import { useApi } from '../hooks/useApi';
import SEO from '../components/SEO';

// PUBLIC_INTERFACE
export default function Contact() {
  /** Contact page with form. */
  const { call, loading, error } = useApi(sendContact);
  const [success, setSuccess] = useState('');

  const onSubmit = useCallback(async (payload) => {
    setSuccess('');
    try {
      await call(payload);
      setSuccess('Message sent. Thank you for reaching out!');
    } catch {}
  }, [call]);

  return (
    <>
      <SEO title="Contact" />
      <ContactForm
        onSubmit={onSubmit}
        submitting={loading}
        serverError={error}
        serverSuccess={success}
      />
    </>
  );
}
