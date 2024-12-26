import { act, render, screen } from '@testing-library/react';
import useBreakpoint from 'use-breakpoint';

import CardContainer from '~/src/components/gathering-card/card-container';
import { useGatheringFilter } from '~/src/hooks/gatherings/use-gathering-filter';
import useGatherings from '~/src/services/gatherings/use-gatherings';

jest.mock('use-breakpoint');
jest.mock('~/src/hooks/gatherings/use-gathering-filter');
jest.mock('~/src/services/gatherings/use-gatherings');

const mockGathering = {
  id: 1,
  type: 'DALLAEMFIT',
  name: '테스트 모임',
  dateTime: '2024-12-31T14:00:00',
  registrationEnd: '2024-12-30T23:59:59',
  location: '건대입구',
  capacity: 20,
  participantCount: 5,
  image: 'https://picsum.photos/400?random=1',
  createdBy: 1,
  canceledAt: null,
};

beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver
    implements IntersectionObserver
  {
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }

    private callback: IntersectionObserverCallback;

    disconnect(): void {}
    observe(): void {}
    unobserve(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  };
});

describe('CardContainer', () => {
  beforeEach(() => {
    // 기본 모킹 설정
    (useBreakpoint as jest.Mock).mockReturnValue({ breakpoint: 'mobile' });
    (useGatheringFilter as jest.Mock).mockReturnValue({
      type: null,
      location: null,
      date: null,
      sortBy: null,
    });
  });

  it('데이터를 성공적으로 가져와야 함', async () => {
    (useGatherings as jest.Mock).mockReturnValue({
      data: [[mockGathering]],
      isFetching: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    render(<CardContainer />);

    expect(screen.getByText(/테스트 모임/)).toBeInTheDocument();
  });

  it('로딩 중일 때 Loading 컴포넌트를 표시해야 함', () => {
    (useGatherings as jest.Mock).mockReturnValue({
      data: [],
      isFetching: true,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    render(<CardContainer />);

    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it('다음 페이지가 존재할 때 fetchNextPage가 호출되어야 함', () => {
    const mockFetchNextPage = jest.fn();

    (useGatherings as jest.Mock).mockReturnValue({
      data: [[mockGathering]],
      isFetching: false,
      hasNextPage: true,
      fetchNextPage: mockFetchNextPage,
    });

    const mockObserve = jest.fn();
    const mockDisconnect = jest.fn();

    window.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: jest.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
      takeRecords: jest.fn(),
    }));

    render(<CardContainer />);

    // IntersectionObserver의 콜백을 직접 호출하여 fetchNextPage가 호출되도록 함
    const observerCallback = (window.IntersectionObserver as jest.Mock).mock
      .calls[0][0];
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  it('데이터가 없을 때 안내 메시지를 표시해야 함', () => {
    (useGatherings as jest.Mock).mockReturnValue({
      data: [],
      isFetching: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    render(<CardContainer />);

    expect(screen.getByText(/아직 모임이 없어요/)).toBeInTheDocument();
  });

  it('태블릿/데스크톱에서는 Large 카드를 표시해야 함', () => {
    (useBreakpoint as jest.Mock).mockReturnValue({ breakpoint: 'tablet' });
    (useGatherings as jest.Mock).mockReturnValue({
      data: [[mockGathering]],
      isFetching: false,
      hasNextPage: false,
    });

    render(<CardContainer />);

    expect(screen.getByRole('card-large')).toBeInTheDocument();
  });

  it('모바일에서는 Small 카드를 표시해야 함', () => {
    (useBreakpoint as jest.Mock).mockReturnValue({ breakpoint: 'mobile' });
    (useGatherings as jest.Mock).mockReturnValue({
      data: [[mockGathering]],
      isFetching: false,
      hasNextPage: false,
    });

    render(<CardContainer />);

    expect(screen.getByRole('card-small')).toBeInTheDocument();
  });

  it('무한 스크롤 observer가 설정되어야 함', () => {
    const mockObserve = jest.fn();
    const mockDisconnect = jest.fn();

    // IntersectionObserver 모킹
    window.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: jest.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
      takeRecords: jest.fn(),
    }));

    (useGatherings as jest.Mock).mockReturnValue({
      data: [[mockGathering]],
      isFetching: false,
      hasNextPage: true,
      fetchNextPage: jest.fn(),
    });

    render(<CardContainer />);

    expect(mockObserve).toHaveBeenCalled();
  });

  it('스크롤 시 fetchNextPage가 호출되어야 함', () => {
    const mockFetchNextPage = jest.fn();

    (useGatherings as jest.Mock).mockReturnValue({
      data: [[mockGathering]],
      isFetching: false,
      hasNextPage: true,
      fetchNextPage: mockFetchNextPage,
    });

    const mockObserve = jest.fn();
    const mockDisconnect = jest.fn();

    // IntersectionObserver 모킹
    window.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: jest.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
      takeRecords: jest.fn(),
    }));

    render(<CardContainer />);

    // IntersectionObserver의 콜백을 직접 호출하여 fetchNextPage가 호출되도록 함
    const observerCallback = (window.IntersectionObserver as jest.Mock).mock
      .calls[0][0];
    observerCallback([{ isIntersecting: true }]);

    // fetchNextPage가 호출되었는지 확인
    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  it('새로운 데이터가 로드되면 UI가 업데이트되어야 함', () => {
    const newGathering = { ...mockGathering, id: 2, name: '새로운 모임' };

    (useGatherings as jest.Mock).mockReturnValue({
      data: [[mockGathering], [newGathering]],
      isFetching: false,
      hasNextPage: false,
    });

    render(<CardContainer />);

    // 새로운 모임이 화면에 표시되는지 확인
    expect(screen.getByText(/새로운 모임/)).toBeInTheDocument();
  });

  it('취소된 모임은 필터링되어야 함', () => {
    const canceledGathering = { ...mockGathering, canceledAt: new Date() };
    (useGatherings as jest.Mock).mockReturnValue({
      data: [[canceledGathering]],
      isFetching: false,
      hasNextPage: false,
    });

    render(<CardContainer />);

    expect(screen.getByText(/아직 모임이 없어요/)).toBeInTheDocument();
  });
});
