import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthCallback } from '../components/AuthCallback';
import { ProtectedRoute } from './ProtectedRoute';
import App from '../App';
import { SignIn } from '../pages/SignIn';

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