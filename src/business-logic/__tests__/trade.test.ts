import { TradeInputs } from '../../types/trade';
import { calculatePositionMetrics } from '../trade';

// Mock the calculatePositionMetrics function
jest.mock('../trade.logic', () => ({
    calculatePositionMetrics: jest.fn().mockImplementation((price, quantity, leverage, isLong) => ({
        margin: (price * quantity) / leverage,
        maintenanceMargin: price * quantity * 0.005,
        liquidationPrice: isLong
            ? price * (1 - 1 / leverage)
            : price * (1 + 1 / leverage)
    }))
}));

describe('handleLeverageChange', () => {
    const handleLeverageChange = (inputs: TradeInputs, value: number) => {
        const validLeverage = Math.max(0, value);
        const newInputs = { ...inputs, leverage: validLeverage };
        const isLong = newInputs.positionSide === 'long';

        const metrics = calculatePositionMetrics(
            newInputs.price,
            newInputs.quantity,
            validLeverage,
            isLong
        );

        return {
            ...newInputs,
            ...metrics
        };
    };

    const mockInputs: TradeInputs = {
        price: 100,
        quantity: 10,
        leverage: 2,
        margin: 500,
        makerFee: 0.02,
        takerFee: 0.06,
        tp: 110,
        sl: 90,
        orderType: 'market',
        positionType: 'isolated',
        marginPercent: 0,
        maintenanceMargin: 5,
        liquidationPrice: 50,
        positionSide: 'long'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle positive leverage value', () => {
        const result = handleLeverageChange(mockInputs, 5);

        expect(result.leverage).toBe(5);
        expect(calculatePositionMetrics).toHaveBeenCalledWith(100, 10, 5, true);
        expect(result.margin).toBe(200); // (100 * 10) / 5
        expect(result.maintenanceMargin).toBe(5); // 100 * 10 * 0.005
        expect(result.liquidationPrice).toBe(80); // 100 * (1 - 1/5)
    });

    it('should handle zero leverage value', () => {
        const result = handleLeverageChange(mockInputs, 0);

        expect(result.leverage).toBe(0);
        expect(calculatePositionMetrics).toHaveBeenCalledWith(100, 10, 0, true);
    });

    it('should handle negative leverage value and convert to zero', () => {
        const result = handleLeverageChange(mockInputs, -5);

        expect(result.leverage).toBe(0);
        expect(calculatePositionMetrics).toHaveBeenCalledWith(100, 10, 0, true);
    });

    it('should handle short position side', () => {
        const shortInputs = { ...mockInputs, positionSide: 'short' };
        const result = handleLeverageChange(shortInputs, 5);

        expect(result.leverage).toBe(5);
        expect(calculatePositionMetrics).toHaveBeenCalledWith(100, 10, 5, false);
        expect(result.liquidationPrice).toBe(120); // 100 * (1 + 1/5)
    });

    it('should preserve other input values', () => {
        const result = handleLeverageChange(mockInputs, 5);

        expect(result.price).toBe(mockInputs.price);
        expect(result.quantity).toBe(mockInputs.quantity);
        expect(result.makerFee).toBe(mockInputs.makerFee);
        expect(result.takerFee).toBe(mockInputs.takerFee);
        expect(result.tp).toBe(mockInputs.tp);
        expect(result.sl).toBe(mockInputs.sl);
        expect(result.orderType).toBe(mockInputs.orderType);
        expect(result.positionType).toBe(mockInputs.positionType);
    });
});