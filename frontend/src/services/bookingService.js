import { getApiClient } from './apiClient';

// PUBLIC_INTERFACE
export async function createBooking(payload) {
  /** Create booking via backend. */
  const client = getApiClient();
  const { data } = await client.post('/api/booking', payload);
  return data;
}
