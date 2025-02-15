import { TradeSimulationResult } from '../../trade-simulator';
import clsx from 'clsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TooltipWrapper } from './TooltipWrapper';
import { DonutChart } from './Charts';
import { calculateTradeStrength } from '../../utils/trade-strength';
import { TradeStrengthAnalysis } from './TradeStrengthAnalysis';

interface SimulationResultsProps {
  simulation: TradeSimulationResult | null;
  maintenanceMargin?: number;
  liquidationPrice?: number;
  isLong?: boolean;
  marginPercent?: number;
  leverage?: number;
  price?: number;
  sl?: number;
  riskRewardRatio?: number;
}

export const SimulationResults = ({ 
  simulation, 
  maintenanceMargin, 
  liquidationPrice, 
  isLong = true,
  marginPercent = 0,
  leverage = 1,
  price = 0,
  sl = 0,
  riskRewardRatio = 0
}: SimulationResultsProps) => {
  const tradeStrength = simulation ? calculateTradeStrength(
    price,
    riskRewardRatio,
    leverage,
    liquidationPrice || 0,
    marginPercent,
    sl,
    simulation['Market Fee'] || simulation['Limit Fee'] || 0,
    Math.abs(simulation['Profit at TP'])
  ) : null;

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Position Details</h3>
          {tradeStrength && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Trade Strength:</span>
              <span className={`font-medium ${tradeStrength.color}`}>
                {tradeStrength.label} ({tradeStrength.score})
              </span>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {/* {!simulation && (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Enter your trade parameters to see detailed simulation results</p>
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>)} */}
          <div className="grid grid-cols-2 gap-4">
            <TooltipWrapper label="Position Size" tooltip="Total value of the position = Entry Price × Quantity">
              <div className="p-3 bg-gray-700/20 rounded-lg">
                <p className={clsx('text-lg font-medium', simulation?.['Position Size'] ? 'text-white' : 'text-gray-500')}>
                  ${simulation?.['Position Size']?.toFixed(2) || '0.00'}
                </p>
              </div>
            </TooltipWrapper>

            <TooltipWrapper label="Fees" tooltip="Trading fees = Position Size × (Market Fee Rate or Limit Fee Rate)">
              <div className="p-3 bg-gray-700/20 rounded-lg">
                <p className={clsx('text-lg font-medium', simulation?.['Market Fee'] || simulation?.['Limit Fee'] ? 'text-white' : 'text-gray-500')}>
                  ${(simulation?.['Market Fee'] || simulation?.['Limit Fee'])?.toFixed(2) || '0.00'}
                </p>
              </div>
            </TooltipWrapper>

            <TooltipWrapper label="Potential Profit" tooltip="Potential profit = |Take Profit - Entry Price| × Quantity - Fees">
              <div className="p-3 bg-gray-700/20 rounded-lg">
                <p className={clsx('text-lg font-medium',
                  !simulation?.['Profit at TP'] ? 'text-gray-500' : 'text-green-400'
                )}>
                  ${simulation?.['Profit at TP'] ? Math.abs(simulation['Profit at TP']).toFixed(2) : '0.00'}
                </p>
              </div>
            </TooltipWrapper>

            <TooltipWrapper label="Potential Loss" tooltip="Potential loss = |Stop Loss - Entry Price| × Quantity + Fees">
              <div className="p-3 bg-gray-700/20 rounded-lg">
                <p className={clsx('text-lg font-medium',
                  simulation?.['Loss at SL'] ? 'text-red-400' : 'text-gray-500'
                )}>
                  ${simulation ? Math.abs(simulation['Loss at SL']).toFixed(2) : '0.00'}
                </p>
              </div>
            </TooltipWrapper>

            <TooltipWrapper label="Maintenance Margin" tooltip="Minimum margin required to keep position open = Position Size × 0.5% (0.005)">
              <div className="p-3 bg-gray-700/20 rounded-lg">
                <p className={clsx('text-lg font-medium',
                  maintenanceMargin ? 'text-yellow-400' : 'text-gray-500'
                )}>
                  ${maintenanceMargin?.toFixed(2) || '0.00'}
                </p>
              </div>
            </TooltipWrapper>

            <TooltipWrapper label="Liquidation Price" tooltip="Price at which position is liquidated. For longs: Entry × (1 - 1/Leverage). For shorts: Entry × (1 + 1/Leverage)">
              <div className="p-3 bg-gray-700/20 rounded-lg">
                <p className={clsx('text-lg font-medium',
                  liquidationPrice ? 'text-red-500' : 'text-gray-500'
                )}>
                  ${liquidationPrice?.toFixed(2) || '0.00'}
                </p>
              </div>
            </TooltipWrapper>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-6">
          <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Risk/Reward Distribution</h3>
            <div className="h-[200px]">
              <DonutChart
                data={simulation ? [
                  { name: 'Potential Profit', value: Math.abs(simulation['Profit at TP']) },
                  { name: 'Potential Loss', value: Math.abs(simulation['Loss at SL']) },
                  { name: 'Fees', value: simulation['Market Fee'] || simulation['Limit Fee'] || 0 }
                ] : []}
                colors={['#4ade80', '#f87171', '#60a5fa']}
                showFees={true}
              />
            </div>
            <div className="flex justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-gray-300">Profit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-gray-300">Loss</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-gray-300">Fees</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      {tradeStrength && (
        <TradeStrengthAnalysis strength={tradeStrength} />
      )}
    </div>
  );
};