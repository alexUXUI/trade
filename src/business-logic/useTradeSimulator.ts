import { useEffect, useState } from 'react';
import { TradeSimulationResult } from '../trade-simulator';
import { TradeInputs } from '../types/trade';
import { tradePipeline } from '../trade-pipeline';
import { updateMetrics, simulateTrade, handlePriceQuantityChange, handleLeverageChange, handlePositionSideChange } from './trade';

export const useTradeSimulator = () => {
  const [inputs, setInputs] = useState<TradeInputs>({
    price: 0,
    quantity: 0,
    leverage: 2,
    margin: 0,
    makerFee: 0.02,
    takerFee: 0.06,
    tp: 0,
    sl: 0,
    orderType: 'market' as const,
    positionType: 'isolated',
    marginPercent: 0,
    maintenanceMargin: 0,
    liquidationPrice: 0,
    positionSide: 'long',
  });
  const [simulation, setSimulation] = useState<TradeSimulationResult | null>(null);
  const [riskRewardRatio, setRiskRewardRatio] = useState<number>(2);
  const [_metrics, setMetrics] = useState(() => tradePipeline(inputs, riskRewardRatio));

  useEffect(() => {
    const newMetrics = tradePipeline(inputs, riskRewardRatio);
    setMetrics(newMetrics);
    setInputs(prev => updateMetrics(prev, riskRewardRatio));
  }, [inputs.price, inputs.quantity, inputs.leverage, inputs.positionSide, riskRewardRatio]);

  useEffect(() => {
    setSimulation(simulateTrade(inputs));
  }, [inputs]);

  const handleInputChange = (field: keyof TradeInputs, value: string) => {
    const numValue = parseFloat(value) || 0;

    switch (field) {
      case 'price':
      case 'quantity':
        setInputs(handlePriceQuantityChange(inputs, field, Math.max(0, numValue), riskRewardRatio));
        return;

      case 'leverage':
        setInputs(handleLeverageChange(inputs, numValue));
        return;

      case 'tp':
      case 'sl':
        setInputs(prev => ({ ...prev, [field]: numValue }));
        return;

      case 'positionSide':
        if (value !== 'long' && value !== 'short') return;
        setInputs(handlePositionSideChange(inputs, value));
        return;

      default:
        setInputs(prev => ({ ...prev, [field]: numValue }));
        return;
    }
  };

  return {
    inputs,
    setInputs,
    handleInputChange,
    simulation,
    riskRewardRatio,
    setRiskRewardRatio
  };
};