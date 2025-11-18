import { getApiClient } from './apiClient';
import { useEnv } from '../utils/env';

// PUBLIC_INTERFACE
export async function healthCheck() {
  /** Check backend health endpoint. */
  const client = getApiClient();
  const { HEALTH_PATH } = useEnv();
  const { data } = await client.get(HEALTH_PATH || '/healthz');
  return data;
}
