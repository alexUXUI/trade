import { useEffect, useState } from 'react';
import {  TradeSimulationResult, TradeSimulator } from '../trade-simulator';
import { TradeInputs } from '../types/trade';


export const useTradeSimulator = () => {
  const [inputs, setInputs] = useState<TradeInputs>({
    price: 0,
    quantity: 0,
    leverage: 1,
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

  // Add new effect for risk/reward calculations
  useEffect(() => {
    if (inputs.price > 0) {
      const isLong = inputs.positionSide === 'long';
      const riskAmount = inputs.price * 0.1;
      const positionSize = inputs.price * inputs.quantity;

      setInputs(prev => ({
        ...prev,
        tp: isLong ? inputs.price + (riskAmount * riskRewardRatio) : inputs.price - (riskAmount * riskRewardRatio),
        sl: isLong ? inputs.price - riskAmount : inputs.price + riskAmount,
        maintenanceMargin: positionSize * 0.005,
        liquidationPrice: isLong 
          ? inputs.price * (1 - 1 / inputs.leverage)
          : inputs.price * (1 + 1 / inputs.leverage),
        margin: positionSize / inputs.leverage
      }));
    }
  }, [riskRewardRatio, inputs.price, inputs.positionSide, inputs.quantity, inputs.leverage]);

  const calculatePositionMetrics = (
    price: number,
    quantity: number,
    leverage: number,
    isLong: boolean
  ) => {
    const positionSize = price * quantity;
    const maintenanceMargin = positionSize * 0.005;
    const liquidationPrice = isLong
      ? price * (1 - 1 / leverage)
      : price * (1 + 1 / leverage);
  
    return {
      positionSize,
      maintenanceMargin,
      liquidationPrice,
      margin: positionSize / leverage
    };
  };
  
  const handleInputChange = (field: keyof TradeInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    const updates: Partial<TradeInputs> = { [field]: numValue };
    const isLong = inputs.positionSide === 'long';

    switch (field) {
      case 'leverage':
        if (numValue > 0 && inputs.price && inputs.quantity) {
          const metrics = calculatePositionMetrics(inputs.price, inputs.quantity, numValue, isLong);
          Object.assign(updates, metrics);
        }
        break;
  
      case 'price':
      case 'quantity':
        const price = field === 'price' ? numValue : inputs.price;
        const quantity = field === 'quantity' ? numValue : inputs.quantity;
  
        if (price && quantity && inputs.leverage > 0) {
          const positionSize = price * quantity;
          updates.margin = positionSize / inputs.leverage;
          updates.maintenanceMargin = positionSize * 0.005;
          updates.liquidationPrice = isLong ?
            price * (1 - 1 / inputs.leverage) :
            price * (1 + 1 / inputs.leverage);
  
          if (field === 'price') {
            const riskAmount = price * 0.1;
            updates.tp = isLong ?
              price + (riskAmount * riskRewardRatio) :
              price - (riskAmount * riskRewardRatio);
            updates.sl = isLong ?
              price - riskAmount :
              price + riskAmount;
          }
        }
        break;
  
      case 'tp':
        if (numValue > 0 && inputs.price && inputs.sl) {
          const riskDistance = Math.abs(inputs.sl - inputs.price);
          const profitDistance = Math.abs(numValue - inputs.price);
          if (riskDistance > 0) {
            const newRatio = isLong ?
              profitDistance / riskDistance :
              riskDistance / profitDistance;
            setRiskRewardRatio(newRatio);
          }
        }
        break;
  
      case 'sl':
        if (numValue > 0 && inputs.price && inputs.tp) {
          const profitDistance = Math.abs(inputs.tp - inputs.price);
          const riskDistance = Math.abs(numValue - inputs.price);
          if (riskDistance > 0) {
            const newRatio = isLong ?
              profitDistance / riskDistance :
              riskDistance / profitDistance;
            setRiskRewardRatio(newRatio);
          }
        }
        break;
    }

    setInputs(prev => ({ ...prev, ...updates }));
};
  
  useEffect(() => {
    if (inputs.price && inputs.quantity) {  // Removed other conditions to calculate earlier
      const simulator = new TradeSimulator(
        inputs.price,
        inputs.quantity,
        inputs.leverage,
        inputs.margin,
        inputs.makerFee,
        inputs.takerFee,
        inputs.tp || inputs.price * (inputs.positionSide === 'long' ? 1.1 : 0.9),
        inputs.sl || inputs.price * (inputs.positionSide === 'long' ? 0.9 : 1.1),
        inputs.orderType,
        // inputs.positionSide === 'long'
      );
      setSimulation(simulator.simulateTrade());
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
}