import { tradePipeline } from "../trade-pipeline";
import { TradeSimulator } from "../trade-simulator";
import { TradeInputs } from "../types/trade";

export const calculatePositionMetrics = (price: number, quantity: number, leverage: number, isLong: boolean) => {
    const positionSize = price * quantity;
    return {
        margin: positionSize / leverage,
        maintenanceMargin: positionSize * 0.005,
        liquidationPrice: isLong
            ? price * (1 - 1 / leverage)
            : price * (1 + 1 / leverage)
    };
};

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