import { Location } from '@/types/navigation';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface LocationContextType {
  startLocation: Location | null;
  endLocation: Location | null;
  setStartLocation: (location: Location) => void;
  setEndLocation: (location: Location) => void;
  resetLocations: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);

  const resetLocations = () => {
    setStartLocation(null);
    setEndLocation(null);
  };

  return (
    <LocationContext.Provider
      value={{ startLocation, endLocation, setStartLocation, setEndLocation, resetLocations }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}; 