import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';

import GroupCard from '~/src/components/mypage/group-card';
import { useCancelGathering } from '~/src/services/mypage/use-leave-joined-gathering';
import { type GatheringLocation } from '~/src/services/types';
import { userInfoAtom } from '~/src/stores/auth-store';
import { activeTabAtom } from '~/src/stores/my-page-atoms';

jest.mock('~/src/services/mypage/use-leave-joined-gathering', () => ({
  useCancelGathering: jest.fn(),
}));

const mockLeaveGathering = jest.fn();
const mockOnSuccess = jest.fn();

describe('GroupCard 컴포넌트 테스트', () => {
  const mockProps = {
    joinedGathering: {
      id: 1,
      name: '테스트 모임',
      dateTime: '2024-12-31T10:00:00Z',
      participantCount: 5,
      capacity: 10,
      location: '건대입구' as GatheringLocation,
      isCompleted: false,
      isReviewed: false,
      image: '',
    },
    state: 'default' as 'default' | 'disabled',
  };

  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    (useCancelGathering as jest.Mock).mockReturnValue({
      mutate: jest.fn((data, options) => {
        mockLeaveGathering(data);
        if (options?.onSuccess) options.onSuccess();
      }),
    });

    queryClient = new QueryClient();
  });

  const renderWithProviders = (props = mockProps) => {
    const store = createStore();
    store.set(activeTabAtom, 'myGroups');
    store.set(userInfoAtom, {
      id: 1,
      name: '테스트 유저',
      email: 'test@example.com',
      companyName: '테스트 회사',
      image: 'test-image.jpg',
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z',
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <JotaiProvider store={store}>
          <GroupCard {...props} />
        </JotaiProvider>
      </QueryClientProvider>,
    );
  };

  it('컴포넌트를 올바르게 렌더링해야 한다.', () => {
    renderWithProviders();

    expect(screen.getByText('테스트 모임')).toBeInTheDocument();
    expect(screen.getByText('건대입구')).toBeInTheDocument();
    expect(screen.getByText('예약 취소하기')).toBeInTheDocument();
  });

  it('예약 취소 버튼 클릭 시 모임 상태를 업데이트해야 한다.', async () => {
    renderWithProviders();

    const cancelButton = screen.getByText('예약 취소하기');
    fireEvent.click(cancelButton);

    expect(mockLeaveGathering).toHaveBeenCalledWith({ gatheringId: 1 });
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('과거 날짜의 모임은 "disabled" 상태로 렌더링되어야 한다.', () => {
    renderWithProviders({
      ...mockProps,
      state: 'disabled',
      joinedGathering: {
        ...mockProps.joinedGathering,
        dateTime: '2024-01-01T10:00:00Z',
      },
    });

    expect(
      screen.queryByText((content) =>
        content.includes('모집 취소된 모임이에요'),
      ),
    ).toBeInTheDocument();
  });

  it('모임이 완료되었을 때 리뷰 작성 모달을 렌더링해야 한다.', () => {
    renderWithProviders({
      ...mockProps,
      joinedGathering: { ...mockProps.joinedGathering, isCompleted: true },
    });

    expect(screen.queryByText('예약 취소하기')).not.toBeInTheDocument();
    expect(screen.getByText(/리뷰 작성하기/)).toBeInTheDocument();
  });

  it('유저 ID가 없을 경우 예약 취소를 시도하지 않아야 한다.', () => {
    const store = createStore();
    store.set(activeTabAtom, 'myGroups');
    store.set(userInfoAtom, null);

    render(
      <QueryClientProvider client={queryClient}>
        <JotaiProvider store={store}>
          <GroupCard {...mockProps} />
        </JotaiProvider>
      </QueryClientProvider>,
    );

    const cancelButton = screen.getByText('예약 취소하기');
    fireEvent.click(cancelButton);

    expect(mockLeaveGathering).not.toHaveBeenCalled();
  });
});
