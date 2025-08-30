import React, { useEffect, useMemo, useState } from 'react';
import '../styles.css';
import { Carousel } from '../components/Carousel';
import { useKeyboardNav } from '../hooks_useKeyboardNav';
import type { DataShape } from '../types';
import { useNavigate } from 'react-router-dom';
import { useData } from '../dataContext';

type FetchState = 'idle' | 'loading' | 'success' | 'error';

export default function Home() {
  const navigate = useNavigate();
  const { data, setData } = useData();
  const [state, setState] = useState<FetchState>(data ? 'success' : 'idle');
  const [activeIndex, setActiveIndex] = useState(0);
  const programs = data?.programs ?? [];

  useEffect(() => {
    if (!data && state === 'idle') {
      setState('loading');
      fetch('/data.json')
        .then(async (res) => {
          if (!res.ok) throw new Error('Network error');
          const json = (await res.json()) as DataShape;
          setData(json);
          setState('success');
        })
        .catch(() => setState('error'));
    }
  }, [data, setData, state]);

  useKeyboardNav({
    onLeft: () => setActiveIndex((i) => Math.max(0, i - 1)),
    onRight: () => setActiveIndex((i) => Math.min(Math.max(0, programs.length - 1), i + 1)),
    onEnter: () => {
      const target = programs[activeIndex];
      if (target) {
        navigate(`/program/${target.id}`);
      }
    }
  });

  if (state === 'loading') {
    return (
      <div className="container" data-testid="home-loading">
        <h2 className="section-title">Loading…</h2>
        <div className="carousel-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="skeleton" key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="container" role="alert">
        <div className="errorBox">
          Sorry, something went wrong while loading. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="section-title">Featured</h2>
      <Carousel items={programs} activeIndex={activeIndex} />
      <p style={{ color: '#9aa0a6', marginTop: 8 }}>
        Use ← → to move; press Enter to open.
      </p>
    </div>
  );
}
