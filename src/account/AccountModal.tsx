import React from 'react';
import { useAccount } from './AccountContext';
import { InputField } from '../components/shared/InputField';
import { useAuth0 } from '@auth0/auth0-react';

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AccountModal({ isOpen, onClose }: AccountModalProps) {
    const { account, setAccount, updateBalance } = useAccount();
    const { logout, user } = useAuth0();

    console.log('Modal render:', { isOpen, account });

    if (!isOpen) return null;

    return (
        <dialog
            open={isOpen}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
            className="fixed inset-0 bg-black/50 w-full h-full flex items-center justify-center z-50"
        >
            <div onClick={(e) => e.stopPropagation()} className="neo-outset rounded-lg p-6 w-96 max-w-full text-white bg-gray-800">
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
                    <div className="flex items-center space-x-4 mb-4">
                        {user?.picture && (
                            <img src={user.picture} alt="Profile" className="w-12 h-12 rounded-full neo-inset" />
                        )}
                        <div>
                            <div className="font-medium">{user?.name}</div>
                            <div className="text-sm text-gray-400">{user?.email}</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <InputField
                            label="Total Balance"
                            tooltip="Your total account balance"
                            value={account?.balance?.totalBalance ?? '0'}
                            onChange={(value) => {
                                if (!account?.balance) return;
                                updateBalance({
                                    ...account.balance,
                                    totalBalance: parseFloat(value) || 0
                                });
                            }}
                        />

                        <InputField
                            label="Available Balance"
                            tooltip="Balance available for trading"
                            value={account?.balance?.availableBalance ?? '0'}
                            onChange={(value) => {
                                if (!account?.balance) return;
                                updateBalance({
                                    ...account.balance,
                                    availableBalance: parseFloat(value) || 0
                                });
                            }}
                        />

                        <InputField
                            label="Used Margin"
                            tooltip="Amount of margin currently in use"
                            value={account?.balance?.usedMargin ?? 0}
                            onChange={(value) => {
                                if (!account?.balance) return;
                                updateBalance({
                                    ...account.balance,
                                    usedMargin: parseFloat(value) || 0
                                });
                            }}
                        />

                        <InputField
                            label="Maintenance Margin"
                            tooltip="Required margin to maintain positions"
                            value={account?.balance?.maintenanceMargin ?? 0}
                            onChange={(value) => {
                                if (!account?.balance) return;
                                updateBalance({
                                    ...account.balance,
                                    maintenanceMargin: parseFloat(value) || 0
                                });
                            }}
                        />

                        <InputField
                            label="Unrealized P&L"
                            tooltip="Unrealized profit or loss"
                            value={account?.balance?.unrealizedPnL ?? 0}
                            onChange={(value) => {
                                if (!account?.balance) return;
                                updateBalance({
                                    ...account.balance,
                                    unrealizedPnL: parseFloat(value) || 0
                                });
                            }}
                        />

                        <InputField
                            label="Withdrawable Balance"
                            tooltip="Balance available for withdrawal"
                            value={account?.balance?.withdrawableBalance ?? 0}
                            onChange={(value) => {
                                if (!account?.balance) return;
                                updateBalance({
                                    ...account.balance,
                                    withdrawableBalance: parseFloat(value) || 0
                                });
                            }}
                        />
                    </div>
                    <div className="pt-6 border-t border-gray-700">
                        <button
                            onClick={() => logout({ logoutParams: { returnTo: `${window.location.origin}/logout` } })}
                            className="w-full neo-button bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
}