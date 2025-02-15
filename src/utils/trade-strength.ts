export interface TradeStrengthScore {
  score: number;
  label: string;
  color: string;
  details: {
    factor: string;
    score: number;
    reason: string;
  }[];
}

export const calculateTradeStrength = (
  price: number,
  rrr: number,
  leverage: number,
  liquidationPrice: number,
  marginPercent: number,
  sl: number,
  fees: number,
  potentialProfit: number
): TradeStrengthScore => {
  const details: TradeStrengthScore['details'] = [];
  let totalScore = 0;

  // 1. Risk-Reward Ratio (30% weight)
  if (rrr < 1.5) {
    details.push({ factor: 'Risk/Reward Ratio', score: -2, reason: 'Weak RRR' });
    totalScore -= 2;
  } else if (rrr <= 2.5) {
    details.push({ factor: 'Risk/Reward Ratio', score: 3, reason: 'Good RRR' });
    totalScore += 3;
  } else {
    details.push({ factor: 'Risk/Reward Ratio', score: 5, reason: 'Strong RRR' });
    totalScore += 5;
  }

  // 2. Leverage (20% weight)
  if (leverage > 25) {
    details.push({ factor: 'Leverage', score: -3, reason: 'Very Risky' });
    totalScore -= 3;
  } else if (leverage >= 10) {
    details.push({ factor: 'Leverage', score: 2, reason: 'Moderate Risk' });
    totalScore += 2;
  } else {
    details.push({ factor: 'Leverage', score: 5, reason: 'Safe' });
    totalScore += 5;
  }

  // 3. Liquidation Distance (20% weight)
  const liquidationDistance = Math.abs((liquidationPrice - price) / price) * 100;
  if (liquidationDistance < 5) {
    details.push({ factor: 'Liquidation Distance', score: -3, reason: 'High Risk' });
    totalScore -= 3;
  } else if (liquidationDistance <= 15) {
    details.push({ factor: 'Liquidation Distance', score: 2, reason: 'Moderate Risk' });
    totalScore += 2;
  } else {
    details.push({ factor: 'Liquidation Distance', score: 4, reason: 'Safe' });
    totalScore += 4;
  }

  // 4. Margin Allocation (15% weight)
  if (marginPercent > 50) {
    details.push({ factor: 'Margin Allocation', score: -3, reason: 'Overexposed' });
    totalScore -= 3;
  } else if (marginPercent >= 10) {
    details.push({ factor: 'Margin Allocation', score: 3, reason: 'Balanced' });
    totalScore += 3;
  } else {
    details.push({ factor: 'Margin Allocation', score: 5, reason: 'Conservative' });
    totalScore += 5;
  }

  // 5. Stop Loss Distance (10% weight)
  const slDistance = Math.abs((sl - price) / price) * 100;
  if (slDistance < 1) {
    details.push({ factor: 'Stop Loss Distance', score: -2, reason: 'Too Tight' });
    totalScore -= 2;
  } else if (slDistance <= 5) {
    details.push({ factor: 'Stop Loss Distance', score: 3, reason: 'Balanced' });
    totalScore += 3;
  } else {
    details.push({ factor: 'Stop Loss Distance', score: -2, reason: 'Too Loose' });
    totalScore -= 2;
  }

  // 6. Fee Impact (5% weight)
  const feeImpact = (fees / potentialProfit) * 100;
  if (feeImpact > 10) {
    details.push({ factor: 'Fee Impact', score: -2, reason: 'High Impact' });
    totalScore -= 2;
  } else if (feeImpact >= 5) {
    details.push({ factor: 'Fee Impact', score: 2, reason: 'Moderate' });
    totalScore += 2;
  } else {
    details.push({ factor: 'Fee Impact', score: 3, reason: 'Negligible' });
    totalScore += 3;
  }

  // Calculate final rating
  let label: string;
  let color: string;
  if (totalScore < 5) {
    label = 'Very Weak ❌';
    color = 'text-red-500';
  } else if (totalScore < 11) {
    label = 'Weak ⚠️';
    color = 'text-orange-500';
  } else if (totalScore < 16) {
    label = 'Moderate ✅';
    color = 'text-yellow-500';
  } else if (totalScore < 21) {
    label = 'Strong 💪';
    color = 'text-green-500';
  } else {
    label = 'Very Strong 🚀';
    color = 'text-purple-500';
  }

  return {
    score: totalScore,
    label,
    color,
    details
  };
};