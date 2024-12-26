import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import GatheringDetailContent from '~/src/components/gathering-card/gathering-detail-content';
import useGatheringDetail from '~/src/services/gatherings/use-gathering-detail';

// useGatheringDetail 훅을 모의
jest.mock('~/src/services/gatherings/use-gathering-detail');

const queryClient = new QueryClient();

describe('GatheringDetailContent', () => {
  const mockData = {
    image: '/test.jpg',
    registrationEnd: '2024-01-01T00:00:00',
    dateTime: '2024-01-01T12:00:00',
    location: '서울',
    name: '테스트 모임',
    type: '온라인',
  };

  it('로딩 중일 때 Loading 컴포넌트를 렌더링해야 함', () => {
    (useGatheringDetail as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <GatheringDetailContent gatheringId={1} />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('에러가 발생했을 때 에러 메시지를 렌더링해야 함', () => {
    (useGatheringDetail as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <GatheringDetailContent gatheringId={1} />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/에러가 발생했습니다./i)).toBeInTheDocument();
  });

  it('데이터가 있을 때 GatheringDetailImage, GatheringInfo, FloatingBar를 렌더링해야 함', () => {
    (useGatheringDetail as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <GatheringDetailContent gatheringId={1} />
      </QueryClientProvider>,
    );

    expect(screen.getByAltText(/gathering image/i)).toBeInTheDocument();
    // GatheringInfo와 FloatingBar에 대한 추가적인 검증을 여기에 추가할 수 있습니다.
  });
});
