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

describe('Leverage Calculations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle safe leverage levels (<10x)', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('quantity', '1');
            result.current.handleInputChange('leverage', '5');
        });

        const positionSize = 100 * 1;
        expect(result.current.inputs.leverage).toBe(5);
        expect(result.current.inputs.margin).toBe(positionSize / 5);
        expect(result.current.inputs.maintenanceMargin).toBe(positionSize * 0.005);
        expect(result.current.inputs.liquidationPrice).toBe(80); // price * (1 - 1/leverage)
    });

    it('should handle moderate leverage levels (10x-25x)', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('quantity', '1');
            result.current.handleInputChange('leverage', '20');
        });

        const positionSize = 100 * 1;
        expect(result.current.inputs.leverage).toBe(20);
        expect(result.current.inputs.margin).toBe(positionSize / 20);
        expect(result.current.inputs.maintenanceMargin).toBe(positionSize * 0.005);
        expect(result.current.inputs.liquidationPrice).toBe(95); // price * (1 - 1/leverage)
    });

    it('should handle risky leverage levels (>25x)', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('quantity', '1');
            result.current.handleInputChange('leverage', '30');
        });

        const positionSize = 100 * 1;
        expect(result.current.inputs.leverage).toBe(30);
        expect(result.current.inputs.margin).toBe(positionSize / 30);
        expect(result.current.inputs.maintenanceMargin).toBe(positionSize * 0.005);
        expect(result.current.inputs.liquidationPrice).toBeCloseTo(96.67, 2); // price * (1 - 1/leverage)
    });

    it('should update liquidation price for short positions', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.setInputs(prev => ({ ...prev, positionSide: 'short' }));
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('quantity', '1');
            result.current.handleInputChange('leverage', '10');
        });

        expect(result.current.inputs.liquidationPrice).toBeCloseTo(110, 2); // price * (1 + 1/leverage)
    });

    it('should handle leverage change with existing position', () => {
        const { result } = renderHook(() => useTradeSimulator());

        // Set up initial position
        act(() => {
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('quantity', '1');
            result.current.handleInputChange('leverage', '10');
        });

        const initialPositionSize = 100 * 1;
        expect(result.current.inputs.margin).toBe(initialPositionSize / 10);

        // Change leverage
        act(() => {
            result.current.handleInputChange('leverage', '20');
        });

        // Position size should remain same, margin should decrease
        expect(result.current.inputs.margin).toBe(initialPositionSize / 20);
    });

    it('should validate minimum leverage', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('leverage', '0');
        });

        expect(result.current.inputs.leverage).toBe(0);
        expect(result.current.inputs.margin).toBe(0);
    });

    it('should recalculate position metrics when changing from low to high leverage', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('quantity', '1');
            result.current.handleInputChange('leverage', '5');
        });

        const initialLiquidationDistance = Math.abs(result.current.inputs.liquidationPrice - result.current.inputs.price);

        act(() => {
            result.current.handleInputChange('leverage', '25');
        });

        const newLiquidationDistance = Math.abs(result.current.inputs.liquidationPrice - result.current.inputs.price);
        expect(newLiquidationDistance).toBeLessThan(initialLiquidationDistance);
    });
});