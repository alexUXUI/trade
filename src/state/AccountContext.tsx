import React, { createContext, useContext, useState } from 'react';
import { UserAccount, AccountBalance } from '../types/account';

interface AccountContextType {
    account: UserAccount | null;
    setAccount: (account: UserAccount) => void;
    updateBalance: (balance: AccountBalance) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

const defaultAccount: UserAccount = {
    id: '1',
    username: 'Demo User',
    balance: {
        totalBalance: 10000,
        availableBalance: 8000,
        usedMargin: 1500,
        maintenanceMargin: 500,
        unrealizedPnL: 0,
        withdrawableBalance: 8000
    }
};

export function AccountProvider({ children }: { children: React.ReactNode }) {
    const [account, setAccountState] = useState<UserAccount>(defaultAccount);

    const setAccount = (newAccount: UserAccount) => {
        setAccountState(newAccount);
    };

    const updateBalance = (balance: AccountBalance) => {
        setAccountState(prev => ({
            ...prev,
            balance
        }));
    };

    return (
        <AccountContext.Provider value={{ account, setAccount, updateBalance }}>
            {children}
        </AccountContext.Provider>
    );
}

export function useAccount() {
    const context = useContext(AccountContext);
    if (context === undefined) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
}