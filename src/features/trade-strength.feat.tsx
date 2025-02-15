import { useTrade } from '../context/TradeContext';
import { calculateTradeStrength } from '../utils/trade-strength';
import { TooltipWrapper } from '../components/shared/TooltipWrapper';

export const TradeStrengthAnalysis = () => {
    const {
        simulation,
        inputs: { liquidationPrice, marginPercent, leverage, price, sl, tp },
    } = useTrade();

    const tradeStrength = simulation ? calculateTradeStrength(
        price,
        Math.abs((tp - price) / (price - sl)), // Calculate actual R:R from price distances
        leverage,
        liquidationPrice || 0,
        marginPercent,
        sl,
        simulation['Market Fee'] || simulation['Limit Fee'] || 0,
        Math.abs(simulation['Profit at TP'])
    ) : {
        label: 'Not Calculated',
        score: 0,
        color: 'text-gray-500',
        details: [
            { factor: 'Risk/Reward Ratio', score: 0, reason: 'Enter trade parameters to calculate R:R ratio' },
            { factor: 'Position Leverage', score: 0, reason: 'Enter leverage to calculate risk' },
            { factor: 'Stop Loss Distance', score: 0, reason: 'Set stop loss to calculate risk' },
            { factor: 'Liquidation Price Buffer', score: 0, reason: 'Enter position details to calculate liquidation risk' },
            { factor: 'Position Size', score: 0, reason: 'Enter quantity to calculate position metrics' }
        ]
    };

    return (
        <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold mb-4">Trade Strength Analysis</h3>
            <div className="space-y-6">
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">Overall Strength</span>
                        <span className={`text-lg font-bold ${tradeStrength.color}`}>
                            {tradeStrength.label} ({tradeStrength.score} pts)
                        </span>
                    </div>
                    <div className="mt-2 h-3 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${!simulation ? 'bg-gray-600' :
                                tradeStrength.score > 15 ? 'bg-purple-500' :
                                    tradeStrength.score > 10 ? 'bg-green-500' :
                                        tradeStrength.score > 5 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                }`}
                            style={{
                                width: `${(tradeStrength.score / 25) * 100}%`,
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                </div>
                {tradeStrength.details.map((detail, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <TooltipWrapper label={detail.factor} tooltip={detail.reason}>

                            </TooltipWrapper>
                            <span className={`font-medium ${!simulation ? 'text-gray-500' :
                                detail.score > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {simulation ? (detail.score > 0 ? '+' : '') + detail.score : '0'} pts
                            </span>
                        </div>
                        <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${!simulation ? 'bg-gray-600' :
                                    detail.score > 3 ? 'bg-green-500' :
                                        detail.score > 0 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                    }`}
                                style={{
                                    width: simulation ? `${Math.abs(detail.score) * 20}%` : '0%',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </div>
                        <p className="text-sm text-gray-400">{detail.reason}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};