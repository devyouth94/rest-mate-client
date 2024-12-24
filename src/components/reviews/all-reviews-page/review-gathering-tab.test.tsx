import { render, renderHook, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ReviewGatheringTab from '~/src/components/reviews/all-reviews-page/review-gathering-tab';
import useReviewFilterAtom from '~/src/hooks/reviews/use-review-filter-atom';

describe('ReviewGatheringTab', () => {
  it('탭 버튼이 잘 렌더링 되는가', () => {
    const { getByText } = render(<ReviewGatheringTab />);

    expect(getByText('달램핏')).toBeInTheDocument();
    expect(getByText('전체')).toBeInTheDocument();
  });

  it('탭 변경이 잘 되는가', async () => {
    const user = userEvent.setup();
    const { getByText } = render(<ReviewGatheringTab />);
    const { result } = renderHook(() => useReviewFilterAtom());

    const workationTab = getByText('워케이션');

    await user.click(workationTab);

    await waitFor(() => {
      expect(result.current.filter.type).toBe('WORKATION');
    });
  });
});
