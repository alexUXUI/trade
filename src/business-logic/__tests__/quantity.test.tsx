import { renderHook } from '@testing-library/react';
import { useTradeSimulator } from '../useTradeSimulator';
import { act } from '@testing-library/react';

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

describe('Quantity Calculations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update position size when quantity changes', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('quantity', '2');
        });

        const expectedPositionSize = 100 * 2;
        expect(result.current.inputs.margin).toBe(expectedPositionSize / result.current.inputs.leverage);
    });

    it('should update maintenance margin based on position size', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('quantity', '2');
        });

        const positionSize = 100 * 2;
        expect(result.current.inputs.maintenanceMargin).toBeCloseTo(positionSize * 0.005, 6);
    });

    it('should handle zero quantity', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('quantity', '0');
        });

        expect(result.current.inputs.margin).toBe(0);
        expect(result.current.inputs.maintenanceMargin).toBe(0);
    });

    it('should recalculate margins when quantity changes with leverage', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('leverage', '10');
            result.current.handleInputChange('quantity', '2');
        });

        const positionSize = 100 * 2;
        expect(result.current.inputs.margin).toBe(positionSize / 10);
        expect(result.current.inputs.maintenanceMargin).toBeCloseTo(positionSize * 0.005, 6);
    });

    it('should maintain correct profit calculations when quantity changes', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('quantity', '2');
        });

        const simulator = result.current.simulation;
        expect(simulator).toBeTruthy();
        expect(simulator?.['Profit at TP']).toBe(100);
    });

    it('should handle quantity changes for short positions', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.setInputs(prev => ({ ...prev, positionSide: 'short' }));
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('quantity', '2');
        });

        const positionSize = 100 * 2;
        expect(result.current.inputs.margin).toBe(positionSize / result.current.inputs.leverage);
        expect(result.current.inputs.maintenanceMargin).toBeCloseTo(positionSize * 0.005, 6);
    });

    it('should update position metrics when changing from small to large quantity', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('quantity', '1');
        });

        const initialMargin = result.current.inputs.margin;

        act(() => {
            result.current.handleInputChange('quantity', '5');
        });

        expect(result.current.inputs.margin).toBe(initialMargin * 5);
    });

    it('should handle decimal quantities', () => {
        const { result } = renderHook(() => useTradeSimulator());

        act(() => {
            result.current.handleInputChange('price', '100');
            result.current.handleInputChange('quantity', '0.5');
        });

        const positionSize = 100 * 0.5;
        expect(result.current.inputs.margin).toBe(positionSize / result.current.inputs.leverage);
        expect(result.current.inputs.maintenanceMargin).toBeCloseTo(positionSize * 0.005, 6);
    });
});