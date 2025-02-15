import { TradeInputs } from '../types/trade';

type TradeMetrics = {
  positionSize: number;
  margin: number;
  maintenanceMargin: number;
  liquidationPrice: number;
  stopLossDistance: number;
  takeProfitDistance: number;
  potentialProfit: number;
  potentialLoss: number;
  riskRewardRatio: number;
  feeImpact: number;
  tradeStrength: {
    score: number;
    rating: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
    color: 'red' | 'orange' | 'yellow' | 'green' | 'purple';
  };
};

const calculatePositionMetrics = (price: number, quantity: number, leverage: number, isLong: boolean) => {
  const positionSize = price * quantity;
  return {
    positionSize,
    margin: positionSize / leverage,
    maintenanceMargin: positionSize * 0.005,
    liquidationPrice: isLong ? price * (1 - 1/leverage) : price * (1 + 1/leverage)
  };
};

const calculateRiskMetrics = (price: number, sl: number, tp: number, positionSize: number) => {
  const stopLossDistance = Math.abs(((price - sl) / price) * 100);
  const takeProfitDistance = Math.abs(((price - tp) / price) * 100);
  const potentialLoss = Math.abs(price - sl) * positionSize;
  const potentialProfit = Math.abs(price - tp) * positionSize;
  
  return {
    stopLossDistance,
    takeProfitDistance,
    potentialLoss,
    potentialProfit,
    riskRewardRatio: potentialProfit / potentialLoss
  };
};

const calculateFeeImpact = (positionSize: number, makerFee: number, takerFee: number) => {
  const totalFees = (makerFee + takerFee) * positionSize;
  return totalFees;
};

const calculateTradeStrength = (metrics: Partial<TradeMetrics>) => {
  let score = 0;
  
  // RRR (30% weight)
  if (metrics.riskRewardRatio) {
    if (metrics.riskRewardRatio < 1.5) score -= 2;
    else if (metrics.riskRewardRatio <= 2.5) score += 3;
    else score += 5;
  }

  // Liquidation distance (20% weight)
  if (metrics.liquidationPrice && metrics.positionSize) {
    const liquidationDistance = Math.abs((metrics.liquidationPrice - metrics.positionSize) / metrics.positionSize * 100);
    if (liquidationDistance < 5) score -= 3;
    else if (liquidationDistance <= 15) score += 2;
    else score += 4;
  }

  // Stop loss distance (10% weight)
  if (metrics.stopLossDistance) {
    if (metrics.stopLossDistance < 1) score -= 2;
    else if (metrics.stopLossDistance <= 5) score += 3;
    else score -= 2;
  }

  // Fee impact (5% weight)
  if (metrics.feeImpact && metrics.potentialProfit) {
    const feePercentage = (metrics.feeImpact / metrics.potentialProfit) * 100;
    if (feePercentage > 10) score -= 2;
    else if (feePercentage <= 5) score += 3;
    else score += 2;
  }

  const getRating = (score: number): "Very Weak" | "Weak" | "Moderate" | "Strong" | "Very Strong" => {
    if (score < 5) return "Very Weak";
    if (score < 10) return "Weak";
    if (score < 15) return "Moderate";
    if (score < 20) return "Strong";
    return "Very Strong";
  };

  const getColor = (score: number): "red" | "orange" | "yellow" | "green" | "purple" => {
    if (score < 5) return "red";
    if (score < 10) return "orange";
    if (score < 15) return "yellow";
    if (score < 20) return "green";
    return "purple";
  };

  return {
    score,
    rating: getRating(score),
    color: getColor(score)
  };
};

export const tradePipeline = (inputs: TradeInputs): TradeMetrics => {
  const isLong = inputs.positionSide === 'long';
  
  // Step 1: Position metrics
  const positionMetrics = calculatePositionMetrics(
    inputs.price,
    inputs.quantity,
    inputs.leverage,
    isLong
  );

  // Step 2: Risk metrics
  const riskMetrics = calculateRiskMetrics(
    inputs.price,
    inputs.sl,
    inputs.tp,
    positionMetrics.positionSize
  );

  // Step 3: Fee impact
  const feeImpact = calculateFeeImpact(
    positionMetrics.positionSize,
    inputs.makerFee,
    inputs.takerFee
  );

  // Step 4: Trade strength
  const tradeStrength = calculateTradeStrength({
    ...positionMetrics,
    ...riskMetrics,
    feeImpact
  });

  return {
    ...positionMetrics,
    ...riskMetrics,
    feeImpact,
    tradeStrength
  };
};