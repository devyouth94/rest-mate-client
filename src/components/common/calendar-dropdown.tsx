import { useEffect, useRef, useState } from 'react';

import Button from '~/src/components/common/button';
import Calender from '~/src/components/common/calender';
import { cn } from '~/src/utils/class-name';

interface CalendarDownProps {
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
  onReset: () => void;
  onClose?: () => void;
  filterRef?: React.RefObject<HTMLButtonElement>;
  className?: string;
}

export default function CalendarDown({
  onDateSelect,
  selectedDate,
  onReset,
  onClose,
  filterRef,
  className,
}: CalendarDownProps) {
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | undefined>(
    selectedDate,
  );
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleSelectDate = (date: Date | undefined) => {
    setTempSelectedDate(date);
  };

  const handleSubmit = () => {
    if (tempSelectedDate) {
      onDateSelect(tempSelectedDate);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        calendarRef.current?.contains(target) ||
        filterRef?.current?.contains(target)
      ) {
        return;
      }

      onClose?.();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, filterRef]);

  useEffect(() => {
    setTempSelectedDate(selectedDate);
  }, [selectedDate]);

  return (
    <div
      role="dialog"
      aria-label="캘린더"
      ref={calendarRef}
      className={cn(
        'absolute z-50 mt-2 flex w-[336px] flex-col gap-3 rounded-xl border-[1px] border-secondary-200 bg-white px-[43px] py-6 shadow-xl',
        'tablet:left-auto',
        'left-1/2 -translate-x-[calc(50%+4px)] transform tablet:transform-none',
        className,
      )}
    >
      <Calender
        mode="single"
        onSelect={handleSelectDate}
        selected={tempSelectedDate}
        defaultMonth={tempSelectedDate || new Date()}
      />

      <span className="flex h-10 gap-2">
        <Button
          role="button"
          aria-label="초기화"
          onClick={onReset}
          disabled={!tempSelectedDate}
          className="p-2"
          variant="outlined"
        >
          초기화
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!tempSelectedDate}
          className="p-2"
        >
          적용
        </Button>
      </span>
    </div>
  );
}
