import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useTradeSimulator } from '../useTradeSimulator';
import { TradeSimulator } from '../../trade-simulator';

// Mock TradeSimulator
jest.mock('../../trade-simulator', () => ({
  TradeSimulator: jest.fn().mockImplementation(() => ({
    simulateTrade: () => ({
      'Market Fee': 0.06,
      'Limit Fee': 0.02,
      'Profit at TP': 100
    })
  }))
}));

describe('useTradeSimulator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTradeSimulator());
    
    expect(result.current.inputs).toEqual({
      price: 0,
      quantity: 0,
      leverage: 2,
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
      positionSide: 'long'
    });
    expect(result.current.riskRewardRatio).toBe(2);
    expect(result.current.simulation).toBeNull();
  });

  it('should handle price input change for long position', () => {
    const { result } = renderHook(() => useTradeSimulator());

    act(() => {
      result.current.handleInputChange('price', '100');
    });

    expect(result.current.inputs.price).toBe(100);
    expect(result.current.inputs.tp).toBe(120); // price + (price * 0.1 * 2)
    expect(result.current.inputs.sl).toBe(90);  // price - (price * 0.1)
  });

  it('should handle price input change for short position', () => {
    const { result } = renderHook(() => useTradeSimulator());

    act(() => {
      result.current.setInputs(prev => ({ ...prev, positionSide: 'short' }));
      result.current.handleInputChange('price', '100');
    });

    expect(result.current.inputs.price).toBe(100);
    expect(result.current.inputs.tp).toBe(80);  // price - (price * 0.1 * 2)
    expect(result.current.inputs.sl).toBe(110); // price + (price * 0.1)
  });

  it('should calculate position metrics when leverage changes', () => {
    const { result } = renderHook(() => useTradeSimulator());

    act(() => {
      result.current.handleInputChange('price', '100');
      result.current.handleInputChange('quantity', '2');
      result.current.handleInputChange('leverage', '10');
    });

    expect(result.current.inputs.margin).toBe(20);        // positionSize / leverage
    expect(result.current.inputs.maintenanceMargin).toBe(1); // positionSize * 0.005
    expect(result.current.inputs.liquidationPrice).toBe(90); // price * (1 - 1/leverage)
  });

  it('should update risk/reward ratio when tp changes', () => {
    const { result } = renderHook(() => useTradeSimulator());

    act(() => {
      result.current.handleInputChange('price', '100');
      result.current.handleInputChange('sl', '90');
      result.current.handleInputChange('tp', '120');
    });

    expect(result.current.riskRewardRatio).toBe(2); // (120-100)/(100-90)
  });

  it('should update risk/reward ratio when sl changes', () => {
    const { result } = renderHook(() => useTradeSimulator());

    act(() => {
      result.current.handleInputChange('price', '100');
      result.current.handleInputChange('tp', '120');
      result.current.handleInputChange('sl', '90');
    });

    expect(result.current.riskRewardRatio).toBe(2); // (120-100)/(100-90)
  });

  it('should create simulation when price and quantity are set', () => {
    const { result } = renderHook(() => useTradeSimulator());

    act(() => {
      result.current.handleInputChange('price', '100');
      result.current.handleInputChange('quantity', '2');
    });

    expect(TradeSimulator).toHaveBeenCalled();
    expect(result.current.simulation).toEqual({
      'Market Fee': 0.06,
      'Limit Fee': 0.02,
      'Profit at TP': 100
    });
  });
});