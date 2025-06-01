import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders Legal Document Management System', () => {
  render(<App />);
  const titleElement = screen.getByText(/Legal Document Management System/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders upload form button', () => {
  render(<App />);
  const uploadButton = screen.getByRole('button', { name: /upload/i });
  expect(uploadButton).toBeInTheDocument();
});

test('renders API health status section', () => {
  render(<App />);
  const healthSection = screen.getByText(/API Health Status/i);
  expect(healthSection).toBeInTheDocument();
});

test('renders upload form inputs', () => {
  render(<App />);
  const titleInput = screen.getByPlaceholderText(/title/i);
  const contentInput = screen.getByPlaceholderText(/content/i);
  expect(titleInput).toBeInTheDocument();
  expect(contentInput).toBeInTheDocument();
});
