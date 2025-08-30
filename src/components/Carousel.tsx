import React from 'react';
import { Link } from 'react-router-dom';
import type { Program } from '../types';

type Props = {
  items: Program[];
  activeIndex: number;
};

export const Carousel: React.FC<Props> = ({ items, activeIndex }) => {
  // Virtualize to at most 6 items in DOM
  const max = 6;
  let visible: { item: Program; index: number }[] = [];
  if (items.length <= max) {
    visible = items.map((it, idx) => ({ item: it, index: idx }));
  } else {
    const windowSize = max;
    const half = Math.floor(windowSize / 2);
    const start = Math.max(0, Math.min(items.length - windowSize, activeIndex - half));
    for (let i = 0; i < windowSize; i++) {
      const idx = start + i;
      visible.push({ item: items[idx], index: idx });
    }
  }

  return (
    <div aria-label="carousel" className="carousel">
      <div className="carousel-track">
        {visible.map(({ item, index }) => (
          <Link
            className="linkReset"
            to={`/program/${item.id}`}
            key={item.id}
            aria-label={`program-${item.id}`}
          >
            <article className={`card ${index === activeIndex ? 'isActive' : ''}`}>
              <img src={item.image} alt={item.title} />
              <div className="meta">
                <strong>{item.title}</strong>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};
