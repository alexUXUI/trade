import { useState, useEffect } from 'react';
import { TradeSimulator, TradeSimulationResult } from '../trade-simulator';
import { InputField } from './shared/InputField';
import { ButtonGroup } from './shared/ButtonGroup';
import { RangeSlider } from './shared/RangeSlider';
import { TradeStrengthAnalysis } from './shared/TradeStrengthAnalysis';
import { PositionDetails } from './shared/PositionDetails';
import { TradeProvider, useTrade } from '../context/TradeContext';

export interface TradeInputs {
  price: number;
  quantity: number;
  leverage: number;
  margin: number;
  makerFee: number;
  takerFee: number;
  tp: number;
  sl: number;
  orderType: 'market' | 'limit' | 'trigger';
  positionType: 'isolated' | 'cross';
  marginPercent: number;
  maintenanceMargin: number;
  liquidationPrice: number;
  positionSide: 'long' | 'short';
}

const initialInputs: TradeInputs = {
  price: 0,
  quantity: 0,
  leverage: 1,
  margin: 0,
  makerFee: 0.02,
  takerFee: 0.06,
  tp: 0,
  sl: 0,
  orderType: 'market',
  positionType: 'isolated',
  marginPercent: 0,
  maintenanceMargin: 0,
  liquidationPrice: 0,
  positionSide: 'long',
};

// Change from useSimulator to useTradeSimulator
export const useTradeSimulator = () => {
  const [inputs, setInputs] = useState<TradeInputs>(initialInputs);
  const [simulation, setSimulation] = useState<TradeSimulationResult | null>(null);
  const [riskRewardRatio, setRiskRewardRatio] = useState<number>(2);

  const calculatePositionMetrics = (
    price: number,
    quantity: number,
    leverage: number,
    isLong: boolean
  ) => {
    const positionSize = price * quantity;
    const maintenanceMargin = positionSize * 0.005;
    const liquidationPrice = isLong
      ? price * (1 - 1 / leverage)
      : price * (1 + 1 / leverage);

    return {
      positionSize,
      maintenanceMargin,
      liquidationPrice,
      margin: positionSize / leverage
    };
  };

  const handleInputChange = (field: keyof TradeInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    const updates: Partial<TradeInputs> = { [field]: numValue };
    const isLong = inputs.positionSide === 'long';

    if (field === 'price' && numValue > 0) {
      // Immediately calculate TP and SL when price is entered
      const riskAmount = numValue * 0.1; // 10% risk
      updates.tp = isLong ?
        numValue + (riskAmount * riskRewardRatio) :
        numValue - (riskAmount * riskRewardRatio);
      updates.sl = isLong ?
        numValue - riskAmount :
        numValue + riskAmount;

      // Calculate other metrics if quantity exists
      if (inputs.quantity && inputs.leverage > 0) {
        const positionSize = numValue * inputs.quantity;
        updates.margin = positionSize / inputs.leverage;
        updates.maintenanceMargin = positionSize * 0.005;
        updates.liquidationPrice = isLong ?
          numValue * (1 - 1 / inputs.leverage) :
          numValue * (1 + 1 / inputs.leverage);
      }
    }
    switch (field) {
      case 'leverage':
        if (numValue > 0 && inputs.price && inputs.quantity) {
          const metrics = calculatePositionMetrics(inputs.price, inputs.quantity, numValue, isLong);
          Object.assign(updates, metrics);
        }
        break;

      case 'price':
      case 'quantity':
        const price = field === 'price' ? numValue : inputs.price;
        const quantity = field === 'quantity' ? numValue : inputs.quantity;

        if (price && quantity && inputs.leverage > 0) {
          const positionSize = price * quantity;
          updates.margin = positionSize / inputs.leverage;
          updates.maintenanceMargin = positionSize * 0.005;
          updates.liquidationPrice = isLong ?
            price * (1 - 1 / inputs.leverage) :
            price * (1 + 1 / inputs.leverage);

          if (field === 'price') {
            const riskAmount = price * 0.1;
            updates.tp = isLong ?
              price + (riskAmount * riskRewardRatio) :
              price - (riskAmount * riskRewardRatio);
            updates.sl = isLong ?
              price - riskAmount :
              price + riskAmount;
          }
        }
        break;

      case 'tp':
      case 'sl':
        if (numValue > 0 && inputs.price) {
          const profitDistance = Math.abs(
            field === 'tp' ? numValue - inputs.price : inputs.tp - inputs.price
          );
          const riskDistance = Math.abs(
            field === 'sl' ? numValue - inputs.price : inputs.sl - inputs.price
          );
          if (riskDistance > 0) {
            const newRatio = isLong ?
              profitDistance / riskDistance :
              riskDistance / profitDistance;
            setRiskRewardRatio(newRatio);
          }
        }
        break;
    }

    setInputs(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    if (inputs.price && inputs.quantity) {  // Removed other conditions to calculate earlier
      const simulator = new TradeSimulator(
        inputs.price,
        inputs.quantity,
        inputs.leverage,
        inputs.margin,
        inputs.makerFee,
        inputs.takerFee,
        inputs.tp || inputs.price * (inputs.positionSide === 'long' ? 1.1 : 0.9),
        inputs.sl || inputs.price * (inputs.positionSide === 'long' ? 0.9 : 1.1),
        inputs.orderType,
        // inputs.positionSide === 'long'
      );
      setSimulation(simulator.simulateTrade());
    }
  }, [inputs]);

  return {
    inputs,
    setInputs,
    handleInputChange,
    simulation,
    riskRewardRatio,
    setRiskRewardRatio
  };
}

export const TradeCalculator = () => {
  return (
    <TradeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-8 text-white">
        <div className="max-w-[1920px] mx-auto bg-gray-800/30 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-700/50 transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Trade Calculator
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <OrderForm />
            <PositionDetails />
            <TradeStrengthAnalysis />
          </div>
        </div>
      </div>
    </TradeProvider>
  );
};

const OrderForm = () => {
  const {
    inputs,
    setInputs,
    handleInputChange,
    riskRewardRatio,
    setRiskRewardRatio
  } = useTrade();

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="space-y-4 sm:space-y-6">
        <ButtonGroup
          label="Order Type"
          tooltip="Market orders execute immediately at current price with higher fees. Limit orders execute at your specified price or better with lower fees. Trigger orders (stop/take-profit) automatically execute when price reaches your target."
          options={[
            { value: 'market', label: 'Market' },
            { value: 'limit', label: 'Limit' },
            { value: 'trigger', label: 'Trigger' }
          ]}
          value={inputs.orderType}
          onChange={value => setInputs(prev => ({ ...prev, orderType: value as 'market' | 'limit' | 'trigger' }))}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Leverage"
            tooltip="Multiplier that increases your buying power. E.g., 10x leverage means you can open a position 10 times larger than your margin. Higher leverage means higher potential returns but also higher risk."
            value={inputs.leverage || ''}
            onChange={value => handleInputChange('leverage', value)}
            placeholder="Enter leverage"
          />
          <InputField
            label="Risk/Reward Ratio"
            tooltip="The ratio between your potential profit and risk. Enter the number of reward units for 1 unit of risk. For example, 2 means your take profit is twice the distance from entry as your stop loss."
            value={riskRewardRatio.toString()}
            onChange={value => {
              const ratio = parseFloat(value)
              setRiskRewardRatio(ratio);
              if (inputs.price) {
                const riskAmount = inputs.price * 0.1;
                const newTp = inputs.price + (riskAmount * ratio);
                const newSl = inputs.price - riskAmount;

                // Calculate new liquidation price and maintenance margin
                const positionSize = inputs.price * inputs.quantity;
                const maintenanceMargin = positionSize * 0.005;
                const margin = TradeSimulator.calculateRequiredMargin(inputs.price, inputs.quantity, inputs.leverage);
                const liquidationPrice = inputs.price - ((margin - maintenanceMargin) / (positionSize / inputs.price));

                setInputs(prev => ({
                  ...prev,
                  tp: newTp,
                  sl: newSl,
                  maintenanceMargin,
                  liquidationPrice
                }));
              }
            }}
            placeholder="Enter reward ratio"
          />
          <InputField
            label="Entry Price"
            tooltip="The current market price of the asset you want to trade. For market orders, this will be your execution price. For limit orders, this is your desired entry price."
            value={inputs.price || ''}
            onChange={value => handleInputChange('price', value)}
            placeholder="Enter price"
          />
          <InputField
            label="Quantity"
            tooltip="The number of units of the asset you want to trade. This affects your position size and required margin. Higher quantity means larger position size and higher potential profit/loss."
            value={inputs.quantity || ''}
            onChange={value => handleInputChange('quantity', value)}
            placeholder="Enter quantity"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Take Profit"
            tooltip="The price at which you want to take profit. This will be automatically calculated based on your risk/reward ratio but can be manually adjusted."
            value={inputs.tp || ''}
            onChange={value => handleInputChange('tp', value)}
            placeholder="Enter take profit price"
          />
          <InputField
            label="Stop Loss"
            tooltip="The price at which you want to cut losses. This will be automatically calculated based on your risk/reward ratio but can be manually adjusted."
            value={inputs.sl || ''}
            onChange={value => handleInputChange('sl', value)}
            placeholder="Enter stop loss price"
          />
          <InputField
            label="Margin"
            tooltip="The amount of collateral needed to open and maintain your position. This is calculated based on your position size and leverage."
            value={inputs.margin || ''}
            onChange={value => handleInputChange('margin', value)}
            placeholder="margin"
            readOnly
          />
        </div>
        {/* <ButtonGroup
              label="Position Type"
              tooltip="Isolated margin uses a fixed amount of collateral per position, limiting potential losses. Cross margin shares collateral across all positions, offering more flexibility but higher risk if multiple positions move against you."
              options={[
                { value: 'isolated', label: 'Isolated' },
                { value: 'cross', label: 'Cross' }
              ]}
              value={inputs.positionType}
              onChange={value => setInputs(prev => ({ ...prev, positionType: value as 'isolated' | 'cross' }))}
            /> */}
        <RangeSlider
          label="Position Size (%)"
          tooltip="Percentage of your available margin to use for this position. Higher percentage means larger position size relative to your collateral. Use this slider to quickly adjust your position size and required margin."
          value={inputs.marginPercent}
          onChange={percent => {
            setInputs(prev => ({
              ...prev,
              marginPercent: percent,
              margin: (prev.price * prev.quantity * percent) / (100 * prev.leverage)
            }));
          }}
        />
        <ButtonGroup
          label="Position Side"
          tooltip="Long positions profit when price goes up. Short positions profit when price goes down."
          options={[
            { value: 'long', label: 'Long' },
            { value: 'short', label: 'Short' }
          ]}
          value={inputs.positionSide}
          onChange={value => {
            const isLong = value === 'long';
            const price = inputs.price;
            if (price) {
              const riskAmount = price * 0.1;
              const newSl = isLong ? price - riskAmount : price + riskAmount;
              const newTp = isLong ? price + (riskAmount * riskRewardRatio) : price - (riskAmount * riskRewardRatio);

              const positionSize = price * inputs.quantity;
              const maintenanceMargin = positionSize * 0.005;
              const liquidationPrice = isLong
                ? price * (1 - 1 / inputs.leverage)
                : price * (1 + 1 / inputs.leverage);
              const margin = positionSize / inputs.leverage;

              setInputs(prev => ({
                ...prev,
                positionSide: value,
                tp: newTp,
                sl: newSl,
                maintenanceMargin,
                liquidationPrice,
                margin
              }) as any);
            } else {
              setInputs(prev => ({
                ...prev,
                positionSide: value
              }) as any);
            }
          }}
        />
      </div>
      {/* <div className="">
        <PositionDetails
          simulation={simulation}
          maintenanceMargin={inputs.maintenanceMargin}
          liquidationPrice={inputs.liquidationPrice}
          marginPercent={inputs.marginPercent}
          leverage={inputs.leverage}
          price={inputs.price}
          sl={inputs.sl}
          riskRewardRatio={riskRewardRatio}
        />
      </div>
      <TradeStrengthAnalysis
        simulation={simulation}
        maintenanceMargin={inputs.maintenanceMargin}
        liquidationPrice={inputs.liquidationPrice}
        marginPercent={inputs.marginPercent}
        leverage={inputs.leverage}
        price={inputs.price}
        sl={inputs.sl}
        riskRewardRatio={riskRewardRatio}
      /> */}
    </div>
  )
};