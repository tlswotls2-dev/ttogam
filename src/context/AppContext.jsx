import { createContext, useMemo, useState } from 'react';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [studentName, setStudentName] = useState('또감 탐험대');
  const [activeClassName, setActiveClassName] = useState('3학년 2반');

  const value = useMemo(
    () => ({
      studentName,
      setStudentName,
      activeClassName,
      setActiveClassName,
    }),
    [studentName, activeClassName],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
