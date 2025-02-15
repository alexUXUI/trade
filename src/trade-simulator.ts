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
    entryPrice: number;
    quantity: number;
    leverage: number;
    margin: number;
    makerFee: number;
    takerFee: number;
    tp: number;
    sl: number;
    orderType: string;
    positionSize: number;
  
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

    calculateFees(): number {
      let feeRate = this.orderType === "market" ? this.takerFee : this.makerFee;
      return this.positionSize * feeRate;
    }

    calculatePnL(exitPrice: number): number {
      let positionSize = this.quantity;
      let pnl = positionSize * (exitPrice - this.entryPrice);
      return pnl;
    }

    calculateMaintenanceMargin(): number {
      return this.positionSize * 0.005; // 0.5% maintenance margin rate
    }

    calculateLiquidationPrice(): number {
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
  