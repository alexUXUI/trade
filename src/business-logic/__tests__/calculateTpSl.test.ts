import { calculateTpSl } from '../trade';

describe('calculateTpSl', () => {
  const price = 100;
  const riskRewardRatio = 2;
  const riskPercentage = 0.1; // 10%

  describe('Long position', () => {
    const isLong = true;

    it('should calculate take profit correctly for long position', () => {
      const result = calculateTpSl(price, isLong, riskRewardRatio);
      // TP = price * (1 + riskPercentage * riskRewardRatio)
      // TP = 100 * (1 + 0.1 * 2) = 100 * 1.2 = 120
      expect(result.tp).toBe(120);
    });

    it('should calculate stop loss correctly for long position', () => {
      const result = calculateTpSl(price, isLong, riskRewardRatio);
      // SL = price * (1 - riskPercentage)
      // SL = 100 * (1 - 0.1) = 100 * 0.9 = 90
      expect(result.sl).toBe(90);
    });
  });

  describe('Short position', () => {
    const isLong = false;

    it('should calculate take profit correctly for short position', () => {
      const result = calculateTpSl(price, isLong, riskRewardRatio);
      // TP = price * (1 - riskPercentage * riskRewardRatio)
      // TP = 100 * (1 - 0.1 * 2) = 100 * 0.8 = 80
      expect(result.tp).toBe(80);
    });

    it('should calculate stop loss correctly for short position', () => {
      const result = calculateTpSl(price, isLong, riskRewardRatio);
      // SL = price * (1 + riskPercentage)
      // SL = 100 * (1 + 0.1) = 100 * 1.1 = 110
      expect(result.sl).toBe(110);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero price', () => {
      const result = calculateTpSl(0, true, riskRewardRatio);
      expect(result.tp).toBe(0);
      expect(result.sl).toBe(0);
    });

    it('should handle negative price', () => {
      const result = calculateTpSl(-100, true, riskRewardRatio);
      expect(result.tp).toBe(-120);
      expect(result.sl).toBe(-90);
    });

    it('should handle zero risk reward ratio', () => {
      const result = calculateTpSl(price, true, 0);
      expect(result.tp).toBe(100);
      expect(result.sl).toBe(90);
    });

    it('should handle negative risk reward ratio', () => {
      const result = calculateTpSl(price, true, -2);
      expect(result.tp).toBe(80);
      expect(result.sl).toBe(90);
    });
  });
});