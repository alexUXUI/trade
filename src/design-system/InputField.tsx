import { ChangeEvent } from 'react';
import { TooltipWrapper } from './TooltipWrapper';

interface InputFieldProps {
  label: string;
  tooltip: string;
  value: number | string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export const InputField = ({
  label,
  tooltip,
  value,
  onChange,
  placeholder,
  readOnly = false
}: InputFieldProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <TooltipWrapper label={label} tooltip={tooltip}>
      <input
        type="number"
        value={value || ''}
        onChange={handleChange}
        className="w-full neo-inset text-gray-200 rounded-xl p-3 
          bg-gray-900/50 border border-gray-700/30
          focus:neo-pressed focus:outline-none
          transition-all duration-200"
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </TooltipWrapper>
  );
};