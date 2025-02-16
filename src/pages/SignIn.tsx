import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedLogo } from '../components/AnimatedLogo';

export const SignIn = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
            <div className="neo-outset rounded-3xl p-12 bg-gray-800/30 backdrop-blur-sm border border-gray-700/20
                          shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div className="text-center max-w-md w-full">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-purple-500 bg-clip-text text-transparent">
                        Trade Simulator
                    </h1>
                    <AnimatedLogo />
                    <LoginSSO />
                </div>
            </div>
        </div>
    );
};

export function LoginSSO() {
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/');
        }
    }, [isLoading, isAuthenticated, navigate]);

    return (
        <button
            onClick={() => loginWithRedirect()}
            className="w-full bg-gray-800 py-3 rounded-lg 
                    text-lg font-semibold transition-all duration-300
                    border border-gray-700/50
                    shadow-[6px_6px_12px_rgba(0,0,0,0.3),-3px_-3px_8px_rgba(255,255,255,0.05)]
                    hover:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_10px_rgba(255,255,255,0.06)]
                    active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.05)]
                    active:border-gray-700/30
                    relative before:absolute before:inset-[1px] before:rounded-lg
                    before:bg-gradient-to-b before:from-gray-700/50 before:to-gray-800
                    before:-z-10"
        >
            Sign In with Auth0
        </button>
    );
}