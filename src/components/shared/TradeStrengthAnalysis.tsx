import { useTrade } from '../../context/TradeContext';
import { calculateTradeStrength } from '../../utils/trade-strength';
import { TooltipWrapper } from './TooltipWrapper';

export const TradeStrengthAnalysis = () => {
    const {
        simulation,
        inputs: { maintenanceMargin, liquidationPrice, marginPercent, leverage, price, sl },
        riskRewardRatio
    } = useTrade();
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
        <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold mb-4">Trade Strength Analysis</h3>
            <div className="space-y-6">
                {tradeStrength && tradeStrength.details.map((detail, index) => (
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
                                className={`h-full rounded-full ${detail.score > 3 ? 'bg-green-500' :
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
                        <span className="text-lg font-medium">Overall tradeStrength</span>
                        <span className={`text-lg font-bold ${tradeStrength && tradeStrength.color}`}>
                            {tradeStrength && tradeStrength.label} ({tradeStrength && tradeStrength.score} pts)
                        </span>
                    </div>
                    <div className="mt-2 h-3 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${tradeStrength && tradeStrength.score > 15 ? 'bg-purple-500' :
                                tradeStrength && tradeStrength.score > 10 ? 'bg-green-500' :
                                    tradeStrength && tradeStrength.score > 5 ? 'bg-yellow-500' :
                                        'bg-red-500'
                                }`}
                            style={{
                                width: `${(tradeStrength ? tradeStrength.score / 25 : 0) * 100}%`,
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};