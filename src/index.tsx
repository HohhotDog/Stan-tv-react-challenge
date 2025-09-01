import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { DataProvider } from './dataContext';
import Home from './pages/Home';
import Program from './pages/Program';
import './styles.css'; // ensure styles extracted to dist/styles.css

const App = () => (
    <DataProvider>
        <BrowserRouter>
            <div className="topbar">
                <a className="brand" href="/"><img src="/logo.svg" alt="Stan" /></a>
                <nav className="nav">
                    <Link className="active" to="/">Home</Link>
                    <Link to="/">TV Shows</Link>
                    <Link to="/">Movies</Link>
                </nav>
            </div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/program/:id" element={<Program />} />
            </Routes>
        </BrowserRouter>
    </DataProvider>
);

createRoot(document.getElementById('root')!).render(<App />);