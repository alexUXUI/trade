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
  tp: number;  // Add this
  sl: number;  // Add this
  tradeStrength: {
    score: number;
    rating: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
    color: 'red' | 'orange' | 'yellow' | 'green' | 'purple';
  };
};

const calculatePositionMetrics = (price: number, quantity: number, leverage: number, isLong: boolean) => {
  // Handle all edge cases
  if (!price || !quantity) {
    return {
      positionSize: 0,
      margin: 0,
      maintenanceMargin: 0,
      liquidationPrice: 0
    };
  }

  const positionSize = price * quantity;
  // Always calculate with actual leverage value
  const liquidationPrice = isLong 
    ? price * (1 - 1/leverage)
    : price * (1 + 1/leverage);

  return {
    positionSize,
    margin: leverage < 1 ? 0 : positionSize / leverage,
    maintenanceMargin: leverage < 1 ? 0 : positionSize * 0.005,
    liquidationPrice: leverage < 1 ? 0 : liquidationPrice
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

const calculateTPSLWithRRR = (price: number, isLong: boolean, riskRewardRatio: number, inputTP?: number, inputSL?: number) => {
  const roundToPrice = (value: number) => Math.round(value * 100) / 100;
  
  // If both TP and SL are provided, calculate actual RRR
  if (inputTP && inputSL) {
    const profit = Math.abs(price - inputTP);
    const loss = Math.abs(price - inputSL);
    return {
      tp: roundToPrice(inputTP),
      sl: roundToPrice(inputSL),
      actualRRR: loss > 0 ? roundToPrice(profit / loss) : riskRewardRatio
    };
  }

  // Calculate default values based on RRR
  const defaultRiskPercent = 0.1; // 10%
  const riskAmount = price * defaultRiskPercent;
  
  const defaultTP = isLong
    ? price + (riskAmount * riskRewardRatio)
    : price - (riskAmount * riskRewardRatio);
  
  const defaultSL = isLong
    ? price - riskAmount
    : price + riskAmount;

  return {
    tp: roundToPrice(inputTP || defaultTP),
    sl: roundToPrice(inputSL || defaultSL),
    actualRRR: riskRewardRatio
  };
};

export const tradePipeline = (inputs: TradeInputs, riskRewardRatio: number = 2): TradeMetrics => {
  const isLong = inputs.positionSide === 'long';
  const { price, quantity, leverage } = inputs;

  // Calculate base position metrics
  const positionMetrics = calculatePositionMetrics(
    price,
    quantity,
    leverage,
    isLong
  );

  // Round calculations to avoid floating point precision issues
  const roundToPrice = (value: number) => Math.round(value * 100) / 100;

  // Validate and adjust TP/SL based on position side
  const _tp = inputs.tp ? (
    isLong 
      ? roundToPrice(Math.max(price, inputs.tp))
      : roundToPrice(Math.min(price, inputs.tp))
  ) : (
    isLong
      ? roundToPrice(price * (1 + 0.1 * riskRewardRatio))
      : roundToPrice(price * (1 - 0.1 * riskRewardRatio))
  );

  const _sl = inputs.sl ? (
    isLong
      ? roundToPrice(Math.min(price, inputs.sl))
      : roundToPrice(Math.max(price, inputs.sl))
  ) : (
    isLong
      ? roundToPrice(price * 0.9)
      : roundToPrice(price * 1.1)
  );

  // Calculate TP/SL and actual RRR
  const { tp: tpOut, sl: slOut, actualRRR } = calculateTPSLWithRRR(
    price,
    isLong,
    riskRewardRatio,
    _tp,
    _sl
  );

  // Use actualRRR from the calculation instead of computing it again
  const dynamicRiskReward = actualRRR;

  // Calculate risk metrics with validated TP/SL
  const potentialLoss = Math.abs(price - slOut) * positionMetrics.positionSize;
  const potentialProfit = Math.abs(price - tpOut) * positionMetrics.positionSize;
  const stopLossDistance = Math.abs(((price - slOut) / price) * 100);
  const takeProfitDistance = Math.abs(((price - tpOut) / price) * 100);
  
  // Calculate dynamic risk/reward based on validated values
  // const dynamicRiskReward = potentialLoss > 0 ? potentialProfit / potentialLoss : 0;

  // Calculate fee impact
  const feeImpact = calculateFeeImpact(
    positionMetrics.positionSize,
    inputs.makerFee,
    inputs.takerFee
  );

  // Calculate trade strength with all metrics
  const tradeStrength = calculateTradeStrength({
    ...positionMetrics,
    stopLossDistance,
    takeProfitDistance,
    potentialProfit,
    potentialLoss,
    riskRewardRatio: dynamicRiskReward,
    feeImpact,
    tp: tpOut,
    sl: slOut
  }); // Removed tradeStrength from here

  return {
    ...positionMetrics,
    stopLossDistance,
    takeProfitDistance,
    potentialProfit,
    potentialLoss,
    riskRewardRatio: dynamicRiskReward, // Fixed variable name from actualRiskReward
    feeImpact,
    tp: tpOut,
    sl: slOut,
    tradeStrength
  };
};