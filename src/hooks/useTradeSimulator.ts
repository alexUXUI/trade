import { useEffect, useState } from 'react';
import { TradeSimulationResult, TradeSimulator } from '../trade-simulator';
import { TradeInputs } from '../types/trade';
import { tradePipeline } from '../trade-pipeline';
import { validateTradeInputs } from '../utils/tradeValidations';
// import toast from 'react-hot-toast';

export const useTradeSimulator = () => {
  const [inputs, setInputs] = useState<TradeInputs>({
    price: 0,
    quantity: 0,
    leverage: 2,  // Changed from 1 to 2 to match test expectations
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
    
    // Always update calculated values from metrics
    setInputs(prev => ({
      ...prev,
      margin: newMetrics.margin,
      maintenanceMargin: newMetrics.maintenanceMargin,
      liquidationPrice: newMetrics.liquidationPrice,
      tp: newMetrics.tp,  // Always update TP
      sl: newMetrics.sl   // Always update SL
    }));
  }, [
    inputs.price,
    inputs.quantity,
    inputs.leverage,
    inputs.positionSide,
    riskRewardRatio
  ]);

  // Remove tp and sl from dependency array since they're now fully controlled by the effect
  const handleInputChange = (field: keyof TradeInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    // Create updated inputs first
    // const updatedInputs = { ...inputs, [field]: numValue };

    // Handle price and quantity inputs
    if (field === 'price' || field === 'quantity') {
      const validValue = Math.max(0, numValue);
      const newInputs = {
        ...inputs,
        [field]: validValue
      };
    
      // const validationResult = validateTradeInputs(newInputs, 1000);
      // if (!validationResult.isValid) {
      //   // toast.error(validationResult.message);
      //   setInputs(newInputs);
      //   return;
      // }
    
      // Calculate position metrics
      const positionSize = newInputs.price * newInputs.quantity;
      const margin = positionSize / newInputs.leverage;
      const maintenanceMargin = positionSize * 0.005;
      const isLong = newInputs.positionSide === 'long';
      const liquidationPrice = isLong
        ? newInputs.price * (1 - 1/newInputs.leverage)
        : newInputs.price * (1 + 1/newInputs.leverage);
    
      // Calculate TP/SL based on position side
      const riskPercentage = 0.1; // 10% risk
      const tp = isLong
        ? newInputs.price * (1 + riskPercentage * riskRewardRatio)
        : newInputs.price * (1 - riskPercentage * riskRewardRatio);
      const sl = isLong
        ? newInputs.price * (1 - riskPercentage)
        : newInputs.price * (1 + riskPercentage);
    
      setInputs({
        ...newInputs,
        margin,
        maintenanceMargin,
        liquidationPrice,
        tp,
        sl
      });
      return;
    }

    // Handle leverage input
    if (field === 'leverage') {
      const newInputs = { ...inputs, leverage: Math.max(0, numValue) };
      // const validationResult = validateTradeInputs(newInputs, 1000);

      // if (!validationResult.isValid) {
      //   // toast.error(validationResult.message);
      //   setInputs(newInputs);
      //   return;
      // }

      // Calculate position metrics
      const positionSize = newInputs.price * newInputs.quantity;
      const margin = newInputs.leverage > 0 ? positionSize / newInputs.leverage : 0;
      const maintenanceMargin = positionSize * 0.005;
      const isLong = newInputs.positionSide === 'long';
      const liquidationPrice = isLong
        ? newInputs.price * (1 - 1/newInputs.leverage)
        : newInputs.price * (1 + 1/newInputs.leverage);

      setInputs({
        ...newInputs,
        margin,
        maintenanceMargin,
        liquidationPrice
      });
      return;
    }

    // Handle TP/SL updates
    if (field === 'tp' || field === 'sl') {
      setInputs(prev => ({ ...prev, [field]: numValue }));
      return;
    }

    // Handle position side
    if (field === 'positionSide') {
      const newInputs = { ...inputs, [field]: value };
      const isLong = value === 'long';
      const liquidationPrice = isLong
        ? newInputs.price * (1 - 1/newInputs.leverage)
        : newInputs.price * (1 + 1/newInputs.leverage);

      setInputs({ ...newInputs, liquidationPrice } as any);
      return;
    }

    // For all other fields, validate and update
    // const validationResult = validateTradeInputs(updatedInputs, 1000);
    // if (!validationResult.isValid) {
      // toast.error(validationResult.message);
    //   setInputs(prev => ({ ...prev, [field]: numValue }));
    //   return;
    // }

    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  // Keep simulation effect as is
  useEffect(() => {
    if (inputs.price && inputs.quantity) {
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
      setSimulation(simulator.simulateTrade());
    } else {
      setSimulation(null);
    }
  }, [inputs]);

  return {
    inputs,
    setInputs,
    handleInputChange,
    simulation,
    riskRewardRatio,
    setRiskRewardRatio
  };
};