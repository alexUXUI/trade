import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export function SignInPage() {
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/');
        }
    }, [isLoading, isAuthenticated, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="neo-outset rounded-lg p-8 w-96 max-w-full text-white bg-gray-800">
                <h1 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-purple-500 bg-clip-text text-transparent">
                    Welcome to Trade App
                </h1>
                <button
                    onClick={() => loginWithRedirect()}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition-colors"
                >
                    Sign In with Auth0
                </button>
            </div>
        </div>
    );
}