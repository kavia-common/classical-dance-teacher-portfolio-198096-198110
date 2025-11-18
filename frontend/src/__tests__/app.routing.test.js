import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../App';
import { ThemeProvider } from '../providers/ThemeContext';

function renderWithProviders(route = '/') {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
}

test('navigates to home route', async () => {
  renderWithProviders('/');
  expect(await screen.findByText(/Grace in Motion/i)).toBeInTheDocument();
});

test('renders About route', async () => {
  renderWithProviders('/about');
  expect(await screen.findByRole('heading', { name: /About the Teacher/i })).toBeInTheDocument();
});

test('renders Gallery route and loads images', async () => {
  renderWithProviders('/gallery');
  expect(await screen.findByText(/Gallery/i)).toBeInTheDocument();
  // The Gallery page shows grid with images; at least one figure caption should appear
  expect(await screen.findAllByText(/Performance/i)).toHaveLength(6);
});

test('renders Classes route with Schedule and Booking form', async () => {
  renderWithProviders('/classes');
  expect(await screen.findByText(/Classes & Schedule/i)).toBeInTheDocument();
  expect(await screen.findByRole('region', { name: /Weekly schedule/i })).toBeInTheDocument();
  expect(await screen.findByRole('button', { name: /Book Class/i })).toBeInTheDocument();
});

test('renders Contact route', async () => {
  renderWithProviders('/contact');
  expect(await screen.findByRole('button', { name: /Send Message/i })).toBeInTheDocument();
});

test('renders NotFound for unknown route', async () => {
  renderWithProviders('/does-not-exist');
  expect(await screen.findByRole('heading', { name: /Page Not Found/i })).toBeInTheDocument();
});
