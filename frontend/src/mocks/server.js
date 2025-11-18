import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * Test server for MSW using Node adapter (JSDOM environment).
 * This is imported by setupTests to start/stop the server automatically.
 */
export const server = setupServer(...handlers);
