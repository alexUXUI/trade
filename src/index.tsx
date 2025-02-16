import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { AccountProvider } from './account/AccountContext';
import { AppRouter } from './router/AppRouter';
import './index.css';

if (import.meta.env.MODE === 'development') {
  console.log('this is development mode');
}

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Auth0Provider
        domain={import.meta.env.PUBLIC_AUTH0_DOMAIN ?? ''}
        clientId={import.meta.env.PUBLIC_AUTH0_CLIENT_ID ?? ''}
        authorizationParams={{
          redirect_uri: window.location.origin + '/auth/callback'
        }}
      >
        <AccountProvider>
          <AppRouter />
        </AccountProvider>
      </Auth0Provider>
    </React.StrictMode>,
  );
}
