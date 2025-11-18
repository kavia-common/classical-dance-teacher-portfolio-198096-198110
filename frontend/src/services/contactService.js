import { getApiClient } from './apiClient';

// PUBLIC_INTERFACE
export async function sendContact(payload) {
  /** Send contact message via backend. */
  const client = getApiClient();
  const { data } = await client.post('/api/contact', payload);
  return data;
}
