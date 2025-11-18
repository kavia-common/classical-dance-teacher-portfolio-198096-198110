import { z } from 'zod';

const EnvSchema = z.object({
  REACT_APP_API_BASE: z.string().optional(),
  REACT_APP_BACKEND_URL: z.string().optional(),
  REACT_APP_FRONTEND_URL: z.string().optional(),
  REACT_APP_WS_URL: z.string().optional(),
  REACT_APP_HEALTHCHECK_PATH: z.string().optional().default('/healthz'),
  REACT_APP_FEATURE_FLAGS: z.string().optional(),
  REACT_APP_EXPERIMENTS_ENABLED: z.string().optional(),
  REACT_APP_LOG_LEVEL: z.string().optional().default('info'),
  REACT_APP_NODE_ENV: z.string().optional().default(process.env.NODE_ENV || 'development'),
});

const raw = {
  REACT_APP_API_BASE: process.env.REACT_APP_API_BASE,
  REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
  REACT_APP_FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || window.location.origin,
  REACT_APP_WS_URL: process.env.REACT_APP_WS_URL,
  REACT_APP_HEALTHCHECK_PATH: process.env.REACT_APP_HEALTHCHECK_PATH,
  REACT_APP_FEATURE_FLAGS: process.env.REACT_APP_FEATURE_FLAGS,
  REACT_APP_EXPERIMENTS_ENABLED: process.env.REACT_APP_EXPERIMENTS_ENABLED,
  REACT_APP_LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL,
  REACT_APP_NODE_ENV: process.env.REACT_APP_NODE_ENV,
};

const parsed = EnvSchema.safeParse(raw);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.warn('Environment validation failed:', parsed.error.flatten());
}

const env = parsed.success ? parsed.data : raw;

function parseFlags(s) {
  if (!s) return {};
  try {
    return JSON.parse(s);
  } catch {
    // parse comma-separated flags like "newGallery:true,ab:false"
    return s.split(',').reduce((acc, part) => {
      const [k, v] = part.split(':').map((p) => p.trim());
      if (k) acc[k] = v === 'true' ? true : v === 'false' ? false : v;
      return acc;
    }, {});
  }
}

// PUBLIC_INTERFACE
export function useEnv() {
  /** Hook to access validated environment configuration. */
  const API_BASE = env.REACT_APP_API_BASE || env.REACT_APP_BACKEND_URL || '';
  const FRONTEND_URL = env.REACT_APP_FRONTEND_URL || '';
  const WS_URL = env.REACT_APP_WS_URL || '';
  const HEALTH_PATH = env.REACT_APP_HEALTHCHECK_PATH || '/healthz';
  const LOG_LEVEL = env.REACT_APP_LOG_LEVEL || 'info';
  const NODE_ENV = env.REACT_APP_NODE_ENV || 'development';
  const FLAGS = parseFlags(env.REACT_APP_FEATURE_FLAGS);
  const EXPERIMENTS = (env.REACT_APP_EXPERIMENTS_ENABLED || 'false') === 'true';

  return {
    API_BASE,
    FRONTEND_URL,
    WS_URL,
    HEALTH_PATH,
    LOG_LEVEL,
    NODE_ENV,
    FLAGS,
    EXPERIMENTS,
  };
}
