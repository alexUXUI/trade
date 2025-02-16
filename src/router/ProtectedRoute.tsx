import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [sessionCheckFailed, setSessionCheckFailed] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        const verifySession = async () => {
            if (isVerifying) return; // Prevent multiple simultaneous verification attempts

            setIsVerifying(true);
            try {
                await getAccessTokenSilently({
                    detailedResponse: true,
                });
            } catch (error) {
                setSessionCheckFailed(true);
            } finally {
                setIsVerifying(false);
            }
        };

        if (!isLoading && !isAuthenticated && !sessionCheckFailed) {
            verifySession();
        }
    }, [isLoading, isAuthenticated, getAccessTokenSilently, sessionCheckFailed, isVerifying]);


    if (sessionCheckFailed || (!isLoading && !isAuthenticated)) {
        return <Navigate to="/signin" replace />;
    }

    if (isLoading && !sessionCheckFailed) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return <>{children}</>;
}