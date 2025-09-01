// src/__tests__/Program.test.tsx
import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import ProgramPage from '../pages/Program';
import { renderWithProviders } from '../testUtils';

// Mock useNavigate to capture back navigation and any route jumps
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Fixture list with explicit meta; id 2 is our target
const programs = [
  {
    id: '1',
    title: 'A',
    image: 'https://example.com/a.jpg',
    overview: 'OA',
    rating: 'MA 15+',
    year: 2020,
    genre: 'Drama',
    language: 'English',
    type: 'series',
  },
  {
    id: '2',
    title: 'Dr Death',
    image: 'https://example.com/b.jpg',
    overview:
        'Terrifying true story of Dr. Christopher Duntsch...',
    rating: 'MA 15+',
    year: 2021,
    genre: 'Drama',
    language: 'English',
    type: 'series',
  },
];

// When navigating directly to Program and Home not visited, component will fetch
function mockFetchOkList() {
  (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ programs }),
  });
}

describe('Program page', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
    mockNavigate.mockReset();
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockRestore();
  });

  test('lazy loads when Home not visited: shows loading then renders meta line', async () => {
    mockFetchOkList();

    // Directly route to /program/2 with MemoryRouter
    renderWithProviders(<ProgramPage />, {
      router: { initialEntries: ['/program/2'] },
    });

    // loading skeleton
    expect(screen.getByTestId('program-loading')).toBeInTheDocument();

    // After fetch, title + meta should appear
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dr death/i })).toBeInTheDocument();
    });

    // Meta line built from rating/year/genre/language; rating spaces compacted
    expect(screen.getByText(/MA15\+ \| 2021 \| Drama \| English/i)).toBeInTheDocument();
  });

  test('error state on fetch failure', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockRejectedValue(new Error('boom'));

    renderWithProviders(<ProgramPage />, {
      router: { initialEntries: ['/program/2'] },
    });

    await waitFor(() => {
      expect(
          screen.getByText(/An unknown error occurred\. please try again later/i)
      ).toBeInTheDocument();
    });
  });

  test('Backspace navigates back', async () => {
    mockFetchOkList();

    renderWithProviders(<ProgramPage />, {
      router: { initialEntries: ['/program/2'] },
    });

    // Wait until content renders
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dr death/i })).toBeInTheDocument();
    });

    fireEvent.keyDown(window, { key: 'Backspace' });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});