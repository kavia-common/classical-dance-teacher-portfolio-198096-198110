const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3010;

// PUBLIC_INTERFACE
/**
 * Entry point for Dance Portfolio Backend API.
 * - Listens on 0.0.0.0:${port}
 * - CORS enabled for all origins (adjust for production)
 */
app.use(cors());
app.use(express.json());

// Health check, can be expanded.
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Add additional API routes here.

app.listen(port, '0.0.0.0', () => {
  console.log(`Dance Portfolio Backend listening on http://0.0.0.0:${port}`);
});
