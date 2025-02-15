export interface AccountBalance {
  totalBalance: number;
  availableBalance: number;
  usedMargin: number;
  maintenanceMargin: number;
  unrealizedPnL: number;
  withdrawableBalance: number;
}

export interface UserAccount {
  id: string;
  username: string;
  balance: AccountBalance;
}