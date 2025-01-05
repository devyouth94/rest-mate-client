'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { get } from '~/src/services/api';
import { gatheringsQueryKeys } from '~/src/services/gatherings/queryKey';
import { type GetGatheringReviewResponse } from '~/src/services/gatherings/types';

interface UseGatheringReviewProps {
  gatheringId: number;
  initialData?: GetGatheringReviewResponse;
  limit?: number;
  page?: number;
}

export default function useGatheringReview({
  gatheringId,
  initialData,
  limit = 5,
  page = 1,
}: UseGatheringReviewProps) {
  const [currentPage, setCurrentPage] = useState(page);

  const query = useQuery({
    queryKey: [
      gatheringsQueryKeys.gatheringReview({ gatheringId }),
      currentPage,
    ],
    queryFn: async (): Promise<GetGatheringReviewResponse> => {
      const response = await get<GetGatheringReviewResponse>('/reviews', {
        params: {
          gatheringId,
          limit,
          offset: (currentPage - 1) * limit,
        },
      });
      return response;
    },
    initialData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    ...query,
    currentPage,
    setCurrentPage,
  };
}
