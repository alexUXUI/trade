import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

export function LoginSSO() {
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log(codeResponse);
            navigate('/');
        },
        onError: (error) => {
            console.error('Login Failed:', error);
        },
        flow: 'implicit',
        scope: 'email profile openid',
        state: 'login',
    });

    return (
        <button
            onClick={() => login()}
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
            Sign In with Google
        </button>
    );
}