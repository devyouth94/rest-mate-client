import { useRef, useState } from 'react';

import SortIcon from '~/src/assets/icons/sort.svg';
import Dropdown from '~/src/components/common/dropdown';
import { cn } from '~/src/utils/class-name';

interface FilterProps extends React.ComponentPropsWithoutRef<'button'> {
  options: string[];
  className?: string;
  onOptionSelect?: (option: string) => void;
}

export default function LeftFilter({
  options,
  className,
  onOptionSelect,
  ...rest
}: FilterProps) {
  const [selected, setSelected] = useState(options[0] || '');
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const selectOption = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    onOptionSelect?.(option);
  };

  return (
    <div className="relative whitespace-nowrap">
      <button
        ref={triggerRef}
        {...rest}
        onClick={toggleDropdown}
        className={cn(
          'flex rounded-xl border-[2px] border-secondary-100 bg-white text-secondary-800 hover:bg-secondary-50',
          'h-9 w-9 px-[6px] py-[6px]',
          'tablet:h-10 tablet:w-auto tablet:min-w-[120px] tablet:gap-[10px] tablet:px-[10px] tablet:py-[6px]',
          className,
        )}
      >
        <SortIcon className="h-6 w-6" role="img" aria-label="정렬 아이콘" />

        <div
          className={cn(
            'hidden flex-col items-center justify-center py-[2px] text-sm tablet:block',
            className,
          )}
        >
          {selected}
        </div>
      </button>

      {isOpen && (
        <Dropdown
          className="right-0"
          options={options}
          onSelect={selectOption}
          version="Filter"
          selectedOption={selected}
          onClose={() => setIsOpen(false)}
          filterRef={triggerRef}
        />
      )}
    </div>
  );
}
