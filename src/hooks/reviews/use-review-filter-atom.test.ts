import { act, renderHook } from '@testing-library/react';

import useReviewFilterAtom from '~/src/hooks/reviews/use-review-filter-atom';

describe('useReviewFilterAtom', () => {
  it('초기값이 잘 반환됨', () => {
    const { result } = renderHook(() => useReviewFilterAtom());

    expect(result.current.filter).toEqual({
      type: 'DALLAEMFIT',
      sortBy: 'createdAt',
    });
  });

  it('onChangeFilter가 잘 작동함', () => {
    const { result } = renderHook(() => useReviewFilterAtom());
    const { onChangeFilter } = result.current;

    act(() => {
      onChangeFilter({ sortBy: 'score' });
    });

    expect(result.current.filter).toEqual({
      type: 'DALLAEMFIT',
      sortBy: 'score',
    });
  });
});
