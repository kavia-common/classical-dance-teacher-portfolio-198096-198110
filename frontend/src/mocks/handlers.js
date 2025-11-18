import { http, HttpResponse } from 'msw';

/**
 * MSW handlers for API endpoints used in the app.
 * These are used only in tests (via setupTests.js) to provide deterministic responses.
 */
const classesData = [
  { id: 1, title: 'Beginner', level: 'Foundation', description: 'Basics of posture, rhythm, and steps.' },
  { id: 2, title: 'Intermediate', level: 'Technique', description: 'Complex sequences and expressions.' },
  { id: 3, title: 'Advanced', level: 'Performance', description: 'Choreography and stage presence.' },
];

const scheduleData = [
  { day: 'Mon', time: '6:00 PM', class: 'Beginner' },
  { day: 'Wed', time: '6:00 PM', class: 'Intermediate' },
  { day: 'Fri', time: '6:30 PM', class: 'Advanced' },
];

const galleryData = {
  images: Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    alt: `Performance ${i + 1}`,
    src: `https://picsum.photos/seed/dance-msw-${i}/600/400`,
  })),
};

export const handlers = [
  // Health endpoint (uses env path in healthService; we also cover common defaults)
  http.get('/healthz', () => HttpResponse.json({ status: 'ok' })),
  http.get('/health', () => HttpResponse.json({ status: 'ok' })),

  // Classes, schedule, bookings (read)
  http.get('/api/classes', () => HttpResponse.json({ classes: classesData })),
  http.get('/api/schedule', () => HttpResponse.json({ schedule: scheduleData })),
  http.get('/api/bookings', () => HttpResponse.json({ bookings: [] })),

  // Availability (query by date/classType)
  http.get('/api/availability', ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get('date') || '2025-01-01';
    const classType = url.searchParams.get('classType') || 'beginner';
    return HttpResponse.json({
      date,
      classType,
      slots: ['18:00', '19:00'],
    });
  }),

  // Booking create
  http.post('/api/booking', async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    if (!body?.name || !body?.email) {
      return HttpResponse.json({ message: 'Invalid booking' }, { status: 400 });
    }
    return HttpResponse.json({ id: Date.now(), ...body }, { status: 201 });
  }),

  // Contact submit
  http.post('/api/contact', async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    if (!body?.name || !body?.email || !body?.subject || !body?.message) {
      return HttpResponse.json({ message: 'Invalid contact' }, { status: 400 });
    }
    return HttpResponse.json({ ok: true });
  }),

  // Gallery
  http.get('/api/gallery', () => HttpResponse.json(galleryData)),
];

export default handlers;
