import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';

import DataRenderer from '~/src/components/mypage/data-render';
import { type User } from '~/src/services/auths/types';
import { accessTokenAtom, userInfoAtom } from '~/src/stores/auth-store';
import { activeTabAtom, reviewSubTabAtom } from '~/src/stores/my-page-atoms';

beforeAll(() => {
  class MockIntersectionObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords = jest.fn();
  }

  Object.defineProperty(MockIntersectionObserver, 'prototype', {
    value: MockIntersectionObserver.prototype,
  });

  global.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
});

describe('DataRenderer 컴포넌트 테스트', () => {
  const renderWithProviders = ({
    activeTab = 'myReviews',
    reviewSubTab = 'writableReviews',
    user = { id: 1, name: '테스트 유저' } as Partial<User>,
    accessToken = 'test-token',
  } = {}) => {
    const queryClient = new QueryClient();

    const store = createStore();
    store.set(
      activeTabAtom,
      activeTab as 'myReviews' | 'myGroups' | 'createdGroups',
    );
    store.set(
      reviewSubTabAtom,
      reviewSubTab as 'writtenReviews' | 'writableReviews',
    );
    store.set(userInfoAtom, user as User);
    store.set(accessTokenAtom, accessToken);

    return render(
      <QueryClientProvider client={queryClient}>
        <JotaiProvider store={store}>
          <DataRenderer />
        </JotaiProvider>
      </QueryClientProvider>,
    );
  };

  it('작성 가능한 리뷰가 없을 경우 빈 상태 메시지를 렌더링해야 한다.', async () => {
    renderWithProviders({
      activeTab: 'myReviews',
      reviewSubTab: 'writableReviews',
    });

    const emptyMessage =
      await screen.findByText('아직 작성 가능한 리뷰가 없어요');
    expect(emptyMessage).toBeInTheDocument();
  });

  it('작성한 리뷰가 없을 경우 빈 상태 메시지를 렌더링해야 한다.', async () => {
    renderWithProviders({
      activeTab: 'myReviews',
      reviewSubTab: 'writtenReviews',
    });

    const emptyMessage = await screen.findByText('아직 작성한 리뷰가 없어요');
    expect(emptyMessage).toBeInTheDocument();
  });

  it('신청한 모임이 없을 경우 빈 상태 메시지를 렌더링해야 한다.', async () => {
    renderWithProviders({
      activeTab: 'myGroups',
    });

    const emptyMessage = await screen.findByText('신청한 모임이 아직 없어요');
    expect(emptyMessage).toBeInTheDocument();
  });

  it('만든 모임이 없을 경우 빈 상태 메시지를 렌더링해야 한다.', async () => {
    renderWithProviders({
      activeTab: 'createdGroups',
    });

    const emptyMessage = await screen.findByText('아직 만든 모임이 없어요');
    expect(emptyMessage).toBeInTheDocument();
  });

  it('GroupCard와 ReviewCardItem이 데이터를 기반으로 렌더링되어야 한다.', async () => {
    renderWithProviders({
      activeTab: 'myGroups',
    });

    await waitFor(() => screen.getAllByRole('listitem'));
    const groupCards = screen.getAllByRole('listitem');
    expect(groupCards).toHaveLength(1); // mock 데이터 기준
  });
});
