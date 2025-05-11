/**
 * Application Test Suite
 * Contains:
 * - Basic application rendering tests
 * - Component smoke tests
 * - Integration test setup
 */

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
