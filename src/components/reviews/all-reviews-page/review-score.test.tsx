import { render, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import ReviewScore from '~/src/components/reviews/all-reviews-page/review-score';
import { server } from '~/src/mocks/server';
import { baseUrl } from '~/src/mocks/utils';
import { wrapper } from '~/src/utils/wrapper';

describe('ReviewScore', () => {
  it('기본 렌더링', async () => {
    const { getByText } = render(<ReviewScore />, { wrapper });

    await waitFor(() => {
      expect(getByText('4.3')).toBeInTheDocument();
      expect(getByText('/5')).toBeInTheDocument();
    });
  });

  it('별점이 없을때 렌더링', async () => {
    server.use(
      http.get(baseUrl('/reviews/scores'), () => {
        return HttpResponse.json([
          {
            averageScore: 0,
            oneStar: 0,
            twoStars: 0,
            threeStars: 0,
            fourStars: 0,
            fiveStars: 0,
          },
        ]);
      }),
    );

    const { getByText } = render(<ReviewScore />, { wrapper });

    await waitFor(() => {
      expect(getByText('0.0')).toBeInTheDocument();
      expect(getByText('/5')).toBeInTheDocument();
    });
  });
});
