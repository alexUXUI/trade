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
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
    </TooltipWrapper>
  );
};