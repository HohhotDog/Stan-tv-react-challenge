import React from 'react';
import { Link } from 'react-router-dom';
import type { Program } from '../types';

type Props = {
  items: Program[];
  activeIndex: number;
};

export const Carousel: React.FC<Props> = ({ items, activeIndex }) => {
  // Virtualize to at most 6 items in DOM
  const WINDOW = 6;
  const visible: { item: Program; index: number }[] = [];

  if (items.length <= WINDOW) {
    items.forEach((it, idx) => visible.push({ item: it, index: idx }));
  } else {
    // choose a window around activeIndex but clamped to bounds
    const half = Math.floor(WINDOW / 2); // 3
    const start = Math.max(0, Math.min(items.length - WINDOW, activeIndex - half));
    for (let i = 0; i < WINDOW; i++) {
      visible.push({ item: items[start + i], index: start + i });
    }
  }

  return (
      <div aria-label="carousel" className="carousel">
        <div className="carousel-track">
          {visible.map(({ item, index }) => (
              <Link className="linkReset" to={`/program/${item.id}`} key={item.id} aria-label={`program-${item.id}`}>
                <article className={`card ${index === activeIndex ? 'isActive' : ''}`}>
                  <img src={item.image} alt={item.title} />
                </article>
              </Link>
          ))}
        </div>
      </div>
  );
};