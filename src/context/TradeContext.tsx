import { createContext, useContext, ReactNode } from 'react';
import { TradeContextType } from '../types/trade';
import { useTradeSimulator } from '../components/TradeCalculator';

const TradeContext = createContext<TradeContextType | null>(null);

export const TradeProvider = ({ children }: { children: ReactNode }) => {
  const simulatorData = useTradeSimulator();
  return (
    <TradeContext.Provider value={simulatorData}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrade = (): TradeContextType => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrade must be used within a TradeProvider');
  }
  return context;
};