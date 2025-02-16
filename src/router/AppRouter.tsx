import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignInPage } from '../components/SignInPage';
import { AuthCallback } from '../components/AuthCallback';
import { ProtectedRoute } from './ProtectedRoute';
import App from '../App';

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signin" element={<SignInPage />} />
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