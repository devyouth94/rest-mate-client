import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import useReviewFilterAtom from '~/src/hooks/reviews/use-review-filter-atom';
import { get } from '~/src/services/api';
import { reviewsQueryKeys } from '~/src/services/reviews/queryKey';
import { type GetReviewListResponse } from '~/src/services/reviews/types';

const LIMIT = 10;

export default function useGetJoinedReviewInfiniteList(userId?: number) {
  const { filter: params } = useReviewFilterAtom();

  return useInfiniteQuery({
    queryKey: reviewsQueryKeys.reviewInfiniteList({ ...params, userId }),
    queryFn: ({ pageParam }) =>
      get<GetReviewListResponse>('/reviews', {
        params: { ...params, userId, ...pageParam },
      }),
    placeholderData: keepPreviousData,
    select: ({ pages }) => {
      return pages.flatMap(({ data }) => data);
    },
    initialPageParam: { limit: LIMIT, offset: 0 },
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const nextOffset = lastPageParam.offset + LIMIT;

      return nextOffset >= lastPage.totalItemCount
        ? undefined
        : { limit: LIMIT, offset: nextOffset };
    },
  });
}
