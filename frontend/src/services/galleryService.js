import { getApiClient } from './apiClient';

// PUBLIC_INTERFACE
export async function fetchGallery() {
  /** Fetch gallery images from backend. */
  const client = getApiClient();
  const { data } = await client.get('/api/gallery');
  return data?.images || [];
}
