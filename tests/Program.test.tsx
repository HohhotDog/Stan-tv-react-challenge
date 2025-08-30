import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProgramPage from '../src/pages/Program';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DataProvider } from '../src/dataContext';

const data = {
  programs: [
    { id: '1', title: 'A', image: 'x', overview: 'o' },
    { id: '2', title: 'B', image: 'y', overview: 'p' }
  ]
};

describe('Program', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(data),
      })
    );
  });

  it('renders loading skeleton then program', async () => {
    render(
      <MemoryRouter initialEntries={['/program/2']}>
        <DataProvider>
          <Routes>
            <Route path="/program/:id" element={<ProgramPage />} />
          </Routes>
        </DataProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('program-loading')).toBeInTheDocument();
    await waitFor(() => screen.getByText('B'));
  });
});
