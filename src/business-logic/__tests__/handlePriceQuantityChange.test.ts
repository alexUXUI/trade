import { TradeInputs } from '../../types/trade';
import { handlePriceQuantityChange } from '../trade';

// Mock dependencies
jest.mock('../trade.logic', () => ({
  ...jest.requireActual('../trade.logic'),
  calculatePositionMetrics: jest.fn().mockReturnValue({
    margin: 100,
    maintenanceMargin: 0.5,
    liquidationPrice: 90
  }),
  calculateTpSl: jest.fn().mockReturnValue({
    tp: 110,
    sl: 90
  })
}));

describe('handlePriceQuantityChange', () => {
  const mockInputs: TradeInputs = {
    price: 100,
    quantity: 1,
    leverage: 2,
    margin: 50,
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
  };

  it('should handle price change for long position', () => {
    const result = handlePriceQuantityChange(mockInputs, 'price', 120, 2);

    expect(result).toEqual({
      ...mockInputs,
      price: 120,
      margin: 100,
      maintenanceMargin: 0.5,
      liquidationPrice: 90,
      tp: 110,
      sl: 90
    });
  });

  it('should handle quantity change for long position', () => {
    const result = handlePriceQuantityChange(mockInputs, 'quantity', 2, 2);

    expect(result).toEqual({
      ...mockInputs,
      quantity: 2,
      margin: 100,
      maintenanceMargin: 0.5,
      liquidationPrice: 90,
      tp: 110,
      sl: 90
    });
  });

  it('should handle price change for short position', () => {
    const shortInputs = {
      ...mockInputs,
      positionSide: 'short'
    };

    const result = handlePriceQuantityChange(shortInputs, 'price', 120, 2);

    expect(result).toEqual({
      ...shortInputs,
      price: 120,
      margin: 100,
      maintenanceMargin: 0.5,
      liquidationPrice: 90,
      tp: 110,
      sl: 90
    });
  });

  it('should handle different risk reward ratios', () => {
    const result = handlePriceQuantityChange(mockInputs, 'price', 100, 3);

    expect(result).toEqual({
      ...mockInputs,
      price: 100,
      margin: 100,
      maintenanceMargin: 0.5,
      liquidationPrice: 90,
      tp: 110,
      sl: 90
    });
  });
});