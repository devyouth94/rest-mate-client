'use client';

import { useCallback, useRef, useState } from 'react';

import DownCaret from '~/src/assets/icons/caret-down.svg';
import DownCaretInverse from '~/src/assets/icons/caret-down-inverse.svg';
import CalendarDown from '~/src/components/common/calendar-dropdown';
import Dropdown from '~/src/components/common/dropdown';
import { cn } from '~/src/utils/class-name';

interface FilterProps extends React.ComponentPropsWithoutRef<'button'> {
  options: string[];
  className?: string;
  placeholder: string;
  calendar?: boolean;
  onOptionSelect?: (option: string) => void;
  onDateSelect?: (date: Date) => void;
  onDateReset?: () => void;
}

function Yymmdd(date: Date) {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yy}/${mm}/${dd}`;
}

export default function RightFilter({
  placeholder,
  options,
  className,
  calendar = false,
  onOptionSelect,
  onDateSelect,
  onDateReset,
  ...rest
}: FilterProps) {
  const [selected, setSelected] = useState(placeholder);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const isClickedFirst = isOpen || selected !== placeholder;
  const filterRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const selectOption = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    onOptionSelect?.(option);
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    setSelected(Yymmdd(date!));
    setSelectedDate(date);
    setIsOpen(false);
    onDateSelect?.(date!);
  };

  const handleReset = useCallback(() => {
    setSelected(placeholder);
    setSelectedDate(undefined);
    onDateReset?.();
  }, [placeholder, onDateReset]);

  return (
    <div className="relative whitespace-nowrap">
      <button
        ref={filterRef}
        {...rest}
        onClick={toggleDropdown}
        className={cn(
          'flex justify-between rounded-xl border-[2px] border-secondary-100 bg-white text-secondary-800',
          'h-9 min-w-[110px] px-[10px] tablet:h-10',
          isClickedFirst
            ? 'border-none bg-secondary-900 py-[6px] text-secondary-50 tablet:py-2'
            : 'py-1 hover:bg-secondary-50 tablet:py-[6px]',
          className,
        )}
      >
        <div className={cn('py-[2px] text-sm', className)}>{selected}</div>
        {isClickedFirst ? (
          <DownCaretInverse className="h-6 w-6 text-right" />
        ) : (
          <DownCaret className="h-6 w-6 text-right" />
        )}
      </button>

      {isOpen && (
        <>
          {calendar ? (
            <CalendarDown
              onDateSelect={handleCalendarSelect}
              selectedDate={selectedDate}
              onReset={handleReset}
              onClose={() => setIsOpen(false)}
              filterRef={filterRef}
            />
          ) : (
            <Dropdown
              options={options}
              onSelect={selectOption}
              version="Filter"
              selectedOption={selected}
              onClose={() => setIsOpen(false)}
              filterRef={filterRef}
            />
          )}
        </>
      )}
    </div>
  );
}
