import { useState, useEffect } from 'react';
import { TradeSimulator, TradeSimulationResult } from '../trade-simulator';
import { TradeInputs } from '../types';

const initialInputs: TradeInputs = {
  price: 0,
  quantity: 0,
  leverage: 1,
  margin: 0,
  makerFee: 0.02,
  takerFee: 0.06,
  tp: 0,
  sl: 0,
  orderType: 'market',
  positionType: 'isolated',
  marginPercent: 0,
  maintenanceMargin: 0,
  liquidationPrice: 0,
  positionSide: 'long',
};

export const useTradeSimulator = () => {
  const [inputs, setInputs] = useState<TradeInputs>(initialInputs);
  const [simulation, setSimulation] = useState<TradeSimulationResult | null>(null);
  const [riskRewardRatio, setRiskRewardRatio] = useState<number>(2);

  // ... rest of the useSimulator logic ...
};
// Move the entire useSimulator hook here
export const useTradeSimulator = useSimulator;