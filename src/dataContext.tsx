import React, { createContext, useContext, useState } from 'react';
import type { DataShape } from './types';

type Ctx = {
  data: DataShape | null;
  setData: React.Dispatch<React.SetStateAction<DataShape | null>>;
};

const DataContext = createContext<Ctx | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DataShape | null>(null);
  return <DataContext.Provider value={{ data, setData }}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
