import axios from 'axios';
import { getApiClient } from '../services/apiClient';

test('handlers respond for classes, schedule, bookings, availability, gallery', async () => {
  const client = getApiClient();

  const classes = await client.get('/api/classes');
  expect(Array.isArray(classes.data.classes)).toBe(true);

  const schedule = await client.get('/api/schedule');
  expect(Array.isArray(schedule.data.schedule)).toBe(true);

  const bookings = await client.get('/api/bookings');
  expect(Array.isArray(bookings.data.bookings)).toBe(true);

  const availability = await client.get('/api/availability', { params: { date: '2025-01-01', classType: 'beginner' } });
  expect(availability.data).toHaveProperty('slots');

  const gallery = await client.get('/api/gallery');
  expect(Array.isArray(gallery.data.images)).toBe(true);
});
