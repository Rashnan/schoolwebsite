"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Runner {
  fullName: string;
  email: string;
  phoneNumber: string;
  tshirtSize: string;
}

interface RunnerRegistration {
  id: string;
  category: string;
  runner: Runner;
  totalPrice: number;
}

interface RegistrationContextType {
  // Loading state
  isLoading: boolean;
  
  // Current runner being edited/created
  currentRunner: RunnerRegistration | null;
  setCurrentRunner: (runner: RunnerRegistration | null) => void;
  updateCurrentRunner: (updates: Partial<RunnerRegistration>) => void;
  resetCurrentRunner: () => void;
  
  // All registered runners (cart items)
  runners: RunnerRegistration[];
  addRunner: (runner: RunnerRegistration) => void;
  removeRunner: (id: string) => void;
  updateRunner: (id: string, updates: Partial<RunnerRegistration>) => void;
  clearRunners: () => void;
  
  // Registration name for the entire group
  registrationName: string;
  setRegistrationName: (name: string) => void;
  
  // Checkout functionality
  prepareCheckoutData: () => { registrationName: string; runners: RunnerRegistration[] };
  
  // Utility functions
  getTotalAmount: () => number;
  getRunnerCount: () => number;
  isRunnerRegistered: (id: string) => boolean;
  findRunnerByEmailAndCategory: (email: string, category: string) => RunnerRegistration | undefined;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentRunner, setCurrentRunner] = useState<RunnerRegistration | null>(null);
  const [runners, setRunners] = useState<RunnerRegistration[]>([]);
  const [registrationName, setRegistrationName] = useState<string>("");

  // Load runners and registration name from localStorage on mount
  useEffect(() => {
    const savedRunners = localStorage.getItem('raceRunners');
    const savedRegistrationName = localStorage.getItem('registrationName');
    
    if (savedRunners) {
      try {
        setRunners(JSON.parse(savedRunners));
      } catch (error) {
        console.error('Error loading runners from localStorage:', error);
        localStorage.removeItem('raceRunners');
      }
    }
    
    if (savedRegistrationName) {
      setRegistrationName(savedRegistrationName);
    }
    
    // Mark loading as complete
    setIsLoading(false);
  }, []);

  // Save runners to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('raceRunners', JSON.stringify(runners));
  }, [runners]);

  // Save registration name to localStorage whenever it changes
  useEffect(() => {
    if (registrationName) {
      localStorage.setItem('registrationName', registrationName);
    }
  }, [registrationName]);

  const updateCurrentRunner = (updates: Partial<RunnerRegistration>) => {
    if (currentRunner) {
      setCurrentRunner({
        ...currentRunner,
        ...updates,
      });
    }
  };

  const resetCurrentRunner = () => {
    setCurrentRunner(null);
  };

  const addRunner = (runner: RunnerRegistration) => {
    setRunners(prev => {
      // Check if runner already exists (by email and category)
      const existingIndex = prev.findIndex(
        existingRunner => 
          existingRunner.runner.email === runner.runner.email && 
          existingRunner.category === runner.category
      );
      
      if (existingIndex >= 0) {
        // Update existing runner
        const updated = [...prev];
        updated[existingIndex] = { ...runner, id: prev[existingIndex].id };
        return updated;
      } else {
        // Add new runner
        return [...prev, { ...runner, id: runner.id || Date.now().toString() }];
      }
    });
  };

  const removeRunner = (id: string) => {
    setRunners(prev => prev.filter(runner => runner.id !== id));
  };

  const updateRunner = (id: string, updates: Partial<RunnerRegistration>) => {
    setRunners(prev => 
      prev.map(runner => runner.id === id ? { ...runner, ...updates } : runner)
    );
  };

  const clearRunners = () => {
    setRunners([]);
    setRegistrationName("");
    localStorage.removeItem('raceRunners');
    localStorage.removeItem('registrationName');
  };

  const prepareCheckoutData = () => {
    const checkoutData = {
      registrationName: registrationName,
      runners: runners
    };
    
    // Store checkout data in localStorage for payments page compatibility
    localStorage.setItem('checkoutParticipants', JSON.stringify(checkoutData));
    
    return checkoutData;
  };

  const getTotalAmount = () => {
    return runners.reduce((total, runner) => total + runner.totalPrice, 0);
  };

  const getRunnerCount = () => {
    return runners.length;
  };

  const isRunnerRegistered = (id: string) => {
    return runners.some(runner => runner.id === id);
  };

  const findRunnerByEmailAndCategory = (email: string, category: string) => {
    return runners.find(runner => 
      runner.runner.email === email && runner.category === category
    );
  };

  const value = {
    isLoading,
    currentRunner,
    setCurrentRunner,
    updateCurrentRunner,
    resetCurrentRunner,
    runners,
    addRunner,
    removeRunner,
    updateRunner,
    clearRunners,
    registrationName,
    setRegistrationName,
    prepareCheckoutData,
    getTotalAmount,
    getRunnerCount,
    isRunnerRegistered,
    findRunnerByEmailAndCategory,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}

// Legacy compatibility exports (to make migration easier)
export const useRunners = useRegistration;
export const RunnersProvider = RegistrationProvider;
export const useRunner = useRegistration;
export const RunnerProvider = RegistrationProvider;
export const useCart = useRegistration;
export const CartProvider = RegistrationProvider;
export const useParticipant = useRegistration;
export const ParticipantProvider = RegistrationProvider;
