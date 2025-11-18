import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './providers/ThemeContext';

test('renders navbar brand', () => {
  render(
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
  const brand = screen.getByText(/Classical/i);
  expect(brand).toBeInTheDocument();
});
