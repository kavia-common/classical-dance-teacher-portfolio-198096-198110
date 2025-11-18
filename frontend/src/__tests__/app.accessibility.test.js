import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../App';
import { ThemeProvider } from '../providers/ThemeContext';

test('has skip to content link and main landmark', async () => {
  render(
    <HelmetProvider>
      <MemoryRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </HelmetProvider>
  );

  // Skip link should exist
  expect(screen.getByText(/Skip to content/i)).toHaveAttribute('href', '#main-content');

  // Main landmark exists
  const main = screen.getByRole('main');
  expect(main).toBeInTheDocument();

  // Navbar has "Main navigation" label
  expect(screen.getByRole('navigation', { name: /Main navigation/i })).toBeInTheDocument();

  // Footer contentinfo landmark
  expect(screen.getByRole('contentinfo')).toBeInTheDocument();
});
