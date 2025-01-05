import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { type ControllerRenderProps } from 'react-hook-form';

import CalendarIcon from '~/src/assets/icons/calendar.svg';
import { type CreateGatheringForm } from '~/src/components/gatherings/create-gathering-modal/schema';
import { cn } from '~/src/utils/class-name';
import { getDateForFormData } from '~/src/utils/date';

interface Props extends ComponentPropsWithoutRef<'div'> {
  type: 'gathering' | 'registration';
  field: ControllerRenderProps<CreateGatheringForm, 'date'>;
}

export default forwardRef<HTMLDivElement, Props>(function Trigger(
  { type, field, ...props },
  ref,
) {
  const selectedDate = field.value[type];

  const isFinishedSelect =
    selectedDate?.date &&
    selectedDate?.hour !== undefined &&
    selectedDate?.minutes !== undefined &&
    selectedDate?.ampm;

  return (
    <div
      {...props}
      className={cn(
        'flex w-full cursor-pointer items-center justify-between rounded-xl bg-secondary-50 px-4 font-medium text-secondary-400',
        'h-10 text-sm tablet:h-11 tablet:text-base',
      )}
      ref={ref}
    >
      <span>
        {isFinishedSelect
          ? `${getDateForFormData(selectedDate.date)} ${selectedDate.hour}:${selectedDate.minutes.toString().padStart(2, '0')} ${selectedDate.ampm}`
          : '날짜를 선택해주세요'}
      </span>
      <CalendarIcon />
    </div>
  );
});
