import { act, renderHook, waitFor } from '@testing-library/react';

import useReviewFilterAtom from '~/src/hooks/reviews/use-review-filter-atom';
import useGetReviewScore from '~/src/services/reviews/use-get-review-score';
import { wrapper } from '~/src/utils/wrapper';

describe('useGetReviewScore', () => {
  it('초기값이 잘 반환되는가', async () => {
    const { result } = renderHook(() => useGetReviewScore(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual({
        average: 4.3,
        score: [4, 5, 1, 0, 0],
        sum: 10,
      });
    });
  });

  it('필터 변경시 새로운 데이터가 잘 반환되는가', async () => {
    const { result: filterResult } = renderHook(() => useReviewFilterAtom());
    const { result: scoreResult } = renderHook(() => useGetReviewScore(), {
      wrapper,
    });

    act(() => {
      filterResult.current.onChangeFilter({ type: 'WORKATION' });
    });

    await waitFor(() => {
      expect(scoreResult.current.data).toEqual({
        average: 5,
        score: [3, 0, 0, 0, 0],
        sum: 3,
      });
    });
  });
});
