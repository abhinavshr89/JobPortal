"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Company {
  id: string;
  name: string;
  description: string;
  location: string;
  logo?: string;
  ownerId: string;
}

interface CompanyContextType {
  company: Company | null;
  hasCompany: boolean;
  setCompany: (company: Company | null) => void;
  setHasCompany: (hasCompany: boolean) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [hasCompany, setHasCompany] = useState(false);

  return (
    <CompanyContext.Provider
      value={{
        company,
        hasCompany,
        setCompany,
        setHasCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
 