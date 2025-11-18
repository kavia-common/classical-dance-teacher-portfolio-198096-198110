import { getApiClient } from '../services/apiClient';
import { healthCheck } from '../services/healthService';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

// Helper to reset cached axios instance between tests by clearing the module cache
function resetApiClientCache() {
  jest.resetModules();
}

describe('apiClient baseURL env resolution', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('uses REACT_APP_API_BASE when set', () => {
    process.env.REACT_APP_API_BASE = 'https://api.example.com';
    process.env.REACT_APP_BACKEND_URL = 'https://fallback.example.com';

    // Must re-import to re-evaluate env
    const { getApiClient: freshGetApiClient } = require('../services/apiClient');
    const client = freshGetApiClient();
    expect(client.defaults.baseURL).toBe('https://api.example.com');
  });

  test('falls back to REACT_APP_BACKEND_URL when API_BASE not set', () => {
    delete process.env.REACT_APP_API_BASE;
    process.env.REACT_APP_BACKEND_URL = 'https://fallback.example.com';

    const { getApiClient: freshGetApiClient } = require('../services/apiClient');
    const client = freshGetApiClient();
    expect(client.defaults.baseURL).toBe('https://fallback.example.com');
  });

  test('defaults to "/" when neither is set', () => {
    delete process.env.REACT_APP_API_BASE;
    delete process.env.REACT_APP_BACKEND_URL;

    const { getApiClient: freshGetApiClient } = require('../services/apiClient');
    const client = freshGetApiClient();
    expect(client.defaults.baseURL).toBe('/');
  });
});

describe('healthService uses env path or default', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('uses default /healthz when REACT_APP_HEALTHCHECK_PATH not set', async () => {
    delete process.env.REACT_APP_HEALTHCHECK_PATH;

    // ensure we have a handler at /healthz (configured in handlers.js)
    const result = await healthCheck();
    expect(result).toEqual({ status: 'ok' });
  });

  test('uses custom REACT_APP_HEALTHCHECK_PATH when provided', async () => {
    process.env.REACT_APP_HEALTHCHECK_PATH = '/health';

    // Override handler to ensure call goes to /health
    server.use(
      http.get('/health', () => HttpResponse.json({ status: 'ok-custom' }))
    );

    const result = await healthCheck();
    expect(result).toEqual({ status: 'ok-custom' });
  });
});
