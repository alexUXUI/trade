import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useTradeSimulator } from '../useTradeSimulator';

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

describe('Entry Price Calculations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update position size when entry price changes', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('quantity', '2');
            result.current.handleInputChange('price', '100');
        });

        const expectedPositionSize = 100 * 2;
        expect(result.current.inputs.margin).toBe(expectedPositionSize / result.current.inputs.leverage);
    });

    xit('should update liquidation price based on entry price for long position', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('leverage', '10');
        });

        expect(result.current.inputs.liquidationPrice).toBe(90); // price * (1 - 1/leverage)
    });

    xit('should update liquidation price based on entry price for short position', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.setInputs(prev => ({ ...prev, positionSide: 'short' }));
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('leverage', '10');
        });

        expect(result.current.inputs.liquidationPrice).toBeCloseTo(110, 6); // Using toBeCloseTo for floating point
    });

    it('should update take profit and stop loss distances when entry price changes', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '100');
        });

        const riskAmount = 100 * 0.1; // 10% of entry price
        expect(result.current.inputs.tp).toBe(100 + (riskAmount * 2)); // Default RR ratio is 2
        expect(result.current.inputs.sl).toBe(100 - riskAmount);
    });

    it('should maintain risk/reward ratio when entry price changes', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('sl', '90');
            result.current.handleInputChange('tp', '120');
        });

        const initialRatio = result.current.riskRewardRatio;

        act(() => {
            result.current.handleInputChange('price', '200');
        });

        expect(result.current.riskRewardRatio).toBe(initialRatio);
    });

    it('should handle zero entry price', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '0');
        });

        expect(result.current.inputs.tp).toBe(0);
        expect(result.current.inputs.sl).toBe(0);
        expect(result.current.inputs.liquidationPrice).toBe(0);
    });

    it('should update maintenance margin when entry price changes', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('quantity', '2');
            result.current.handleInputChange('price', '100');
        });

        const positionSize = 100 * 2;
        expect(result.current.inputs.maintenanceMargin).toBe(positionSize * 0.005);
    });

    it('should handle negative entry prices', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '-100');
        });

        expect(result.current.inputs.price).toBeCloseTo(0, 6); // Using toBeCloseTo for consistency
    });

    it('should update take profit and stop loss for short positions when entry price changes', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.setInputs(prev => ({ ...prev, positionSide: 'short' }));
            result.current.handleInputChange('price', '100');
        });

        const riskAmount = 100 * 0.1;
        expect(result.current.inputs.tp).toBe(100 - (riskAmount * 2)); // Short position TP is below entry
        expect(result.current.inputs.sl).toBe(100 + riskAmount); // Short position SL is above entry
    });
});