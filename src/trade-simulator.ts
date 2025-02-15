export interface TradeSimulationResult {
  'Entry Price': number;
  'Leverage': number;
  'Margin Used': number;
  'Position Size': number;
  'Market Fee': number;
  'Limit Fee': number;
  'Profit at TP': number;
  'Loss at SL': number;
}

export type OrderType = 'market' | 'limit' | 'trigger';

export class TradeSimulator {
    private entryPrice: number;
    private quantity: number;
    private leverage: number;
    private margin: number;
    private makerFee: number;
    private takerFee: number;
    private tp: number;
    private sl: number;
    private orderType: OrderType;
    private positionSize: number;
  
    // constructor(
    //   price: number,
    //   quantity: number,
    //   leverage: number,
    //   margin: number,
    //   makerFee: number,
    //   takerFee: number,
    //   tp: number,
    //   sl: number,
    //   orderType: OrderType
    // ) {
    //   this.entryPrice = price;
    //   this.quantity = quantity;
    //   this.leverage = leverage;
    //   this.margin = margin;
    //   this.makerFee = makerFee / 100;
    //   this.takerFee = takerFee / 100;
    //   this.tp = tp;
    //   this.sl = sl;
    //   this.orderType = orderType;
    //   this.positionSize = this.margin * this.leverage;
    // }
  
    private calculateFees(): number {
      let feeRate = this.orderType === "market" ? this.takerFee : this.makerFee;
      return this.positionSize * feeRate;
    }
  
    constructor(
      price: number,
      quantity: number,
      leverage: number,
      margin: number,
      makerFee: number,
      takerFee: number,
      tp: number,
      sl: number,
      orderType: OrderType,
    ) {
      this.entryPrice = price;
      this.quantity = quantity;
      this.leverage = leverage;
      this.margin = margin;
      this.makerFee = makerFee / 100;
      this.takerFee = takerFee / 100;
      this.tp = tp;
      this.sl = sl;
      this.orderType = orderType;
      this.positionSize = this.margin * this.leverage;
    }

    private calculatePnL(exitPrice: number): number {
      let positionSize = this.quantity;
      let pnl = positionSize * (exitPrice - this.entryPrice);
      return pnl;
    }

    private calculateMaintenanceMargin(): number {
      return this.positionSize * 0.005; // 0.5% maintenance margin rate
    }

    private calculateLiquidationPrice(): number {
      const maintenanceMargin = this.calculateMaintenanceMargin();
      const liquidationPrice = this.entryPrice - ((this.margin - maintenanceMargin) / (this.positionSize / this.entryPrice));
      return liquidationPrice;
    }
  
    static calculateRequiredMargin(
      price: number,
      quantity: number,
      leverage: number
    ): number {
      const positionSize = price * quantity;
      return positionSize / leverage;
    }
  
    static calculateRequiredLeverage(
      price: number,
      quantity: number,
      margin: number
    ): number {
      const positionSize = price * quantity;
      return margin / positionSize;
    }
  
    simulateTrade(): TradeSimulationResult {
      let tpPnL = this.calculatePnL(this.tp);
      let slPnL = this.calculatePnL(this.sl);
      let fees = this.calculateFees();
  
      return {
        "Entry Price": this.entryPrice,
        Leverage: this.leverage,
        "Margin Used": this.margin,
        "Position Size": this.positionSize,
        "Market Fee": this.orderType === "market" ? fees : 0,
        "Limit Fee": this.orderType === "limit" ? fees : 0,
        "Profit at TP": tpPnL - fees,
        "Loss at SL": slPnL - fees,
      };
    }
  }
  
  // Define the interface for the simulation result
  export interface TradeSimulationResult {
    "Entry Price": number;
    Leverage: number;
    "Margin Used": number;
    "Position Size": number;
    "Market Fee": number;
    "Limit Fee": number;
    "Profit at TP": number;
    "Loss at SL": number;
  }
  
  // // Example Usage
  // const trade = new TradeSimulator(
  //   1.0, // Entry Price (DOGE = $1)
  //   10, // Quantity of DOGE
  //   5, // Leverage (5x)
  //   2, // Margin Used (2 USDT)
  //   0.02, // Maker Fee (0.02%)
  //   0.06, // Taker Fee (0.06%)
  //   1.2, // Take Profit Price ($1.20)
  //   0.9, // Stop Loss Price ($0.90)
  //   "market" // Order Type: "market" or "limit"
  // );
  
  // console.log(trade.simulateTrade());
  
  
  // const ethPosition = new TradeSimulator(
  //   3000,   // Entry Price (ETH = $3,000)
  //   100,    // Quantity (ETH equivalent based on position size)
  //   10,     // Leverage (10x)
  //   100,    // Margin Used (100 USDT)
  //   0.02,   // Maker Fee (0.02%)
  //   0.06,   // Taker Fee (0.06%)
  //   3500,   // Take Profit Price ($3,500)
  //   2800,   // Stop Loss Price ($2,800)
  //   "market" // Order Type: "market" or "limit"
  // );
  
  // console.log(ethPosition.simulateTrade());
  
  // const requiredMargin = TradeSimulator.calculateRequiredMargin(
  //   3000,   // Price (ETH = $3,000)
  //   1,      // Quantity (1 ETH)
  //   10      // Leverage (10x)
  // );
  // console.log(`Required margin: ${requiredMargin} USDT`);
  