import { TradeStrengthScore } from '../../utils/trade-strength';
import { TooltipWrapper } from './TooltipWrapper';
import { Bar } from 'recharts';

interface TradeStrengthAnalysisProps {
  strength: TradeStrengthScore;
}

export const TradeStrengthAnalysis = ({ strength }: TradeStrengthAnalysisProps) => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-xl font-semibold mb-4">Trade Strength Analysis</h3>
      <div className="space-y-6">
        {strength.details.map((detail, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <TooltipWrapper label={detail.factor} tooltip={detail.reason}>
                <span className="text-sm text-gray-300">{detail.factor}</span>
              </TooltipWrapper>
              <span className={`font-medium ${detail.score > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {detail.score > 0 ? '+' : ''}{detail.score} pts
              </span>
            </div>
            <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  detail.score > 3 ? 'bg-green-500' :
                  detail.score > 0 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{
                  width: `${Math.abs(detail.score) * 20}%`,
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
            <p className="text-sm text-gray-400">{detail.reason}</p>
          </div>
        ))}
        
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Overall Strength</span>
            <span className={`text-lg font-bold ${strength.color}`}>
              {strength.label} ({strength.score} pts)
            </span>
          </div>
          <div className="mt-2 h-3 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                strength.score > 15 ? 'bg-purple-500' :
                strength.score > 10 ? 'bg-green-500' :
                strength.score > 5 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{
                width: `${(strength.score / 25) * 100}%`,
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};