import { useEnv } from '../utils/env';

// PUBLIC_INTERFACE
export function useFeatureFlags() {
  /** Returns feature flags and experiment toggle from env. */
  const { FLAGS, EXPERIMENTS } = useEnv();
  return { flags: FLAGS, experimentsEnabled: EXPERIMENTS, isEnabled: (k) => !!FLAGS[k] };
}
