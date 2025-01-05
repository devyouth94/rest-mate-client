import { type ComponentPropsWithoutRef } from 'react';
import { type ControllerRenderProps } from 'react-hook-form';

import { ScrollArea } from '~/src/components/common/scroll-area';
import { type CreateGatheringForm } from '~/src/components/gatherings/create-gathering-modal/schema';
import { cn } from '~/src/utils/class-name';

const AMPM = ['AM', 'PM'];
const HOUR = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

interface Props {
  type: 'gathering' | 'registration';
  field: ControllerRenderProps<CreateGatheringForm, 'date'>;
}

export default function TimePicker({ type, field }: Props) {
  const selectedDate = field.value[type];

  const now = new Date();
  const nowTime = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentAmPm = nowTime >= 12 ? 'PM' : 'AM';

  const isToday = selectedDate?.date?.toDateString() === now.toDateString();

  // 시간 비활성화 체크 함수
  const isHourDisabled = (hour: number) => {
    if (!isToday) return false;

    const isAMSelected = selectedDate?.ampm === 'AM';
    const isPMNow = currentAmPm === 'PM';

    if (isAMSelected && isPMNow) return true;

    return (
      selectedDate?.ampm === currentAmPm &&
      (currentAmPm === 'PM'
        ? hour === 12 || hour < (nowTime % 12 || 12)
        : hour === 12 || hour < nowTime) // AM일 때 12시도 체크
    );
  };

  // 분 비활성화 체크 함수
  const isMinutesDisabled = (minutes: number) => {
    if (!isToday) return false;

    const isAMSelected = selectedDate?.ampm === 'AM';
    const isPMNow = currentAmPm === 'PM';

    if (isAMSelected && isPMNow) return true;

    return (
      selectedDate?.ampm === currentAmPm &&
      selectedDate?.hour === (nowTime % 12 || 12) &&
      minutes <= currentMinutes
    );
  };

  const handleTimeSelect = (value: number, timeType: 'hour' | 'minutes') => {
    field.onChange({
      ...field.value,
      [type]: { ...field.value[type], [timeType]: value },
    });
  };

  return (
    <div className="flex max-h-[258px] w-full divide-x divide-secondary-200 *:w-full *:px-2.5">
      <ScrollArea>
        {AMPM.map((ampm) => (
          <TimeItem
            key={ampm}
            selected={selectedDate?.ampm === ampm}
            onClick={() =>
              field.onChange({
                ...field.value,
                [type]: { date: selectedDate!.date, ampm },
              })
            }
          >
            {ampm}
          </TimeItem>
        ))}
      </ScrollArea>

      <ScrollArea>
        {HOUR.map((hour) => (
          <TimeItem
            key={hour}
            selected={selectedDate?.hour === hour}
            onClick={() => handleTimeSelect(hour, 'hour')}
            disabled={isHourDisabled(hour)}
          >
            {hour.toString().padStart(2, '0')}
          </TimeItem>
        ))}
      </ScrollArea>

      <ScrollArea>
        {MINUTES.map((minutes) => (
          <TimeItem
            key={minutes}
            selected={selectedDate?.minutes === minutes}
            onClick={() => handleTimeSelect(minutes, 'minutes')}
            disabled={isMinutesDisabled(minutes)}
          >
            {minutes.toString().padStart(2, '0')}
          </TimeItem>
        ))}
      </ScrollArea>
    </div>
  );
}

interface TimeItemProps extends ComponentPropsWithoutRef<'button'> {
  selected: boolean;
}

function TimeItem({ children, disabled, selected, ...props }: TimeItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'flex h-10 w-full items-center justify-center rounded-lg text-sm disabled:text-secondary-400 tablet:h-[33px] tablet:w-[42px]',
        selected && 'bg-primary-500 text-white',
      )}
      {...props}
    >
      {children}
    </button>
  );
}
