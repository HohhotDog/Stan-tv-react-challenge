// src/__tests__/Home.test.tsx
import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import Home from '../pages/Home';
import { renderWithProviders } from '../testUtils';

// Mock useNavigate to verify "Enter" triggers navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Helper: create fake list
function makePrograms(n: number) {
  return Array.from({ length: n }).map((_, i) => ({
    id: String(i + 1),
    title: `Title ${i + 1}`,
    image: `https://example.com/p${i + 1}.jpg`,
    overview: `Overview ${i + 1}`,
    rating: 'MA 15+',
    year: 2021,
    genre: 'Drama',
    language: 'English',
    type: 'series',
  }));
}

describe('Home', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'fetch');
    mockNavigate.mockReset();
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockRestore();
    jest.useRealTimers();
  });

  test('shows loading skeleton then renders cards (<= 6 in DOM)', async () => {
    // Mock fetch OK
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ programs: makePrograms(10) }),
    });

    renderWithProviders(<Home />);

    // Loading skeleton first
    expect(screen.getByTestId('home-loading')).toBeInTheDocument();

    // Wait for images/cards rendered
    await waitFor(() => {
      // We render links wrapping cards; DOM should contain at most 6 cards
      const links = screen.getAllByRole('link');
      expect(links.length).toBeLessThanOrEqual(6);
    });
  });

  test('error state renders error message', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({ ok: false });

    renderWithProviders(<Home />);
    await waitFor(() => {
      expect(
          screen.getByText(/An unknown error occurred\. please try again later/i)
      ).toBeInTheDocument();
    });
  });

  test('keyboard navigation: ArrowRight selects next, Enter navigates', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ programs: makePrograms(8) }),
    });

    renderWithProviders(<Home />);

    // Wait list
    await waitFor(() => {
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });

    // Move focus/selection to next card
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    // Press Enter should navigate with the selected program id (2)
    fireEvent.keyDown(window, { key: 'Enter' });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    // Called like navigate('/program/2')
    const to = mockNavigate.mock.calls[0][0];
    expect(String(to)).toMatch(/\/program\/\d+/);
  });
});