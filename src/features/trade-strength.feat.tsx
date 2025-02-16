import { useTrade } from '../state/TradeContext';
import { calculateTradeStrength } from '../trade-pipeline/trade-strength'
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
        <div className="neo-outset rounded-xl p-6 border border-gray-700/10">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Trade Strength Analysis</h3>


            <div className="mb-4 neo-stat p-2 rounded-xl bg-gray-900/40 shadow-lg border border-gray-800/20 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.04)]">
                <div className="flex justify-between items-center">
                    <TooltipWrapper label="Overall Strength" tooltip="Combined score of all trade parameters">
                    </TooltipWrapper>
                    <span className={`text-xs ${!simulation ? 'text-gray-500' :
                        tradeStrength.score > 15 ? 'text-purple-400' :
                            tradeStrength.score > 10 ? 'text-green-400' :
                                tradeStrength.score > 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {simulation ? (tradeStrength.score > 0 ? '+' : '') + tradeStrength.score : '0'} pts
                    </span>
                </div>
                <div className="h-2 mt-2 mb-2 rounded-full overflow-hidden bg-gradient-to-r from-gray-950 to-gray-900">
                    <div
                        className={`h-full rounded-full ${!simulation ? 'bg-gradient-to-r from-gray-700 to-gray-600' :
                            tradeStrength.score > 15 ? 'bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500' :
                                tradeStrength.score > 10 ? 'bg-gradient-to-r from-green-700 via-green-600 to-green-500' :
                                    tradeStrength.score > 5 ? 'bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500' :
                                        'bg-gradient-to-r from-red-700 via-red-600 to-red-500'}`}
                        style={{
                            width: `${(tradeStrength.score / 25) * 100}%`,
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>
                <p className="text-xs text-gray-500">{tradeStrength.label}</p>
            </div>

            <div className="space-y-4">

                {tradeStrength.details.map((detail, index) => (
                    <div key={index} className="neo-stat p-2 rounded-xl bg-gray-900/40 shadow-lg border border-gray-800/20 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.04)]">
                        <div className="flex justify-between items-center">
                            <TooltipWrapper label={detail.factor} tooltip={detail.reason}>
                            </TooltipWrapper>
                            <span className={`text-xs ${!simulation ? 'text-gray-500' :
                                detail.score > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {simulation ? (detail.score > 0 ? '+' : '') + detail.score : '0'} pts
                            </span>
                        </div>
                        <div className="h-2 mt-2 mb-2 rounded-full overflow-hidden bg-gradient-to-r from-gray-950 to-gray-900">
                            <div
                                className={`h-full rounded-full ${!simulation ? 'bg-gradient-to-r from-gray-700 to-gray-600' :
                                    detail.score > 3 ? 'bg-gradient-to-r from-green-700 via-green-600 to-green-500' :
                                        detail.score > 0 ? 'bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500' :
                                            'bg-gradient-to-r from-red-700 via-red-600 to-red-500'
                                    }`}
                                style={{
                                    width: simulation ? `${Math.abs(detail.score) * 20}%` : '0%',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </div>
                        <p className="text-xs text-gray-500">{detail.reason}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};