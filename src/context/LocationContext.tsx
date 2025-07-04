import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
  selectedState: string;
  selectedCity: string;
  setSelectedState: (state: string) => void;
  setSelectedCity: (city: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  useEffect(() => {
    // Load saved location from localStorage
    const savedState = localStorage.getItem('selectedState');
    const savedCity = localStorage.getItem('selectedCity');
    
    if (savedState) {
      setSelectedState(savedState);
    }
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);

  const handleSetState = (state: string) => {
    setSelectedState(state);
    localStorage.setItem('selectedState', state);
    if (!state) {
      setSelectedCity('');
      localStorage.removeItem('selectedCity');
    }
  };

  const handleSetCity = (city: string) => {
    setSelectedCity(city);
    if (city) {
      localStorage.setItem('selectedCity', city);
    } else {
      localStorage.removeItem('selectedCity');
    }
  };

  const value: LocationContextType = {
    selectedState,
    selectedCity,
    setSelectedState: handleSetState,
    setSelectedCity: handleSetCity
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};