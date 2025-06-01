import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders Legal Document Management System landing page', () => {
  render(<App />);
  const titleElement = screen.getByText(/Legal Document Management System/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders get started button on landing page', () => {
  render(<App />);
  const getStartedButton = screen.getByRole('button', { name: /get started/i });
  expect(getStartedButton).toBeInTheDocument();
});

test('renders hero section', () => {
  render(<App />);
  const heroText = screen.getByText(/Streamline your legal document workflow/i);
  expect(heroText).toBeInTheDocument();
});

test('renders features section', () => {
  render(<App />);
  const featuresHeading = screen.getByText(/Powerful Features/i);
  expect(featuresHeading).toBeInTheDocument();
});
