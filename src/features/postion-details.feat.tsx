import clsx from 'clsx';
import { DonutChart } from '../design-system/Charts';
import { TooltipWrapper } from '../design-system/TooltipWrapper';
import { useTrade } from '../application-logic/TradeContext';

export const PositionDetails = () => {
    const {
        simulation,
        inputs: { maintenanceMargin, liquidationPrice },
    } = useTrade();

    return (
        <div className="neo-outset rounded-xl p-6 border border-gray-700/10">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Position Details</h3>
            <div className="mt-6 pt-6 border-t border-gray-700/10">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <TooltipWrapper label="Position Size" tooltip="Total value of the position = Entry Price × Quantity">
                            <div className="neo-stat p-4 rounded-xl">
                                <p className={clsx('text-lg font-medium', simulation?.['Position Size'] ? 'text-white' : 'text-gray-500')}>
                                    ${simulation?.['Position Size']?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                        </TooltipWrapper>
                        <TooltipWrapper label="Fees" tooltip="Trading fees = Position Size × (Market Fee Rate or Limit Fee Rate)">
                            <div className="neo-stat p-4 rounded-xl">
                                <p className={clsx('text-lg font-medium', simulation?.['Market Fee'] || simulation?.['Limit Fee'] ? 'text-white' : 'text-gray-500')}>
                                    ${(simulation?.['Market Fee'] || simulation?.['Limit Fee'])?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                        </TooltipWrapper>
                        <TooltipWrapper label="Potential Profit" tooltip="Potential profit = |Take Profit - Entry Price| × Quantity - Fees">
                            <div className="neo-stat p-4 rounded-xl">
                                <p className={clsx('text-lg font-medium',
                                    !simulation?.['Profit at TP'] ? 'text-gray-500' : 'text-green-400'
                                )}>
                                    ${simulation?.['Profit at TP'] ? Math.abs(simulation['Profit at TP']).toFixed(2) : '0.00'}
                                </p>
                            </div>
                        </TooltipWrapper>
                        <TooltipWrapper label="Potential Loss" tooltip="Potential loss = |Stop Loss - Entry Price| × Quantity + Fees">
                            <div className="neo-stat p-4 rounded-xl">
                                <p className={clsx('text-lg font-medium',
                                    simulation?.['Loss at SL'] ? 'text-red-400' : 'text-gray-500'
                                )}>
                                    ${simulation ? Math.abs(simulation['Loss at SL']).toFixed(2) : '0.00'}
                                </p>
                            </div>
                        </TooltipWrapper>
                        <TooltipWrapper label="Maintenance Margin" tooltip="Minimum margin required to keep position open = Position Size × 0.5% (0.005)">
                            <div className="neo-stat p-4 rounded-xl">
                                <p className={clsx('text-lg font-medium',
                                    maintenanceMargin ? 'text-yellow-400' : 'text-gray-500'
                                )}>
                                    ${maintenanceMargin?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                        </TooltipWrapper>
                        <TooltipWrapper label="Liquidation Price" tooltip="Price at which position is liquidated. For longs: Entry × (1 - 1/Leverage). For shorts: Entry × (1 + 1/Leverage)">
                            <div className="neo-stat p-4 rounded-xl">
                                <p className={clsx('text-lg font-medium',
                                    liquidationPrice ? 'text-red-500' : 'text-gray-500'
                                )}>
                                    ${liquidationPrice?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                        </TooltipWrapper>
                    </div>
                </div>
                <div className="mt-6">
                    <div className="neo-outset rounded-xl p-6 border border-gray-700/10">
                        <h3 className="text-xl font-semibold mb-4 text-gray-200">Risk/Reward Distribution</h3>
                        <div className="h-[200px]">
                            <DonutChart
                                data={[
                                    { name: 'Profit', value: simulation?.['Profit at TP'] ? Math.abs(simulation['Profit at TP']) : 0 },
                                    { name: 'Loss', value: simulation?.['Loss at SL'] ? Math.abs(simulation['Loss at SL']) : 0 },
                                    { name: 'Fees', value: simulation?.['Market Fee'] || simulation?.['Limit Fee'] || 0 }
                                ]}
                                colors={['#4ade80', '#f87171', '#60a5fa']}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
