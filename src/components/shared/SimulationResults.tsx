import { TradeSimulationResult } from '../../trade-simulator';
import clsx from 'clsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SimulationResultsProps {
  simulation: TradeSimulationResult | null;
}

export const SimulationResults = ({ simulation }: SimulationResultsProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">Simulation Results</h3>
        {!simulation ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Enter your trade parameters to see detailed simulation results</p>
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-700/20 rounded-lg">
              <p className="text-sm text-gray-400">Position Size</p>
              <p className="text-lg font-medium">${simulation['Position Size'].toFixed(2)}</p>
            </div>
            <div className="p-3 bg-gray-700/20 rounded-lg">
              <p className="text-sm text-gray-400">Fees</p>
              <p className="text-lg font-medium">
                ${(simulation['Market Fee'] || simulation['Limit Fee']).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-gray-700/20 rounded-lg">
              <p className="text-sm text-gray-400">Potential Profit</p>
              <p className={clsx(
                'text-lg font-medium',
                simulation['Profit at TP'] > 0 ? 'text-green-400' : 'text-red-400'
              )}>
                ${simulation['Profit at TP'].toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-gray-700/20 rounded-lg">
              <p className="text-sm text-gray-400">Potential Loss</p>
              <p className="text-lg font-medium text-red-400">
                ${Math.abs(simulation['Loss at SL']).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">Risk/Reward Distribution</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={simulation ? [
                  { name: 'Potential Profit', value: Math.abs(simulation['Profit at TP']) },
                  { name: 'Potential Loss', value: Math.abs(simulation['Loss at SL']) },
                  { name: 'Fees', value: simulation['Market Fee'] || simulation['Limit Fee'] }
                ] : [
                  { name: 'Potential Profit', value: 1000 },
                  { name: 'Potential Loss', value: 500 },
                  { name: 'Fees', value: 50 }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill="#4ade80" />
                <Cell fill="#f87171" />
                <Cell fill="#60a5fa" />
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#e5e7eb' }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
            </PieChart>
          </ResponsiveContainer>
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
      
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">Profit/Loss Analysis</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={simulation ? [
                  { name: 'Potential Profit', value: Math.max(0, simulation['Profit at TP']) },
                  { name: 'Potential Loss', value: Math.abs(Math.min(0, simulation['Loss at SL'])) }
                ] : [
                  { name: 'Potential Profit', value: 1000 },
                  { name: 'Potential Loss', value: 500 }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill="#4ade80" />
                <Cell fill="#f87171" />
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#e5e7eb' }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
            </PieChart>
          </ResponsiveContainer>
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
        </div>
      </div>
    </div>
  );
};