import { TradeInputs } from '../types/trade';

type ValidationResult = {
  isValid: boolean;
  message: string;
};

export const validateTradeInputs = (inputs: TradeInputs, availableBalance: number): ValidationResult => {
  // General Validations
  if (inputs.price <= 0) {
    return { isValid: false, message: 'Entry Price must be greater than zero.' };
  }

  if (inputs.quantity <= 0) {
    return { isValid: false, message: 'Quantity must be greater than zero.' };
  }

  if (inputs.quantity < 0.0001) {
    return { isValid: false, message: 'Quantity is too small to trade.' };
  }

  if (inputs.leverage <= 0 || inputs.leverage > 100) {
    return { isValid: false, message: 'Leverage must be between 1x and 100x.' };
  }

  if (inputs.margin > availableBalance) {
    return { isValid: false, message: 'Margin cannot exceed available balance.' };
  }

  if (inputs.tp === inputs.price || inputs.sl === inputs.price) {
    return { isValid: false, message: 'Stop Loss and Take Profit cannot be identical to Entry Price.' };
  }

  if (inputs.tp === inputs.sl) {
    return { isValid: false, message: 'Stop Loss and Take Profit must be different from each other.' };
  }

  // Long Position Validations
  if (inputs.positionSide === 'long') {
    if (inputs.tp <= inputs.price) {
      return { isValid: false, message: 'Take Profit must be higher than Entry Price for a Long position.' };
    }

    if (inputs.sl >= inputs.price) {
      return { isValid: false, message: 'Stop Loss must be lower than Entry Price for a Long position.' };
    }

    if (inputs.liquidationPrice >= inputs.price) {
      return { isValid: false, message: 'Liquidation Price must be lower than Entry Price for a Long position.' };
    }

    if (inputs.sl <= inputs.liquidationPrice) {
      return { isValid: false, message: 'Stop Loss cannot be lower than Liquidation Price to avoid auto-liquidation.' };
    }
  }

  // Short Position Validations
  if (inputs.positionSide === 'short') {
    if (inputs.tp >= inputs.price) {
      return { isValid: false, message: 'Take Profit must be lower than Entry Price for a Short position.' };
    }

    if (inputs.sl <= inputs.price) {
      return { isValid: false, message: 'Stop Loss must be higher than Entry Price for a Short position.' };
    }

    if (inputs.liquidationPrice <= inputs.price) {
      return { isValid: false, message: 'Liquidation Price must be higher than Entry Price for a Short position.' };
    }

    if (inputs.sl >= inputs.liquidationPrice) {
      return { isValid: false, message: 'Stop Loss cannot be higher than Liquidation Price to avoid auto-liquidation.' };
    }
  }

  // Risk Management Validations
  if (inputs.maintenanceMargin > inputs.margin) {
    return { isValid: false, message: 'Margin must be sufficient to cover maintenance margin.' };
  }

  // All validations passed
  return { isValid: true, message: '' };
};