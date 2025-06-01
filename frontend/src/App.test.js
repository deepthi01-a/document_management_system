import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders landing page by default', () => {
  render(<App />);
  const titleElement = screen.getByText(/Legal Document Management System/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders get started button on landing page', () => {
  render(<App />);
  const getStartedButton = screen.getByText(/Get Started/i);
  expect(getStartedButton).toBeInTheDocument();
});

test('renders features section', () => {
  render(<App />);
  const featuresSection = screen.getByText(/Powerful Features/i);
  expect(featuresSection).toBeInTheDocument();
});

test('renders tech stack section', () => {
  render(<App />);
  const techSection = screen.getByText(/Built with Modern Technologies/i);
  expect(techSection).toBeInTheDocument();
});
