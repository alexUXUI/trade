import { ButtonGroup } from "../components/shared/ButtonGroup";
import { InputField } from "../components/shared/InputField";
import { RangeSlider } from "../components/shared/RangeSlider";
import { useTrade } from "../state/TradeContext";
import { TradeSimulator } from "../trade-simulator";

export const Order = () => {
    const {
        inputs,
        setInputs,
        handleInputChange,
        riskRewardRatio,
        setRiskRewardRatio
    } = useTrade();

    return (
        <div className="neo-outset rounded-xl p-6 border border-gray-700/10">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Order</h3>
            <div className="mt-6 pt-6 border-t border-gray-700/10">
                <div className="space-y-4 sm:space-y-6 ">
                    <ButtonGroup
                        label="Order Type"
                        tooltip="Market orders execute immediately at current price with higher fees. Limit orders execute at your specified price or better with lower fees. Trigger orders (stop/take-profit) automatically execute when price reaches your target."
                        options={[
                            { value: 'market', label: 'Market' },
                            { value: 'limit', label: 'Limit' },
                            { value: 'trigger', label: 'Trigger' }
                        ]}
                        value={inputs.orderType}
                        onChange={(value: any) => setInputs(prev => ({ ...prev, orderType: value as 'market' | 'limit' | 'trigger' }))}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Leverage"
                            tooltip="Multiplier that increases your buying power. E.g., 10x leverage means you can open a position 10 times larger than your margin. Higher leverage means higher potential returns but also higher risk."
                            value={inputs.leverage || ''}
                            onChange={value => handleInputChange('leverage', value)}
                            placeholder="leverage"
                        />
                        <InputField
                            label="Risk/Reward Ratio"
                            tooltip="The ratio between your potential profit and risk. the number of reward units for 1 unit of risk. For example, 2 means your take profit is twice the distance from entry as your stop loss."
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
                            placeholder="reward ratio"
                        />
                        <InputField
                            label="Entry Price"
                            tooltip="The current market price of the asset you want to trade. For market orders, this will be your execution price. For limit orders, this is your desired entry price."
                            value={inputs.price || ''}
                            onChange={value => handleInputChange('price', value)}
                            placeholder="0"
                        />
                        <InputField
                            label="Quantity"
                            tooltip="The number of units of the asset you want to trade. This affects your position size and required margin. Higher quantity means larger position size and higher potential profit/loss."
                            value={inputs.quantity || ''}
                            onChange={value => handleInputChange('quantity', value)}
                            placeholder="0"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Take Profit"
                            tooltip="The price at which you want to take profit. This will be automatically calculated based on your risk/reward ratio but can be manually adjusted."
                            value={inputs.tp || ''}
                            onChange={value => handleInputChange('tp', value)}
                            placeholder="0"
                        />
                        <InputField
                            label="Stop Loss"
                            tooltip="The price at which you want to cut losses. This will be automatically calculated based on your risk/reward ratio but can be manually adjusted."
                            value={inputs.sl || ''}
                            onChange={value => handleInputChange('sl', value)}
                            placeholder="0"
                        />
                        <InputField
                            label="Margin"
                            tooltip="The amount of collateral needed to open and maintain your position. This is calculated based on your position size and leverage."
                            value={inputs.margin || ''}
                            onChange={value => handleInputChange('margin', value)}
                            placeholder="0"
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
                        onChange={(value: 'long' | 'short') => {
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

                                return setInputs(prev => ({
                                    ...prev,
                                    positionSide: value,
                                    tp: newTp,
                                    sl: newSl,
                                    maintenanceMargin,
                                    liquidationPrice,
                                    margin
                                })) as any
                            } else {
                                return setInputs(prev => ({
                                    ...prev,
                                    positionSide: value
                                }) as any);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};