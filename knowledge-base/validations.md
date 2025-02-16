📌 Comprehensive List of Input Validation Edge Cases
Each validation rule should trigger an error message when an invalid input is detected.

1️⃣ General Validation (Applies to All Trades)
✅ All numerical inputs must be greater than zero.

❌ Invalid: Entry Price = 0
❌ Invalid: Quantity = -5
✅ Valid: Entry Price = 2700
✅ Leverage should be within exchange limits (e.g., 1x - 100x).

❌ Invalid: Leverage = 200x
✅ Valid: Leverage = 25x
✅ Margin cannot exceed available balance.

❌ Invalid: Margin = 200 USDT (when only 100 USDT is available)
✅ Valid: Margin = 50 USDT
✅ Stop Loss and Take Profit cannot be identical to Entry Price.

❌ Invalid: SL = 2700, TP = 2700
✅ Valid: SL = 2600, TP = 2800
✅ Stop Loss and Take Profit must be different from each other.

❌ Invalid: SL = 2500, TP = 2500
✅ Valid: SL = 2500, TP = 2800
✅ Quantity must be a reasonable decimal value.

❌ Invalid: Quantity = 0.00000001 (too small to trade)
✅ Valid: Quantity = 0.1
2️⃣ Long Position Validation (Betting on Price Going Up)
✅ Take Profit must be greater than the Entry Price.

❌ Invalid: Entry = 2700, TP = 2500
✅ Valid: Entry = 2700, TP = 3000
✅ Stop Loss must be less than the Entry Price.

❌ Invalid: Entry = 2700, SL = 2800
✅ Valid: Entry = 2700, SL = 2600
✅ Liquidation Price must be less than the Entry Price.

❌ Invalid: Entry = 2700, Liquidation Price = 2900
✅ Valid: Entry = 2700, Liquidation Price = 2500
✅ Stop Loss cannot be lower than Liquidation Price (to avoid auto-liquidation before SL triggers).

❌ Invalid: Entry = 2700, SL = 2400, Liquidation Price = 2500
✅ Valid: SL = 2550 (above liquidation price)
3️⃣ Short Position Validation (Betting on Price Going Down)
✅ Take Profit must be less than the Entry Price.

❌ Invalid: Entry = 2700, TP = 2900
✅ Valid: Entry = 2700, TP = 2500
✅ Stop Loss must be greater than the Entry Price.

❌ Invalid: Entry = 2700, SL = 2500
✅ Valid: Entry = 2700, SL = 2900
✅ Liquidation Price must be greater than the Entry Price.

❌ Invalid: Entry = 2700, Liquidation Price = 2500
✅ Valid: Entry = 2700, Liquidation Price = 2850
✅ Stop Loss cannot be higher than Liquidation Price (to avoid auto-liquidation before SL triggers).

❌ Invalid: Entry = 2700, SL = 3000, Liquidation Price = 2900
✅ Valid: SL = 2850 (below liquidation price)
4️⃣ Risk Management & Edge Cases
✅ Risk/Reward Ratio must be a positive number.

❌ Invalid: Risk/Reward = -2
✅ Valid: Risk/Reward = 2.5
✅ Margin must be sufficient to cover maintenance margin.

❌ Invalid: Margin = 5 USDT, Maintenance Margin = 10 USDT
✅ Valid: Margin = 15 USDT
✅ Position Size should not exceed market liquidity constraints.

❌ Invalid: Trying to short 1000 BTC on a low-liquidity market
✅ Valid: Shorting 1 BTC on a highly liquid market
✅ Fees must not exceed potential profit.

❌ Invalid: Fees = $50, Potential Profit = $40
✅ Valid: Fees = $10, Potential Profit = $100
✅ Take Profit and Stop Loss must be a reasonable percentage from Entry Price.

❌ Invalid: Entry = 2700, TP = 10,000 (Unrealistic, extreme price move)
✅ Valid: Entry = 2700, TP = 3000
📌 Error Messages for Edge Cases
To improve user experience, error messages should guide users on how to fix their inputs.

Scenario	Error Message Example
Take Profit below Entry Price (Long)	❌ "Take Profit must be higher than Entry Price for a Long position."
Stop Loss above Entry Price (Short)	❌ "Stop Loss must be higher than Entry Price for a Short position."
Liquidation Price too close	⚠️ "Your liquidation price is dangerously close to your entry. Consider lowering leverage or adding margin."
Margin too high	⚠️ "Your margin exceeds available balance. Adjust the amount."
R/R Ratio too low	❌ "Risk/Reward Ratio should be at least 1.0 for a viable trade."
Fees higher than profit	⚠️ "Warning: Fees exceed expected profit. Consider adjusting your trade size."