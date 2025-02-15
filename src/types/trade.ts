import { TradeSimulationResult } from '../trade-simulator';

export interface TradeInputs {
  price: number;
  quantity: number;
  leverage: number;
  margin: number;
  makerFee: number;
  takerFee: number;
  tp: number;
  sl: number;
  orderType: 'market' | 'limit' | 'trigger';
  positionType: 'isolated' | 'cross';
  marginPercent: number;
  maintenanceMargin: number;
  liquidationPrice: number;
  positionSide: 'long' | 'short';
}

export interface TradeContextType {
  inputs: TradeInputs;
  setInputs: React.Dispatch<React.SetStateAction<TradeInputs>>;
  handleInputChange: (field: keyof TradeInputs, value: string) => void;
  simulation: TradeSimulationResult | null;
  riskRewardRatio: number;
  setRiskRewardRatio: React.Dispatch<React.SetStateAction<number>>;
}