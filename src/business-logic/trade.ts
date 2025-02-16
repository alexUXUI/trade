import { tradePipeline } from "../application-logic";
import { TradeSimulator } from "../trade-simulator";
import { TradeInputs } from "../types/trade";

// export const calculatePositionMetrics = (price: number, quantity: number, leverage: number, isLong: boolean) => {
//     const positionSize = price * quantity;
//     return {
//         margin: positionSize / leverage,
//         maintenanceMargin: positionSize * 0.005,
//         liquidationPrice: isLong
//             ? price * (1 - 1 / leverage)
//             : price * (1 + 1 / leverage)
//     };
// };

export const calculateTpSl = (price: number, isLong: boolean, riskRewardRatio: number) => {
    const riskPercentage = 0.1;
    return {
        tp: isLong
            ? price * (1 + riskPercentage * riskRewardRatio)
            : price * (1 - riskPercentage * riskRewardRatio),
        sl: isLong
            ? price * (1 - riskPercentage)
            : price * (1 + riskPercentage)
    };
};

export const handlePriceQuantityChange = (
    inputs: TradeInputs,
    field: 'price' | 'quantity',
    value: number,
    riskRewardRatio: number
) => {
    const newInputs = { ...inputs, [field]: value };
    const isLong = newInputs.positionSide === 'long';

    const metrics = calculatePositionMetrics(
        newInputs.price,
        newInputs.quantity,
        newInputs.leverage,
        isLong
    );

    const { tp, sl } = calculateTpSl(newInputs.price, isLong, riskRewardRatio);

    return {
        ...newInputs,
        ...metrics,
        tp,
        sl
    };
};

export const handleLeverageChange = (inputs: TradeInputs, value: number) => {
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

export const handlePositionSideChange = (inputs: TradeInputs, value: any) => {
    const newInputs = { ...inputs, positionSide: value };
    const isLong = value === 'long';

    const { liquidationPrice } = calculatePositionMetrics(
        newInputs.price,
        newInputs.quantity,
        newInputs.leverage,
        isLong
    );

    return { ...newInputs, liquidationPrice };
};

export const updateMetrics = (inputs: TradeInputs, riskRewardRatio: number) => {
    const newMetrics = tradePipeline(inputs, riskRewardRatio);
    return {
        ...inputs,
        margin: newMetrics.margin,
        maintenanceMargin: newMetrics.maintenanceMargin,
        liquidationPrice: newMetrics.liquidationPrice,
        tp: newMetrics.tp,
        sl: newMetrics.sl
    };
};

export const simulateTrade = (inputs: TradeInputs) => {
    if (!inputs.price || !inputs.quantity) return null;

    const simulator = new TradeSimulator(
        inputs.price,
        inputs.quantity,
        inputs.leverage,
        inputs.margin,
        inputs.makerFee,
        inputs.takerFee,
        inputs.tp,
        inputs.sl,
        inputs.orderType
    );
    return simulator.simulateTrade();
};

export type TradeMetrics = {
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

export const calculatePositionMetrics = (price: number, quantity: number, leverage: number, isLong: boolean) => {
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
        ? price * (1 - 1 / leverage)
        : price * (1 + 1 / leverage);

    return {
        positionSize,
        margin: leverage < 1 ? 0 : positionSize / leverage,
        maintenanceMargin: leverage < 1 ? 0 : positionSize * 0.005,
        liquidationPrice: leverage < 1 ? 0 : liquidationPrice
    };
};

export const calculateFeeImpact = (positionSize: number, makerFee: number, takerFee: number) => {
    const totalFees = (makerFee + takerFee) * positionSize;
    return totalFees;
};

export const calculateTradeStrength = (metrics: Partial<TradeMetrics>) => {
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

export const calculateTPSLWithRRR = (price: number, isLong: boolean, riskRewardRatio: number, inputTP?: number, inputSL?: number) => {
    const roundToPrice = (value: number) => Math.round(value * 100) / 100;

    // If both TP and SL are provided, calculate actual RRR
    if (inputTP && inputSL) {
        const profit = isLong ? inputTP - price : price - inputTP;
        const loss = isLong ? price - inputSL : inputSL - price;
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