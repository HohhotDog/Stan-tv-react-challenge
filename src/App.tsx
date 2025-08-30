import React from 'react';
import './styles.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ProgramPage from './pages/Program';
import Logo from './assets/logo.svg';
import { DataProvider } from './dataContext';

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app">
      <header className="header">
        <img src={Logo} alt="Stan logo" />
        <h1><Link to="/" className="linkReset">Stan TV</Link></h1>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
      <footer className="footer">Challenge scaffold • Open Sans • Keyboard: ← → Enter ⌫</footer>
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
