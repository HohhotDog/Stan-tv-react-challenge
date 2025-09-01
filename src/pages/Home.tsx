// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData, Program } from '../dataContext';
import { Carousel } from '../components/Carousel';
import { useKeyboardNav } from '../hooks_useKeyboardNav';

type FetchState = 'idle' | 'loading' | 'success' | 'error';

/* Normalize various data.json shapes into { programs } and include meta fields */
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

export default function Home() {
    const navigate = useNavigate();
    const { data, setData, setHasLoadedHome } = useData();
    const [state, setState] = useState<FetchState>(data ? 'success' : 'idle');
    const [activeIndex, setActiveIndex] = useState(0);
    const programs = data?.programs ?? [];

    useEffect(() => {
        // mark home as visited
        setHasLoadedHome(true);

        if (!data && state === 'idle') {
            setState('loading');
            // Ensure your data.json is in public/ so /data.json works in dev/prod
            fetch('/data.json')
                .then(async (res) => {
                    if (!res.ok) throw new Error('Network');
                    const json = await res.json();
                    const normalized = normalize(json);
                    if (normalized.programs.length === 0) throw new Error('No programs');
                    setData(normalized);
                    setState('success');
                })
                .catch(() => setState('error'));
        }
    }, [data, setData, state, setHasLoadedHome]);

    useKeyboardNav({
        onLeft: () => setActiveIndex((i) => Math.max(0, i - 1)),
        onRight: () => setActiveIndex((i) => Math.min(Math.max(0, programs.length - 1), i + 1)),
        onEnter: () => {
            const target = programs[activeIndex];
            if (target) navigate(`/program/${target.id}`);
        },
    });

    if (state === 'loading') {
        // home-loading skeleton blocks
        return (
            <div className="container" data-testid="home-loading">
                <div className="homeLoadingGrid">
                    <div className="skeleton homeLoading-left" />
                    <div>
                        <div className="skeleton homeLoading-lineSm" />
                        <div className="skeleton homeLoading-lineMd" />
                        <div className="skeleton homeLoading-hero" />
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

    return (
        <div className="container">
            <div className="carousel">
                <div className="carousel-track">
                    <Carousel items={programs} activeIndex={activeIndex} />
                </div>
            </div>
        </div>
    );
}