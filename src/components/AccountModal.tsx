import React from 'react';
import { useAccount } from '../state/AccountContext';
import { InputField } from './shared/InputField';

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AccountModal({ isOpen, onClose }: AccountModalProps) {
    const { account, setAccount, updateBalance } = useAccount();

    React.useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !account) return null;

    return (
        <dialog
            open={isOpen}
            className="fixed inset-0 bg-black/50 w-full h-full flex items-center justify-center z-50 backdrop:bg-black/50"
        >
            <div className="neo-outset rounded-lg p-6 w-96 max-w-full text-white bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-purple-500 bg-clip-text text-transparent">Account Details</h2>
                    <button
                        onClick={onClose}
                        className="neo-button hover:opacity-80 p-2 rounded-lg text-gray-400"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <InputField
                        label="Username"
                        tooltip="Your account username"
                        value={account.username}
                        onChange={(value) => {
                            setAccount({
                                ...account,
                                username: value
                            });
                        }}
                    />

                    <div className="space-y-3">
                        <InputField
                            label="Total Balance"
                            tooltip="Your total account balance"
                            value={account.balance.totalBalance}
                            onChange={(value) => {
                                updateBalance({
                                    ...account.balance,
                                    totalBalance: parseFloat(value) || 0
                                });
                            }}
                        />

                        <InputField
                            label="Available Balance"
                            tooltip="Balance available for trading"
                            value={account.balance.availableBalance}
                            onChange={(value) => {
                                updateBalance({
                                    ...account.balance,
                                    availableBalance: parseFloat(value) || 0
                                });
                            }}
                        />

                        <InputField
                            label="Used Margin"
                            tooltip="Amount of margin currently in use"
                            value={account.balance.usedMargin}
                            onChange={(value) => {
                                updateBalance({
                                    ...account.balance,
                                    usedMargin: parseFloat(value) || 0
                                });
                            }}
                        />

                        <InputField
                            label="Maintenance Margin"
                            tooltip="Required margin to maintain positions"
                            value={account.balance.maintenanceMargin}
                            onChange={(value) => {
                                updateBalance({
                                    ...account.balance,
                                    maintenanceMargin: parseFloat(value) || 0
                                });
                            }}
                        />

                        <InputField
                            label="Unrealized P&L"
                            tooltip="Unrealized profit or loss"
                            value={account.balance.unrealizedPnL}
                            onChange={(value) => {
                                updateBalance({
                                    ...account.balance,
                                    unrealizedPnL: parseFloat(value) || 0
                                });
                            }}
                        />

                        <InputField
                            label="Withdrawable Balance"
                            tooltip="Balance available for withdrawal"
                            value={account.balance.withdrawableBalance}
                            onChange={(value) => {
                                updateBalance({
                                    ...account.balance,
                                    withdrawableBalance: parseFloat(value) || 0
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </dialog>
    );
}