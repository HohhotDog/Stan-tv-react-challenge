// src/testUtils.tsx
import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { DataProvider } from './dataContext';

// Helper to render UI wrapped with DataProvider + MemoryRouter
export function renderWithProviders(
    ui: React.ReactElement,
    opts?: { router?: Partial<MemoryRouterProps> }
) {
    const Wrapper: React.FC<PropsWithChildren> = ({ children }) => (
        <DataProvider>
            <MemoryRouter {...opts?.router}>{children}</MemoryRouter>
        </DataProvider>
    );
    return render(ui, { wrapper: Wrapper });
}