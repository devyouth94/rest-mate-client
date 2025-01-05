import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CreateReviewModal from '~/src/components/reviews/create-review-modal';

jest.mock('~/src/services/reviews/use-create-review', () => ({
  __esModule: true,
  default: () => ({
    mutate: jest.fn((_, { onSuccess }) => onSuccess()),
    isPending: false,
  }),
}));

describe('CreateReviewModal', () => {
  it('모달이 잘 열리는가', async () => {
    const user = userEvent.setup();
    const { getByText } = render(<CreateReviewModal gatheringId={1} />);

    await user.click(getByText('리뷰 작성하기'));

    await waitFor(() => {
      expect(getByText('리뷰 쓰기')).toBeInTheDocument();
    });
  });

  it('모달이 잘 닫히는가', async () => {
    const user = userEvent.setup();
    const { getByText, queryByText } = render(
      <CreateReviewModal gatheringId={1} />,
    );

    await user.click(getByText('리뷰 작성하기'));
    await user.click(getByText('취소'));

    await waitFor(() => {
      expect(queryByText('리뷰 쓰기')).not.toBeInTheDocument();
    });
  });

  it('폼이 비어있을 때 제출 버튼이 비활성화 되는가', async () => {
    const user = userEvent.setup();
    const { getByText } = render(<CreateReviewModal gatheringId={1} />);

    await user.click(getByText('리뷰 작성하기'));

    await waitFor(() => {
      expect(getByText('리뷰 등록')).toBeDisabled();
    });
  });
});
