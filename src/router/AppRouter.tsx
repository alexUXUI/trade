import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthCallback } from './AuthCallback';
import { ProtectedRoute } from './ProtectedRoute';
import { SignIn } from '../pages/sign-in';
import App from '../App';

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <App />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}