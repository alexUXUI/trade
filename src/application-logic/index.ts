import { TradeMetrics, calculatePositionMetrics, calculateTPSLWithRRR, calculateFeeImpact, calculateTradeStrength } from '../business-logic/trade';
import { TradeInputs } from '../types/trade';


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