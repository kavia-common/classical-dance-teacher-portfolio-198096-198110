import { fetchGallery } from '../services/galleryService';

test('fetchGallery returns images array from API', async () => {
  const images = await fetchGallery();
  expect(Array.isArray(images)).toBe(true);
  expect(images.length).toBeGreaterThan(0);
  expect(images[0]).toHaveProperty('src');
  expect(images[0]).toHaveProperty('alt');
});
