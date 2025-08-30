import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { DataShape, Program } from '../types';
import { useKeyboardNav } from '../hooks_useKeyboardNav';
import { useData } from '../dataContext';

type FetchState = 'idle' | 'loading' | 'success' | 'error';

export default function ProgramPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, setData } = useData();
  const [state, setState] = useState<FetchState>(data ? 'success' : 'idle');
  const [program, setProgram] = useState<Program | null>(null);

  // Only fetch if Home wasn't visited (i.e., no data in context)
  useEffect(() => {
    if (data) return;
    if (state === 'idle') {
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

  useEffect(() => {
    if (data && id) {
      const found = data.programs.find(p => p.id === id) ?? null;
      setProgram(found);
    }
  }, [data, id]);

  useKeyboardNav({
    onBackspace: () => navigate(-1)
  });

  if (state === 'loading' || (!data && state !== 'error')) {
    return (
      <div className="container" data-testid="program-loading">
        <h2 className="section-title">Loading program…</h2>
        <div className="skeleton" />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="container" role="alert">
        <div className="errorBox">
          Sorry, something went wrong while loading the program.
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container" role="alert">
        <div className="errorBox">
          Program not found.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="section-title">{program.title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        <img src={program.image} alt={program.title} style={{ width: '100%', borderRadius: 12, border: '1px solid #1e1e1e' }} />
        <div>
          <p>{program.overview}</p>
          <p style={{ color: '#9aa0a6', marginTop: 12 }}>Press Backspace to go back.</p>
        </div>
      </div>
    </div>
  );
}
