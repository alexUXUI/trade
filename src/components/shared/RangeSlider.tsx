import { ChangeEvent } from 'react';
import { TooltipWrapper } from './TooltipWrapper';

interface RangeSliderProps {
  label: string;
  tooltip: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const RangeSlider = ({
  label,
  tooltip,
  value,
  onChange,
  min = 0,
  max = 100
}: RangeSliderProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  return (
    <TooltipWrapper label={label} tooltip={tooltip}>
      <div className="neo-inset p-1 rounded-full">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="w-full h-2 appearance-none cursor-pointer bg-transparent
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:neo-outset
            [&::-webkit-slider-thumb]:bg-gradient-to-br
            [&::-webkit-slider-thumb]:from-blue-500
            [&::-webkit-slider-thumb]:to-blue-600
            [&::-webkit-slider-thumb]:border
            [&::-webkit-slider-thumb]:border-blue-400/20
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:hover:from-blue-400
            [&::-webkit-slider-thumb]:hover:to-blue-500
            [&::-webkit-slider-thumb]:active:neo-pressed"
        />
      </div>
    </TooltipWrapper>
  );
};