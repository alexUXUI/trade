import { useEffect, useState } from 'react';
import {  TradeSimulationResult, TradeSimulator } from '../trade-simulator';
import { TradeInputs } from '../components/TradeCalculator';

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
  
      if (field === 'price' && numValue > 0) {
        // Immediately calculate TP and SL when price is entered
        const riskAmount = numValue * 0.1; // 10% risk
        updates.tp = isLong ?
          numValue + (riskAmount * riskRewardRatio) :
          numValue - (riskAmount * riskRewardRatio);
        updates.sl = isLong ?
          numValue - riskAmount :
          numValue + riskAmount;
  
        // Calculate other metrics if quantity exists
        if (inputs.quantity && inputs.leverage > 0) {
          const positionSize = numValue * inputs.quantity;
          updates.margin = positionSize / inputs.leverage;
          updates.maintenanceMargin = positionSize * 0.005;
          updates.liquidationPrice = isLong ?
            numValue * (1 - 1 / inputs.leverage) :
            numValue * (1 + 1 / inputs.leverage);
        }
      }
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
        case 'sl':
          if (numValue > 0 && inputs.price) {
            const profitDistance = Math.abs(
              field === 'tp' ? numValue - inputs.price : inputs.tp - inputs.price
            );
            const riskDistance = Math.abs(
              field === 'sl' ? numValue - inputs.price : inputs.sl - inputs.price
            );
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