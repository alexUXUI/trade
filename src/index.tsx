import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { AccountProvider } from './state/AccountContext';
import { AppRouter } from './router/AppRouter';
import './index.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Auth0Provider
        domain="dev-q2hfh1yqpv48dbor.us.auth0.com"
        clientId="PdJm7Qps2P3n4UZDpNE2hXFJEyTz3O5b"
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
