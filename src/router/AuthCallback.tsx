import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAccount } from '../account/AccountContext';
import { useNavigate } from 'react-router-dom';
import { AnimatedLogo } from '../design-system/AnimatedLogo';
import { motion } from 'framer-motion';


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

                setTimeout(() => {
                    navigate('/');
                }, 1500);
            }
        };

        initializeAccount();
    }, [isAuthenticated, isLoading, user, setAccount, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
            <div className="neo-outset rounded-3xl p-12 bg-gray-800/30 backdrop-blur-sm border border-gray-700/20
                          shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div className="text-center max-w-md w-full">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-purple-500 bg-clip-text text-transparent">
                        Trade Simulator
                    </h1>
                    <AnimatedLogo />
                    <h1 className="text-white text-xl">
                        Authenticating
                        {[0, 1, 2].map((index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.6,
                                    delay: index * 0.2,
                                    repeatType: "reverse"
                                }}
                                className="inline-block ml-[2px]"
                            >
                                .
                            </motion.span>
                        ))}
                    </h1>
                </div>
            </div>
        </div>
    );
}
