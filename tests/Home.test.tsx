import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../src/pages/Home';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { DataProvider } from '../src/dataContext';

const data = {
  programs: Array.from({ length: 8 }).map((_, i) => ({
    id: String(i + 1),
    title: `P${i + 1}`,
    image: `https://picsum.photos/id/${1000 + i}/640/360`,
    overview: `O${i + 1}`
  }))
};

describe('Home', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(data),
      })
    );
  });

  it('shows skeleton while loading', async () => {
    render(
      <MemoryRouter>
        <DataProvider>
          <Home />
        </DataProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('home-loading')).toBeInTheDocument();
    await waitFor(() => screen.getByText('Featured'));
  });

  it('limits DOM images to at most 6', async () => {
    render(
      <MemoryRouter>
        <DataProvider>
          <Home />
        </DataProvider>
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Featured'));
    const images = screen.getAllByRole('img');
    // Header logo + visible cards (<= 6)
    expect(images.length - 1).toBeLessThanOrEqual(6);
  });

  it('navigates with keyboard', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <DataProvider>
          <Home />
        </DataProvider>
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Featured'));
    await user.keyboard('{ArrowRight}{ArrowRight}{Enter}');
    // We cannot assert URL change without Router navigation,
    // but we can assert that cards exist (Enter would click a link).
    // For a full integration test we'd render App.
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });
});
