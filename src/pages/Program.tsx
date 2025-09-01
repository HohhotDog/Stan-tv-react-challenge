// src/pages/Program.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData, Program } from '../dataContext';
import { useKeyboardNav } from '../hooks_useKeyboardNav';

type FetchState = 'idle' | 'loading' | 'success' | 'error';

/* Compact rating like "MA 15+" -> "MA15+" */
const compactRating = (r?: string) => (r ? r.replace(/\s+/g, '') : undefined);

/* Build the meta line from available fields */
function buildMeta(opts: { rating?: string; year?: number; type?: string; genre?: string; language?: string }) {
    const parts: string[] = [];
    const r = compactRating(opts.rating);
    if (r) parts.push(r);
    if (opts.year) parts.push(String(opts.year));
    // If you later have seasons, insert here like `${seasons} season(s)`
    if (opts.genre) parts.push(opts.genre);
    if (opts.language) parts.push(opts.language);
    return parts.join(' | ');
}

/* Minimal normalize used when navigating directly to Program route */
function normalize(raw: any): { programs: Program[] } {
    const arr: any[] =
        Array.isArray(raw?.programs) ? raw.programs :
            Array.isArray(raw?.items)    ? raw.items    :
                Array.isArray(raw?.entries)  ? raw.entries  :
                    Array.isArray(raw)           ? raw          : [];
    const programs: Program[] = arr.map((it: any, i: number) => ({
        id: String(it.id ?? it.programId ?? it.slug ?? i + 1),
        title: String(it.title ?? it.name ?? it.label ?? 'Untitled'),
        image: String(it.image ?? it.poster ?? it.img ?? it.cover ?? it.thumbnail ?? ''),
        overview: String(it.overview ?? it.description ?? it.summary ?? ''),
        rating: it.rating ? String(it.rating) : undefined,
        year: typeof it.year === 'number' ? it.year : (Number(it.year) || undefined),
        genre: it.genre ? String(it.genre) : undefined,
        language: it.language ? String(it.language) : undefined,
        type: it.type ? String(it.type) : undefined,
    })).filter(p => p.image);
    return { programs };
}

export default function ProgramPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, setData, hasLoadedHome } = useData();
    const [state, setState] = useState<FetchState>(data ? 'success' : hasLoadedHome ? 'success' : 'idle');

    // Only fetch if Home hasn't loaded first (no context and not visited)
    useEffect(() => {
        if (data) return;
        if (!hasLoadedHome && state === 'idle') {
            setState('loading');
            fetch('/data.json')
                .then(async (res) => {
                    if (!res.ok) throw new Error('Network');
                    const json = await res.json();
                    setData(normalize(json));
                    setState('success');
                })
                .catch(() => setState('error'));
        }
    }, [data, setData, state, hasLoadedHome]);

    const program = useMemo(() => {
        if (!data || !id) return null;
        return data.programs.find((p) => String(p.id) === String(id)) ?? null;
    }, [data, id]);

    // Backspace to go back to Home
    useKeyboardNav({ onBackspace: () => navigate(-1) });

    if (state === 'loading' || (!data && state !== 'error')) {
        // program-loading skeleton blocks
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

    const meta = buildMeta({
        rating: program.rating,
        year: program.year,
        genre: program.genre,
        language: program.language,
        type: program.type,
    });

    return (
        <div className="container">
            <div className="programGrid">
                <img className="programPoster" src={program.image} alt={program.title} />
                <div>
                    <h1 className="programTitle">{program.title}</h1>
                    <div className="programMeta">{meta}</div>
                    <p className="programOverview">{program.overview}</p>
                </div>
            </div>
        </div>
    );
}