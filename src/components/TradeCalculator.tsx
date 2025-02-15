import { useState, useEffect } from 'react';
import { TradeSimulator, TradeSimulationResult } from '../trade-simulator';
import { InputField } from './shared/InputField';
import { ButtonGroup } from './shared/ButtonGroup';
import { RangeSlider } from './shared/RangeSlider';
import { SimulationResults } from './shared/SimulationResults';

interface TradeInputs {
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
};

const useSimulator = () => {
  const [inputs, setInputs] = useState<TradeInputs>(initialInputs);
  const [simulation, setSimulation] = useState<TradeSimulationResult | null>(null);
  const [riskRewardRatio, setRiskRewardRatio] = useState<number>(2); // Default 1:2 risk-reward ratio

  const handleInputChange = (field: keyof TradeInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    const updates: Partial<TradeInputs> = { [field]: numValue };

    if (field === 'price') {
      if (numValue > 0) {
        const ratio = riskRewardRatio;
        const riskAmount = numValue * 0.1; // Default 10% risk
        updates.sl = numValue - riskAmount;
        updates.tp = numValue + (riskAmount * ratio);
        if (inputs.quantity && inputs.leverage > 0) {
          updates.margin = TradeSimulator.calculateRequiredMargin(numValue, inputs.quantity, inputs.leverage);
        }
      }
    } else if (field === 'quantity') {
      if (numValue > 0 && inputs.price && inputs.leverage > 0) {
        updates.margin = TradeSimulator.calculateRequiredMargin(inputs.price, numValue, inputs.leverage);
      }
    } else if (field === 'leverage') {
      if (numValue > 0 && inputs.price && inputs.quantity) {
        updates.margin = TradeSimulator.calculateRequiredMargin(inputs.price, inputs.quantity, numValue);
      }
    } else if (field === 'tp') {
      if (numValue > 0 && inputs.price && inputs.sl) {
        const profitDistance = Math.abs(numValue - inputs.price);
        const riskDistance = Math.abs(inputs.sl - inputs.price);
        if (riskDistance > 0) {
          const newRatio = profitDistance / riskDistance;
          setRiskRewardRatio(newRatio);
        }
      }
    } else if (field === 'sl') {
      if (numValue > 0 && inputs.price && inputs.tp) {
        const profitDistance = Math.abs(inputs.tp - inputs.price);
        const riskDistance = Math.abs(numValue - inputs.price);
        if (riskDistance > 0) {
          const newRatio = profitDistance / riskDistance;
          setRiskRewardRatio(newRatio);
        }
      }
    }

    // Update liquidation price and maintenance margin
    if (field === 'price' || field === 'quantity' || field === 'leverage') {
      const price = field === 'price' ? numValue : inputs.price;
      const quantity = field === 'quantity' ? numValue : inputs.quantity;
      const leverage = field === 'leverage' ? numValue : inputs.leverage;

      if (price > 0 && quantity > 0 && leverage > 0) {
        const positionSize = price * quantity;
        updates.maintenanceMargin = positionSize * 0.005; // 0.5% maintenance margin
        const margin = TradeSimulator.calculateRequiredMargin(price, quantity, leverage);
        updates.liquidationPrice = price - ((margin - updates.maintenanceMargin) / (positionSize / price));
      }
    }

    setInputs(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    if (inputs.price && inputs.quantity && inputs.leverage && inputs.margin) {
      const simulator = new TradeSimulator(
        inputs.price,
        inputs.quantity,
        inputs.leverage,
        inputs.margin,
        inputs.makerFee,
        inputs.takerFee,
        inputs.tp || inputs.price * 1.1, // Default TP at 10% profit
        inputs.sl || inputs.price * 0.9, // Default SL at 10% loss
        inputs.orderType,
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
  const {
    inputs,
    setInputs,
    handleInputChange,
    simulation,
    riskRewardRatio,
    setRiskRewardRatio
  } = useSimulator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-8 text-white">
      <div className="max-w-6xl mx-auto bg-gray-800/30 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-700/50 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Trade Calculator</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    setInputs(prev => ({
                      ...prev,
                      tp: inputs.price + (riskAmount * ratio),
                      sl: inputs.price - riskAmount
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
          </div>
          <div className="space-y-6">
            <SimulationResults simulation={simulation} />
          </div>
        </div>
      </div>
    </div>
  );
};