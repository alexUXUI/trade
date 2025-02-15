import { useEffect, useState } from 'react';
import { TradeSimulationResult, TradeSimulator } from '../trade-simulator';
import { TradeInputs } from '../types/trade';
import { tradePipeline } from '../trade-pipeline';

const calculatePositionMetrics = (price: number, quantity: number, leverage: number, isLong: boolean) => {
  const positionSize = price * quantity;
  return {
    margin: positionSize / leverage,
    maintenanceMargin: positionSize * 0.005,
    liquidationPrice: isLong
      ? price * (1 - 1/leverage)
      : price * (1 + 1/leverage)
  };
};

const calculateTpSl = (price: number, isLong: boolean, riskRewardRatio: number) => {
  const riskPercentage = 0.1;
  return {
    tp: isLong
      ? price * (1 + riskPercentage * riskRewardRatio)
      : price * (1 - riskPercentage * riskRewardRatio),
    sl: isLong
      ? price * (1 - riskPercentage)
      : price * (1 + riskPercentage)
  };
};

const handlePriceQuantityChange = (
  inputs: TradeInputs,
  field: 'price' | 'quantity',
  value: number,
  riskRewardRatio: number
) => {
  const newInputs = { ...inputs, [field]: value };
  const isLong = newInputs.positionSide === 'long';
  
  const metrics = calculatePositionMetrics(
    newInputs.price,
    newInputs.quantity,
    newInputs.leverage,
    isLong
  );
  
  const { tp, sl } = calculateTpSl(newInputs.price, isLong, riskRewardRatio);

  return {
    ...newInputs,
    ...metrics,
    tp,
    sl
  };
};

const handleLeverageChange = (inputs: TradeInputs, value: number) => {
  const validLeverage = Math.max(0, value);
  const newInputs = { ...inputs, leverage: validLeverage };
  const isLong = newInputs.positionSide === 'long';

  const metrics = calculatePositionMetrics(
    newInputs.price,
    newInputs.quantity,
    validLeverage,
    isLong
  );

  return {
    ...newInputs,
    ...metrics
  };
};

const handlePositionSideChange = (inputs: TradeInputs, value: string) => {
  const newInputs = { ...inputs, positionSide: value };
  const isLong = value === 'long';
  
  const { liquidationPrice } = calculatePositionMetrics(
    newInputs.price,
    newInputs.quantity,
    newInputs.leverage,
    isLong
  );

  return { ...newInputs, liquidationPrice };
};

const updateMetrics = (inputs: TradeInputs, riskRewardRatio: number) => {
  const newMetrics = tradePipeline(inputs, riskRewardRatio);
  return {
    ...inputs,
    margin: newMetrics.margin,
    maintenanceMargin: newMetrics.maintenanceMargin,
    liquidationPrice: newMetrics.liquidationPrice,
    tp: newMetrics.tp,
    sl: newMetrics.sl
  };
};

const simulateTrade = (inputs: TradeInputs) => {
  if (!inputs.price || !inputs.quantity) return null;
  
  const simulator = new TradeSimulator(
    inputs.price,
    inputs.quantity,
    inputs.leverage,
    inputs.margin,
    inputs.makerFee,
    inputs.takerFee,
    inputs.tp,
    inputs.sl,
    inputs.orderType
  );
  return simulator.simulateTrade();
};

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

    if (field === 'price' || field === 'quantity') {
      setInputs(handlePriceQuantityChange(inputs, field, Math.max(0, numValue), riskRewardRatio));
      return;
    }

    if (field === 'leverage') {
      setInputs(handleLeverageChange(inputs, numValue));
      return;
    }

    if (field === 'tp' || field === 'sl') {
      setInputs(prev => ({ ...prev, [field]: numValue }));
      return;
    }

    if (field === 'positionSide') {
      setInputs(handlePositionSideChange(inputs, value));
      return;
    }

    setInputs(prev => ({ ...prev, [field]: numValue }));
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