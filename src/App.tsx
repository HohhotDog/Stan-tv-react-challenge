import React from 'react';
import './styles.css';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import ProgramPage from './pages/Program';
import Logo from '../public/logo.svg';
import { DataProvider } from './dataContext';

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="app">
            <header className="topbar">
                <div className="brand">
                    {/* brand logo at top-left */}
                    <img src={Logo} alt="Stan logo" />
                </div>
                <nav className="nav" aria-label="primary">
                    <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>Home</NavLink>
                    <a href="#" className="linkReset" aria-disabled="true">TV Shows</a>
                    <a href="#" className="linkReset" aria-disabled="true">Movies</a>
                </nav>
            </header>

            <main style={{ flex: 1 }}>{children}</main>

            {/* keep footer bar but remove confusing text; can also delete the whole footer if preferred */}
            <footer className="footer" />
        </div>
    );
};

export default function App() {
    return (
        <BrowserRouter>
            <DataProvider>
                <Shell>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/program/:id" element={<ProgramPage />} />
                    </Routes>
                </Shell>
            </DataProvider>
        </BrowserRouter>
    );
}