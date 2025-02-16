import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAccount } from '../state/AccountContext';
import { useNavigate } from 'react-router-dom';

export function AuthCallback() {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const { setAccount } = useAccount();
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAccount = async () => {
            if (isLoading) return;

            if (!isAuthenticated) {
                navigate('/signin');
                return;
            }

            if (user) {
                setAccount({
                    id: user.sub || '',
                    username: user.email || '',
                    balance: {
                        totalBalance: 10000,
                        availableBalance: 8000,
                        usedMargin: 1500,
                        maintenanceMargin: 500,
                        unrealizedPnL: 0,
                        withdrawableBalance: 8000
                    }
                });
                navigate('/');
            }
        };

        initializeAccount();
    }, [isAuthenticated, isLoading, user, setAccount, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="text-white text-xl">Processing authentication...</div>
        </div>
    );
}