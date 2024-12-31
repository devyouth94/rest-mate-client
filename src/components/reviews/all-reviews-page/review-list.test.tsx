import { render, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import ReviewList from '~/src/components/reviews/all-reviews-page/review-list';
import { server } from '~/src/mocks/server';
import { baseUrl } from '~/src/mocks/utils';
import { wrapper } from '~/src/utils/wrapper';

describe('ReviewList', () => {
  it('리뷰 목록을 렌더링 하는가', async () => {
    const { getByText } = render(<ReviewList />, { wrapper });

    await waitFor(() => {
      expect(getByText('마음이 차분해지는 시간이었습니다')).toBeInTheDocument();
      expect(
        getByText('업무 중간에 하는 스트레칭이 정말 도움이 되네요'),
      ).toBeInTheDocument();
    });
  });

  it('리뷰가 없을때 메시지가 잘 표시 되는가', async () => {
    server.use(
      http.get(baseUrl('/reviews'), () => {
        return HttpResponse.json({
          data: [],
          totalItemCount: 0,
          currentPage: 1,
          totalPages: 1,
        });
      }),
    );

    const { getByText } = render(<ReviewList />, { wrapper });

    await waitFor(() => {
      expect(getByText('아직 리뷰가 없어요')).toBeInTheDocument();
    });
  });
});
