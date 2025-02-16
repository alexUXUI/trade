import { renderHook, act } from '@testing-library/react';
import { useTradeSimulator } from '../useTradeSimulator';

describe('TP/SL Calculations', () => {
  it('should calculate correct TP/SL values for long position', () => {
    const { result } = renderHook(() => useTradeSimulator());

    act(() => {
      result.current.handleInputChange('price', '10');
      result.current.handleInputChange('quantity', '5');
      result.current.handleInputChange('leverage', '2');
    });

    expect(result.current.inputs.tp).toBe(12); // price + (price * 0.1 * RRR)
    expect(result.current.inputs.sl).toBe(9);  // price - (price * 0.1)
  });

  it('should calculate correct TP/SL values for short position', () => {
    const { result } = renderHook(() => useTradeSimulator());

    act(() => {
      result.current.handleInputChange('price', '10');
      result.current.handleInputChange('quantity', '5');
      result.current.handleInputChange('leverage', '2');
      result.current.setInputs(prev => ({ ...prev, positionSide: 'short' }));
    });

    expect(result.current.inputs.tp).toBe(8);  // price - (price * 0.1 * RRR)
    expect(result.current.inputs.sl).toBe(11); // price + (price * 0.1)
  });
});