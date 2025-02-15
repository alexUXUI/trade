import { TooltipWrapper } from './TooltipWrapper';

interface ButtonOption {
  value: string;
  label: string;
}

interface ButtonGroupProps {
  label: string;
  tooltip: string;
  options: ButtonOption[];
  value: string;
  onChange: any
}

export const ButtonGroup = ({
  label,
  tooltip,
  options,
  value,
  onChange
}: ButtonGroupProps) => {
  return (
    <TooltipWrapper label={label} tooltip={tooltip}>
      <div className="flex gap-4">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 py-3 px-4 rounded-xl transition-all duration-200 
              ${value === option.value
                ? 'neo-pressed text-white'
                : 'neo-outset text-gray-400 hover:neo-pressed'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </TooltipWrapper>
  );
};