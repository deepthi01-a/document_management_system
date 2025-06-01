import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders landing page main heading', () => {
  render(<App />);
  const titleElement = screen.getByRole('heading', { level: 1, name: /Legal Document Management System/i });
  expect(titleElement).toBeInTheDocument();
});

test('renders hero subtitle', () => {
  render(<App />);
  const subtitleElement = screen.getByText(/Streamline your legal document workflow/i);
  expect(subtitleElement).toBeInTheDocument();
});

test('renders features section', () => {
  render(<App />);
  const featuresElement = screen.getByText(/Powerful Features/i);
  expect(featuresElement).toBeInTheDocument();
});

test('app renders without crashing', () => {
  render(<App />);
  expect(document.body).toBeInTheDocument();
});
