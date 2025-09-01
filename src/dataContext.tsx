// src/dataContext.tsx
import React, { createContext, useContext, useState } from 'react';

export type Program = {
  id: string;
  title: string;
  image: string;
  overview: string;
  rating?: string;
  year?: number;
  genre?: string;
  language?: string;
  type?: string; // e.g. "series" | "movie"
};

export type DataShape = { programs: Program[] } | null;

type Ctx = {
  data: DataShape;
  setData: (d: DataShape) => void;
  hasLoadedHome: boolean;
  setHasLoadedHome: (v: boolean) => void;
};

const DataCtx = createContext<Ctx | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DataShape>(null);
  const [hasLoadedHome, setHasLoadedHome] = useState<boolean>(false);

  return (
      <DataCtx.Provider value={{ data, setData, hasLoadedHome, setHasLoadedHome }}>
        {children}
      </DataCtx.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataCtx);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};