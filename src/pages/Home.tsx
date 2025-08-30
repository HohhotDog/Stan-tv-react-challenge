import React, { useEffect, useState } from 'react';
import '../styles.css';
import { Carousel } from '../components/Carousel';
import { useKeyboardNav } from '../hooks_useKeyboardNav';
import type { DataShape, Program } from '../types';
import { useNavigate } from 'react-router-dom';
import { useData } from '../dataContext';

type FetchState = 'idle' | 'loading' | 'success' | 'error';

function normalizePrograms(raw: any): Program[] {
    // accept several common shapes: { programs: [...] } | { items: [...] } | [...]
    const arr =
        Array.isArray(raw?.programs) ? raw.programs :
            Array.isArray(raw?.items) ? raw.items :
                Array.isArray(raw) ? raw : [];

    return arr
        .map((it: any, idx: number) => {
            const id = it.id ?? it.programId ?? idx + 1;
            const title = it.title ?? it.name ?? it.label ?? 'Untitled';
            const image = it.image ?? it.poster ?? it.img ?? it.cover ?? '';
            const overview = it.overview ?? it.description ?? '';
            return { id: String(id), title: String(title), image: String(image), overview: String(overview) } as Program;
        })
        .filter((p: Program) => p.image); // require image to render a card
}

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
                    const json = await res.json();
                    const programs = normalizePrograms(json);
                    setData({ programs });
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
            if (target) navigate(`/program/${target.id}`);
        }
    });

    if (state === 'loading') {
        // keep your existing skeleton UI; omitted here for brevity
        return (
            <div className="container" data-testid="home-loading">
                <div className="carousel-track">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div className="card skeleton" key={i} />
                    ))}
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
            {/* removed keyboard usage hint per your requirement */}
        </div>
    );
}