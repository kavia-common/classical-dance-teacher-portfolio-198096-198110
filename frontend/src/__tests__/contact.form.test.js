import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../App';
import { ThemeProvider } from '../providers/ThemeContext';

test('submits contact form successfully', async () => {
  const user = userEvent.setup();
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/contact']}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </HelmetProvider>
  );

  await user.type(screen.getByLabelText(/Name/i), 'Bob Tester');
  await user.type(screen.getByLabelText(/^Email$/i), 'bob@example.com');
  await user.type(screen.getByLabelText(/Subject/i), 'Inquiry');
  await user.type(screen.getByLabelText(/^Message$/i), 'Hello! I would like more information.');

  await user.click(screen.getByRole('button', { name: /Send Message/i }));

  await waitFor(() =>
    expect(screen.getByText(/Message sent\. Thank you for reaching out!/i)).toBeInTheDocument()
  );
});
