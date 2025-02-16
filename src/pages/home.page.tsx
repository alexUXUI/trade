import { UserIcon } from "../account/UserIcon"
import { Order } from "../features/order.feat"
import { PositionDetails } from "../features/postion-details.feat"
import { TradeStrengthAnalysis } from "../features/trade-strength.feat"

export const HomePage = () => {
    return (
        <main>
            <UserIcon />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8 text-white">
                <div className="max-w-[1920px] mx-auto neo-outset rounded-2xl p-4 sm:p-8 
              border border-gray-700/50">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-8 
                bg-gradient-to-r from-blue-400 via-purple-400 to-purple-500 
                bg-clip-text text-transparent">
                        Trade Simulator
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 
                [&>*]:neo-inset [&>*]:rounded-xl [&>*]:p-4 
                [&>*]:border [&>*]:border-gray-700/50 
                [&_button]:neo-button [&_button]:px-4 [&_button]:py-2 [&_button]:rounded-lg
                [&_input]:neo-inset [&_input]:bg-transparent [&_input]:rounded-lg [&_input]:px-4 [&_input]:py-2
                [&_select]:neo-inset [&_select]:bg-transparent [&_select]:rounded-lg [&_select]:px-4 [&_select]:py-2">
                        <Order />
                        <PositionDetails />
                        <TradeStrengthAnalysis />
                    </div>
                </div>
            </div>
        </main>
    )
}