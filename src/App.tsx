import { TradeStrengthAnalysis } from './features/trade-strength.feat';
import { TradeProvider } from './context/TradeContext';
import { Order } from './features/order.feat';
import { PositionDetails } from './features/postion-details.feat';

const App = () => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <TradeProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-8 text-white">
          <div className="max-w-[1920px] mx-auto bg-gray-800/30 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-700/50 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Trade Calculator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              <Order />
              <PositionDetails />
              <TradeStrengthAnalysis />
            </div>
          </div>
        </div>
      </TradeProvider>
    </div>
  );
};

export default App;
