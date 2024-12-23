import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { type CreateGatheringForm } from '~/src/components/gatherings/create-gathering-modal/schema';
import { post } from '~/src/services/api';
import { type CreateGatheringResponse } from '~/src/services/gatherings/types';
import { useJoinGathering } from '~/src/services/gatherings/use-join-gathering';
import { type GatheringType } from '~/src/services/types';
import { convertTo24Hour, getDateForFormData } from '~/src/utils/date';

export default function useCreateGathering() {
  const queryClient = useQueryClient();

  const { mutate: joinGathering } = useJoinGathering();

  return useMutation({
    mutationFn: (form: CreateGatheringForm) => {
      const { name, location, type, date, image, capacity } = form;

      const appendDateTime = (dateObj: typeof date.gathering) => {
        const adjustedHour = convertTo24Hour(dateObj);
        return getDateForFormData(dateObj.date, adjustedHour, dateObj.minutes);
      };

      const formData = new FormData();
      formData.append('name', name);
      formData.append('location', location);
      formData.append('type', type);
      formData.append('dateTime', appendDateTime(date.gathering));
      formData.append('capacity', capacity);
      formData.append('image', image);

      //마감날짜는 있을때만 전송
      if (date.registration) {
        formData.append('registrationEnd', appendDateTime(date.registration));
      }

      return post<CreateGatheringResponse>(`/gatherings`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (response, request) => {
      joinGathering(response.id, {
        onSettled: () => {
          toast.success('모임이 생성되었습니다.');

          // post 요청 후 쿼리 무효화
          // 해당하는 타입만 최신화 하도록 작성
          queryClient.invalidateQueries({
            predicate: ({ queryKey }) => {
              if (queryKey[0] !== 'gatherings') return false;

              const { type } = queryKey[1] as { type?: GatheringType };

              if (
                request.type === 'MINDFULNESS' ||
                request.type === 'OFFICE_STRETCHING'
              ) {
                return type === request.type || type === 'DALLAEMFIT';
              }

              return type === request.type;
            },
          });
        },
      });
    },
  });
}
