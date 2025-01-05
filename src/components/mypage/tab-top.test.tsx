import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'jotai';

import TabTop from '~/src/components/mypage/tab-top';

describe('TabTop Component', () => {
  test('초기 렌더링에서 탭 레이블과 스타일이 올바르게 표시되는지 확인', () => {
    render(
      <Provider>
        <TabTop />
      </Provider>,
    );

    expect(screen.getByText('나의 모임')).toBeInTheDocument();
    expect(screen.getByText('나의 리뷰')).toBeInTheDocument();
    expect(screen.getByText('내가 만든 모임')).toBeInTheDocument();

    expect(screen.getByText('나의 모임')).toHaveClass('text-secondary-900');
    expect(screen.getByText('나의 리뷰')).toHaveClass('text-secondary-400');
    expect(screen.getByText('내가 만든 모임')).toHaveClass(
      'text-secondary-400',
    );
  });

  test('탭을 클릭하면 선택된 탭의 스타일이 변경되는지 확인', () => {
    render(
      <Provider>
        <TabTop />
      </Provider>,
    );

    const myGroupsButton = screen.getByText('나의 모임');
    const myReviewsButton = screen.getByText('나의 리뷰');
    const createdGroupsButton = screen.getByText('내가 만든 모임');

    fireEvent.click(myReviewsButton);

    expect(myReviewsButton).toHaveClass('text-secondary-900');
    expect(myGroupsButton).toHaveClass('text-secondary-400');
    expect(createdGroupsButton).toHaveClass('text-secondary-400');
  });

  test('탭 클릭 시 activeTabAtom 상태가 업데이트되는지 확인', () => {
    render(
      <Provider>
        <TabTop />
      </Provider>,
    );

    const myGroupsButton = screen.getByText('나의 모임');
    const myReviewsButton = screen.getByText('나의 리뷰');

    fireEvent.click(myReviewsButton);

    expect(myReviewsButton).toHaveClass('text-secondary-900');
    expect(myGroupsButton).toHaveClass('text-secondary-400');
  });
});
