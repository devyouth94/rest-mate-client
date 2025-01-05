import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { del } from '~/src/services/api';
import { type ErrorResponseData } from '~/src/services/auths/types';
import { gatheringsQueryKeys } from '~/src/services/gatherings/queryKey';
import { type JoinedGathering } from '~/src/services/gatherings/types';

export function useLeaveGathering() {
  const queryClient = useQueryClient();
  return useMutation<JoinedGathering, ErrorResponseData, number>({
    mutationFn: (gatheringId: number) =>
      del<JoinedGathering>(`/gatherings/${gatheringId}/leave`),
    onSuccess: (_data, gatheringId) => {
      toast.success('모임 참여를 취소했습니다.');
      queryClient.invalidateQueries({ queryKey: ['joinedGathering'] });
      queryClient.invalidateQueries({
        queryKey: gatheringsQueryKeys.gatheringParticipants({ gatheringId }),
      });

      queryClient.invalidateQueries({
        queryKey: gatheringsQueryKeys.gatheringDetail({ id: gatheringId }),
      });
    },
    onError: (error) => {
      switch (error.data.code) {
        case 'GATHERING_CANCELED':
          toast.error('취소된 모임입니다.');
          break;
        case 'UNAUTHORIZED':
          toast.error('로그인이 필요합니다.');
          break;
        case 'NOT_FOUND':
          toast.error('모임을 찾을 수 없습니다.');
          break;
        default:
          toast.error('모임 참여 취소에 실패했습니다.');
      }
    },
  });
}
