import { createContext, useContext, ReactNode } from 'react';
import { TradeSimulationResult } from '../trade-simulator';
import { TradeInputs, useTradeSimulator } from '../components/TradeCalculator';

interface TradeContextType {
    inputs: TradeInputs;
    setInputs: (inputs: TradeInputs) => void;
    handleInputChange: (field: keyof TradeInputs, value: string) => void;
    simulation: TradeSimulationResult | null;
    riskRewardRatio: number;
    setRiskRewardRatio: (ratio: number) => void;
}

const TradeContext = createContext<TradeContextType | null>(null);

export const TradeProvider = ({ children }: { children: ReactNode }) => {
    const simulatorData = useTradeSimulator();
    return (
        <TradeContext.Provider value={simulatorData}>
            {children}
        </TradeContext.Provider>
    );
};

export const useTrade = () => {
    const context = useContext(TradeContext);
    if (!context) {
        throw new Error('useTrade must be used within a TradeProvider');
    }
    return context;
};