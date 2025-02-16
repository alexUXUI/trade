import { calculatePositionMetrics } from '../trade';

describe('calculatePositionMetrics', () => {
  it('should calculate metrics correctly for long position', () => {
    const price = 100;
    const quantity = 10;
    const leverage = 5;
    const isLong = true;

    const result = calculatePositionMetrics(price, quantity, leverage, isLong);

    expect(result.margin).toBe(200); // positionSize / leverage = 1000 / 5
    expect(result.maintenanceMargin).toBe(5); // positionSize * 0.005 = 1000 * 0.005
    expect(result.liquidationPrice).toBe(80); // price * (1 - 1/leverage) = 100 * (1 - 1/5)
  });

  it('should calculate metrics correctly for short position', () => {
    const price = 100;
    const quantity = 10;
    const leverage = 5;
    const isLong = false;

    const result = calculatePositionMetrics(price, quantity, leverage, isLong);

    expect(result.margin).toBe(200); // positionSize / leverage = 1000 / 5
    expect(result.maintenanceMargin).toBe(5); // positionSize * 0.005 = 1000 * 0.005
    expect(result.liquidationPrice).toBe(120); // price * (1 + 1/leverage) = 100 * (1 + 1/5)
  });

  it('should handle zero quantity', () => {
    const price = 100;
    const quantity = 0;
    const leverage = 5;
    const isLong = true;

    const result = calculatePositionMetrics(price, quantity, leverage, isLong);

    expect(result.margin).toBe(0);
    expect(result.maintenanceMargin).toBe(0);
    expect(result.liquidationPrice).toBe(80);
  });

  it('should handle zero price', () => {
    const price = 0;
    const quantity = 10;
    const leverage = 5;
    const isLong = true;

    const result = calculatePositionMetrics(price, quantity, leverage, isLong);

    expect(result.margin).toBe(0);
    expect(result.maintenanceMargin).toBe(0);
    expect(result.liquidationPrice).toBe(0);
  });

  it('should handle minimum leverage of 1', () => {
    const price = 100;
    const quantity = 10;
    const leverage = 1;
    const isLong = true;

    const result = calculatePositionMetrics(price, quantity, leverage, isLong);

    expect(result.margin).toBe(1000); // positionSize / leverage = 1000 / 1
    expect(result.maintenanceMargin).toBe(5);
    expect(result.liquidationPrice).toBe(0); // price * (1 - 1/1) = 100 * 0
  });
});