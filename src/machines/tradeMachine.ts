import { createMachine, assign } from 'xstate';
import { TradeInputs } from '../types/trade';

interface TradeContext {
  inputs: TradeInputs;
  derived: {
    positionSize: number;
    stopLossDistance: number;
    riskRewardRatio: number;
    maintenanceMargin: number;
    liquidationPrice: number;
    margin: number;
  };
}

// Add to TradeEvent type
type TradeEvent = 
  | { type: 'UPDATE_PRICE'; value: number }
  | { type: 'UPDATE_QUANTITY'; value: number }
  | { type: 'UPDATE_LEVERAGE'; value: number }
  | { type: 'UPDATE_SL'; value: number }
  | { type: 'UPDATE_TP'; value: number }
  | { type: 'UPDATE_RISK_REWARD_RATIO'; value: number }
  | { type: 'TOGGLE_POSITION_SIDE' };

const calculateDerivedValues = (context: TradeContext) => {
  const { inputs } = context;
  const isLong = inputs.positionSide === 'long';
  const positionSize = inputs.price * inputs.quantity;
  
  return {
    positionSize,
    stopLossDistance: Math.abs(((inputs.price - inputs.sl) / inputs.price) * 100),
    maintenanceMargin: positionSize * 0.005,
    liquidationPrice: isLong 
      ? inputs.price * (1 - 1/inputs.leverage)
      : inputs.price * (1 + 1/inputs.leverage),
    margin: positionSize / inputs.leverage,
    riskRewardRatio: inputs.sl && inputs.tp 
      ? Math.abs(inputs.tp - inputs.price) / Math.abs(inputs.sl - inputs.price)
      : 2
  };
};

export const tradeMachine = createMachine<TradeContext, TradeEvent>({
  id: 'trade',
  initial: 'idle',
  context: {
    inputs: {
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
    },
    derived: {
      positionSize: 0,
      stopLossDistance: 0,
      riskRewardRatio: 2,
      maintenanceMargin: 0,
      liquidationPrice: 0,
      margin: 0,
    }
  },
  states: {
    idle: {
      on: {
        '*': {
          target: 'calculating',
          actions: assign({
            inputs: (context, event) => {
              switch (event.type) {
                case 'UPDATE_PRICE':
                case 'UPDATE_QUANTITY':
                case 'UPDATE_LEVERAGE':
                case 'UPDATE_SL':
                case 'UPDATE_TP':
                  return { ...context.inputs, [event.type.split('_')[1].toLowerCase()]: event.value };
                case 'TOGGLE_POSITION_SIDE':
                  return { ...context.inputs, positionSide: context.inputs.positionSide === 'long' ? 'short' : 'long' };
                default:
                  return context.inputs;
              }
            }
          })
        }
      }
    },
    calculating: {
      always: {
        target: 'ready',
        actions: assign({
          derived: (context) => calculateDerivedValues(context)
        })
      }
    },
    ready: {
      on: {
        '*': 'calculating'
      }
    }
  }
});