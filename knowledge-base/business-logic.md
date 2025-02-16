Meticulous List of Input-Output Relationships with Formulas (Long & Short)
Each input field affects multiple output values. I’ll break it down systematically with separate formulas for long and short positions where applicable.

1️⃣ Changing "Leverage"
Impacts:
✅ Position Size → Increases as leverage increases.
✅ Liquidation Price → Moves closer to the entry price as leverage increases.
✅ Margin Required → Decreases if position size remains fixed.
✅ Maintenance Margin → Changes based on new position size.
✅ Potential Profit & Loss → Becomes larger due to increased position size.

Formulas:
Position Size
=
Margin
×
Leverage
Position Size=Margin×Leverage
Liquidation Price (Long)
=
Entry Price
×
(
1
−
1
Leverage
)
Liquidation Price (Long)=Entry Price×(1− 
Leverage
1
​
 )
Liquidation Price (Short)
=
Entry Price
×
(
1
+
1
Leverage
)
Liquidation Price (Short)=Entry Price×(1+ 
Leverage
1
​
 )
Maintenance Margin
=
Position Size
×
Exchange Requirement
Maintenance Margin=Position Size×Exchange Requirement
2️⃣ Changing "Entry Price"
Impacts:
✅ Liquidation Price → Adjusts based on leverage.
✅ Position Size → If quantity remains fixed, position size updates.
✅ Potential Profit & Loss → Changes as price difference scales.

Formulas:
Liquidation Price (Long)
=
Entry Price
×
(
1
−
1
Leverage
)
Liquidation Price (Long)=Entry Price×(1− 
Leverage
1
​
 )
Liquidation Price (Short)
=
Entry Price
×
(
1
+
1
Leverage
)
Liquidation Price (Short)=Entry Price×(1+ 
Leverage
1
​
 )
Profit (Long)
=
Position Size
×
(
Take Profit
−
Entry Price
)
Profit (Long)=Position Size×(Take Profit−Entry Price)
Profit (Short)
=
Position Size
×
(
Entry Price
−
Take Profit
)
Profit (Short)=Position Size×(Entry Price−Take Profit)
Loss (Long)
=
Position Size
×
(
Entry Price
−
Stop Loss
)
Loss (Long)=Position Size×(Entry Price−Stop Loss)
Loss (Short)
=
Position Size
×
(
Stop Loss
−
Entry Price
)
Loss (Short)=Position Size×(Stop Loss−Entry Price)
3️⃣ Changing "Quantity"
Impacts:
✅ Position Size → Updates proportionally.
✅ Margin Required → Adjusts based on position size.
✅ Profit & Loss → Adjusts proportionally.

Formulas:
Position Size
=
Entry Price
×
Quantity
Position Size=Entry Price×Quantity
Margin
=
Position Size
Leverage
Margin= 
Leverage
Position Size
​
 
4️⃣ Changing "Take Profit"
Impacts:
✅ Potential Profit → Updates as the distance to entry changes.
✅ Risk/Reward Ratio → Adjusts based on new target profit.

Formulas:
Profit (Long)
=
Position Size
×
(
Take Profit
−
Entry Price
)
Profit (Long)=Position Size×(Take Profit−Entry Price)
Profit (Short)
=
Position Size
×
(
Entry Price
−
Take Profit
)
Profit (Short)=Position Size×(Entry Price−Take Profit)
Risk-Reward Ratio
=
Potential Profit
Potential Loss
Risk-Reward Ratio= 
Potential Loss
Potential Profit
​
 
5️⃣ Changing "Stop Loss"
Impacts:
✅ Potential Loss → Changes based on distance from entry price.
✅ Risk/Reward Ratio → Updates to reflect new risk.

Formulas:
Loss (Long)
=
Position Size
×
(
Entry Price
−
Stop Loss
)
Loss (Long)=Position Size×(Entry Price−Stop Loss)
Loss (Short)
=
Position Size
×
(
Stop Loss
−
Entry Price
)
Loss (Short)=Position Size×(Stop Loss−Entry Price)
6️⃣ Changing "Margin"
Impacts:
✅ Position Size → Increases with more margin.
✅ Liquidation Price → Moves further from entry price.
✅ Maintenance Margin → Increases as position size increases.

Formulas:
Position Size
=
Margin
×
Leverage
Position Size=Margin×Leverage
Liquidation Price (Long)
=
Entry Price
×
(
1
−
1
Leverage
)
Liquidation Price (Long)=Entry Price×(1− 
Leverage
1
​
 )
Liquidation Price (Short)
=
Entry Price
×
(
1
+
1
Leverage
)
Liquidation Price (Short)=Entry Price×(1+ 
Leverage
1
​
 )
7️⃣ Changing "Risk/Reward Ratio"
Impacts:
✅ Take Profit OR Stop Loss (One must be recalculated based on the ratio).

Formulas:
Take Profit
=
Entry Price
+
(
Stop Loss Distance
×
Risk-Reward Ratio
)
Take Profit=Entry Price+(Stop Loss Distance×Risk-Reward Ratio)
8️⃣ Changing "Fees"
Impacts:
✅ Potential Profit & Loss → Reduced by fees.

Formulas:
Net Profit
=
Profit
−
Fees
Net Profit=Profit−Fees
Net Loss
=
Loss
+
Fees
Net Loss=Loss+Fees
🔹 Recap: When Each Input Changes...
Input	Updates These Outputs
Leverage	Position Size, Liquidation Price, Maintenance Margin, Profit/Loss
Entry Price	Liquidation Price, Position Size, Profit/Loss
Quantity	Position Size, Margin, Profit/Loss
Take Profit	Potential Profit, Risk-Reward Ratio
Stop Loss	Potential Loss, Risk-Reward Ratio
Margin	Position Size, Liquidation Price, Maintenance Margin
Risk/Reward Ratio	Adjusts Take Profit or Stop Loss
Fees	Adjusts Net Profit & Net Loss
