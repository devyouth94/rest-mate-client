import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'jotai';

import TabBottom from '~/src/components/mypage/tab-bottom';

describe('TabBottom Component', () => {
  test('초기 렌더링에서 탭 레이블과 스타일이 올바르게 표시되는지 확인', () => {
    render(
      <Provider>
        <TabBottom />
      </Provider>,
    );

    expect(screen.getByText('작성 가능한 리뷰')).toBeInTheDocument();
    expect(screen.getByText('작성한 리뷰')).toBeInTheDocument();

    expect(screen.getByText('작성 가능한 리뷰')).toHaveClass(
      'bg-secondary-900',
    );
    expect(screen.getByText('작성한 리뷰')).toHaveClass('bg-secondary-200');
  });

  test('탭을 클릭하면 선택된 탭의 스타일이 변경되는지 확인', () => {
    render(
      <Provider>
        <TabBottom />
      </Provider>,
    );

    const writableReviewsButton = screen.getByText('작성 가능한 리뷰');
    const writtenReviewsButton = screen.getByText('작성한 리뷰');

    fireEvent.click(writtenReviewsButton);

    expect(writtenReviewsButton).toHaveClass('bg-secondary-900');
    expect(writableReviewsButton).toHaveClass('bg-secondary-200');
  });

  test('탭 클릭 시 reviewSubTabAtom 상태가 업데이트되는지 확인', () => {
    render(
      <Provider>
        <TabBottom />
      </Provider>,
    );

    const writableReviewsButton = screen.getByText('작성 가능한 리뷰');
    const writtenReviewsButton = screen.getByText('작성한 리뷰');

    fireEvent.click(writtenReviewsButton);

    expect(writtenReviewsButton).toHaveClass('bg-secondary-900');
    expect(writableReviewsButton).toHaveClass('bg-secondary-200');
  });
});
