import { useEffect, useState } from 'react';
import { TradeSimulationResult, TradeSimulator } from '../trade-simulator';
import { TradeInputs } from '../types/trade';
import { tradePipeline } from '../trade-pipeline';

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
  const [metrics, setMetrics] = useState(() => tradePipeline(inputs, riskRewardRatio));

  // Single useEffect for all calculations
  useEffect(() => {
    const newMetrics = tradePipeline(inputs, riskRewardRatio);
    setMetrics(newMetrics);
    
    // Only update calculated values from metrics
    setInputs(prev => ({
      ...prev,
      margin: newMetrics.margin,
      maintenanceMargin: newMetrics.maintenanceMargin,
      liquidationPrice: newMetrics.liquidationPrice,
      // Only update TP/SL if they haven't been manually set
      ...(prev.tp === 0 && { tp: newMetrics.tp }),
      ...(prev.sl === 0 && { sl: newMetrics.sl })
    }));
  }, [
    inputs.price,
    inputs.quantity,
    inputs.leverage,
    inputs.positionSide,
    riskRewardRatio
  ]);

  const handleInputChange = (field: keyof TradeInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    if (field === 'tp' || field === 'sl') {
      setInputs(prev => ({ ...prev, [field]: numValue }));
      // Trigger metrics recalculation with new TP/SL
      const updatedInputs = { ...inputs, [field]: numValue };
      const newMetrics = tradePipeline(updatedInputs, riskRewardRatio);
      setMetrics(newMetrics);
      return;
    }

    if (field === 'price' || field === 'quantity') {
      const validValue = Math.max(0, numValue);
      setInputs(prev => ({
        ...prev,
        [field]: validValue,
        // Reset TP/SL when price changes
        ...(field === 'price' && { tp: 0, sl: 0 })
      }));
      return;
    }

    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  // Keep simulation effect as is
  useEffect(() => {
    if (inputs.price && inputs.quantity) {
      const simulator = new TradeSimulator(
        inputs.price,
        inputs.quantity,
        inputs.leverage,
        metrics.margin,
        inputs.makerFee,
        inputs.takerFee,
        metrics.tp,
        metrics.sl,
        inputs.orderType
      );
      setSimulation(simulator.simulateTrade());
    }
  }, [metrics]);

  return {
    inputs,
    setInputs,
    handleInputChange,
    simulation,
    metrics,
    riskRewardRatio,
    setRiskRewardRatio
  };
};