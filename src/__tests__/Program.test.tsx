// src/__tests__/Program.test.tsx
import React from 'react';
import { screen, waitFor, fireEvent, render } from '@testing-library/react';
import ProgramPage from '../pages/Program';
import { DataProvider } from '../dataContext';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Silence React Router future flag warnings in tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: any[]) => {
    const msg = String(args[0] ?? '');
    if (msg.includes('React Router Future Flag Warning')) return;
    originalWarn(...args);
  };
});
afterAll(() => {
  console.warn = originalWarn;
});

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
    overview: 'Terrifying true story of Dr. Christopher Duntsch...',
    rating: 'MA 15+',
    year: 2021,
    genre: 'Drama',
    language: 'English',
    type: 'series',
  },
];

// Helper: render ProgramPage at /program/:id with DataProvider + MemoryRouter
function renderProgramAt(path: string) {
  return render(
      <DataProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/program/:id" element={<ProgramPage />} />
          </Routes>
        </MemoryRouter>
      </DataProvider>
  );
}

// Ensure fetch exists and is a mock each test
beforeEach(() => {
  (global.fetch as unknown as jest.Mock) = jest.fn();
  mockNavigate.mockReset();
});

afterEach(() => {
  (global.fetch as jest.Mock).mockReset();
});

function mockFetchOkList() {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ programs }),
  });
}

describe('Program page', () => {
  test('lazy loads when Home not visited: shows loading then renders meta line', async () => {
    mockFetchOkList();

    renderProgramAt('/program/2');

    // loading skeleton appears
    expect(screen.getByTestId('program-loading')).toBeInTheDocument();

    // After fetch, title + meta should appear
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dr death/i })).toBeInTheDocument();
    });
    expect(screen.getByText(/MA15\+ \| 2021 \| Drama \| English/i)).toBeInTheDocument();
  });

  test('error state on fetch failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('boom'));

    renderProgramAt('/program/2');

    await waitFor(() => {
      expect(
          screen.getByText(/An unknown error occurred\. please try again later/i)
      ).toBeInTheDocument();
    });
  });

  test('Backspace navigates back', async () => {
    mockFetchOkList();

    renderProgramAt('/program/2');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dr death/i })).toBeInTheDocument();
    });

    fireEvent.keyDown(window, { key: 'Backspace' });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});