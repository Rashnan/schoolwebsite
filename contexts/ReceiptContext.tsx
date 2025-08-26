"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ReceiptRunner {
  id?: number;
  runner: {
    fullName: string;
    email: string;
    phoneNumber: string;
    tshirtSize: string;
  };
  category: string;
  totalPrice: number;
}

interface ReceiptData {
  receiptId: string;
  registrationName: string;
  totalAmount: number;
  originalAmount?: number;
  appliedDiscount?: any;
  paymentMethod: string;
  paymentDate: string;
  runners: ReceiptRunner[];
}

interface ReceiptContextType {
  receiptData: ReceiptData | null;
  setReceiptData: (data: ReceiptData | null) => void;
  clearReceipt: () => void;
}

const ReceiptContext = createContext<ReceiptContextType | undefined>(undefined);

export function ReceiptProvider({ children }: { children: ReactNode }) {
  const [receiptData, setReceiptDataState] = useState<ReceiptData | null>(null);

  const setReceiptData = (data: ReceiptData | null) => {
    setReceiptDataState(data);
  };

  const clearReceipt = () => {
    setReceiptDataState(null);
  };

  return (
    <ReceiptContext.Provider value={{
      receiptData,
      setReceiptData,
      clearReceipt
    }}>
      {children}
    </ReceiptContext.Provider>
  );
}

export function useReceipt() {
  const context = useContext(ReceiptContext);
  if (context === undefined) {
    throw new Error('useReceipt must be used within a ReceiptProvider');
  }
  return context;
}
