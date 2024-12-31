import { type ControllerRenderProps } from 'react-hook-form';

import Calender from '~/src/components/common/calender';
import { type CreateGatheringForm } from '~/src/components/gatherings/create-gathering-modal/schema';

interface Props {
  type: 'gathering' | 'registration';
  field: ControllerRenderProps<CreateGatheringForm, 'date'>;
}

export default function DatePicker({ type, field }: Props) {
  return (
    <Calender
      mode="single"
      selected={field.value[type]?.date}
      onSelect={(date) =>
        field.onChange({
          ...field.value,
          [type]: { date },
        })
      }
      disabled={(date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
      }}
    />
  );
}
