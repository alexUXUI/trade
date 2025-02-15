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
        className="w-full bg-gray-700/30 border border-gray-600/50 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </TooltipWrapper>
  );
};