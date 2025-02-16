import { TradeProvider } from './application-logic/TradeContext';
import { AccountProvider } from './account/AccountContext';
import { HomePage } from './pages/home.page';
import './design-system/styles/neomorphic.css';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <AccountProvider>
        <TradeProvider>
          <HomePage />
        </TradeProvider>
      </AccountProvider>
    </div>
  );
};

export default App;
