import React, { useEffect, useState } from 'react';
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

    // Only fetch if Home wasn't visited (no data in context)
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
            const found = data.programs.find((p) => p.id === id) ?? null;
            setProgram(found);
        }
    }, [data, id]);

    useKeyboardNav({ onBackspace: () => navigate(-1) });

    if (state === 'loading' || (!data && state !== 'error')) {
        // skeleton blocks to resemble program-loading.jpg
        return (
            <div className="container" data-testid="program-loading">
                <div className="programGrid">
                    <div className="skeleton programPoster" />
                    <div>
                        <div className="skeleton" style={{ width: '60%', height: 72, marginBottom: 16 }} />
                        <div className="skeleton" style={{ width: '40%', height: 32, marginBottom: 24 }} />
                        <div className="skeleton" style={{ width: '100%', height: 140, marginBottom: 12 }} />
                        <div className="skeleton" style={{ width: '85%', height: 140 }} />
                    </div>
                </div>
            </div>
        );
    }

    if (state === 'error') {
        return (
            <div className="container" role="alert">
                <div className="errorBox">An unknown error occurred. please try again later</div>
            </div>
        );
    }

    if (!program) {
        return (
            <div className="container" role="alert">
                <div className="errorBox">Program not found.</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="programGrid">
                <img className="programPoster" src={program.image} alt={program.title} />
                <div>
                    <h1 className="programTitle">{program.title}</h1>
                    {/* metadata row – placeholder fields to match visual weight */}
                    <div className="programMeta">MA15+ | 2021 | 1 season | Drama | English</div>
                    <p className="programOverview">
                        {program.overview}
                    </p>
                    <p style={{ color: '#9aa0a6', marginTop: 12 }}>Press Backspace to go back.</p>
                </div>
            </div>
        </div>
    );
}