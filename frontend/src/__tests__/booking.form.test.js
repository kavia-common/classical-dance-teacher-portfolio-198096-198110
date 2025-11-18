import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../App';
import { ThemeProvider } from '../providers/ThemeContext';

async function goToClasses() {
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/classes']}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
}

test('submits booking form successfully', async () => {
  const user = userEvent.setup();
  await goToClasses();

  // Fill the form
  await user.type(screen.getByLabelText(/Name/i), 'Alice Example');
  await user.type(screen.getByLabelText(/^Email$/i), 'alice@example.com');
  await user.type(screen.getByLabelText(/Phone/i), '1234567890');
  await user.selectOptions(screen.getByLabelText(/Class/i), 'beginner');
  // Use a valid future-ish date string
  await user.type(screen.getByLabelText(/Preferred Date/i), '2025-01-01');
  await user.type(screen.getByLabelText(/^Message$/i), 'Looking forward to the class.');

  // Submit
  await user.click(screen.getByRole('button', { name: /Book Class/i }));

  // Success message appears
  await waitFor(() =>
    expect(screen.getByText(/Booking received/i)).toBeInTheDocument()
  );
});
