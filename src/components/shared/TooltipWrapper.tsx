import { ReactNode } from 'react';

interface TooltipWrapperProps {
  label: string;
  tooltip: string;
  children?: ReactNode;
}

export const TooltipWrapper = ({ label, tooltip, children }: TooltipWrapperProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        <div className="group relative">
          <div className="cursor-help text-gray-400 hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="invisible group-hover:visible absolute z-10 w-64 p-4 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 text-sm text-gray-300">
            {tooltip}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};