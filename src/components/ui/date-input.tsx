
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, value = '', onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    const formatDate = (input: string) => {
      console.log('DateInput - formatDate called with input:', input);
      
      // Remove all non-numeric characters
      const numbers = input.replace(/\D/g, '');
      console.log('DateInput - numbers after cleanup:', numbers);
      
      // Allow up to 8 digits (DDMMYYYY)
      const truncated = numbers.substring(0, 8);
      console.log('DateInput - truncated to 8 digits:', truncated);
      
      let formatted = '';
      for (let i = 0; i < truncated.length; i++) {
        if (i === 2 || i === 4) {
          formatted += '/';
        }
        formatted += truncated[i];
      }
      
      console.log('DateInput - formatted result:', formatted);
      return formatted;
    };

    const validateInput = (input: string) => {
      console.log('DateInput - validateInput called with:', input);
      
      const numbers = input.replace(/\D/g, '');
      console.log('DateInput - validation numbers:', numbers);
      
      if (numbers.length >= 2) {
        const day = parseInt(numbers.substring(0, 2));
        console.log('DateInput - validating day:', day);
        if (day > 31 || day === 0) {
          console.log('DateInput - invalid day detected');
          return false;
        }
      }
      
      if (numbers.length >= 4) {
        const month = parseInt(numbers.substring(2, 4));
        console.log('DateInput - validating month:', month);
        if (month > 12 || month === 0) {
          console.log('DateInput - invalid month detected');
          return false;
        }
      }
      
      if (numbers.length === 8) {
        const year = parseInt(numbers.substring(4, 8));
        console.log('DateInput - validating year:', year);
        if (year < 1900 || year > new Date().getFullYear()) {
          console.log('DateInput - invalid year detected');
          return false;
        }
      }
      
      console.log('DateInput - validation passed');
      return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      console.log('DateInput - handleChange called with:', newValue);
      console.log('DateInput - current displayValue:', displayValue);
      
      // Allow deletion
      if (newValue.length < displayValue.length) {
        console.log('DateInput - deletion detected, allowing change');
        const formatted = formatDate(newValue);
        setDisplayValue(formatted);
        onChange?.(formatted);
        return;
      }
      
      // For additions, validate the raw input first
      if (!validateInput(newValue)) {
        console.log('DateInput - validation failed, rejecting input');
        return;
      }
      
      const formatted = formatDate(newValue);
      console.log('DateInput - setting new formatted value:', formatted);
      setDisplayValue(formatted);
      onChange?.(formatted);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      console.log('DateInput - keyDown event:', e.key, 'keyCode:', e.keyCode);
      
      // Allow backspace, delete, tab, escape, enter, and navigation keys
      if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode)) {
        console.log('DateInput - allowing control key');
        return;
      }
      
      // Check if current input would exceed maximum length
      const currentNumbers = displayValue.replace(/\D/g, '');
      if (currentNumbers.length >= 8 && ![8, 46].includes(e.keyCode)) {
        console.log('DateInput - maximum length reached, preventing input');
        e.preventDefault();
        return;
      }
      
      // Ensure that it's a number
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        console.log('DateInput - non-numeric key detected, preventing input');
        e.preventDefault();
      } else {
        console.log('DateInput - allowing numeric input');
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      console.log('DateInput - focus event');
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      console.log('DateInput - blur event, final value:', displayValue);
    };

    React.useEffect(() => {
      console.log('DateInput - useEffect triggered, new value prop:', value);
      setDisplayValue(value);
    }, [value]);

    console.log('DateInput - rendering with displayValue:', displayValue);

    return (
      <input
        {...props}
        ref={ref || inputRef}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="dd/mm/yyyy"
        maxLength={10}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
      />
    );
  }
);

DateInput.displayName = "DateInput";

export { DateInput };
