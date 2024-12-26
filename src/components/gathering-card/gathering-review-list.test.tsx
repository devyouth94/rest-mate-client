import { render, screen } from '@testing-library/react';

import GatheringReviewList from '~/src/components/gathering-card/gathering-review-list';
import type { GatheringReview } from '~/src/services/gatherings/types';
import useGatheringReview from '~/src/services/gatherings/use-gathering-review';

jest.mock('~/src/services/gatherings/use-gathering-review');

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      };
    };
});

describe('GatheringReviewList', () => {
  const mockUseGatheringReview = useGatheringReview as jest.Mock;

  it('리뷰가 없을 때 "아직 리뷰가 없어요" 메시지를 렌더링합니다', () => {
    mockUseGatheringReview.mockReturnValue({
      data: { data: [], totalPages: 0 },
      isLoading: false,
      isError: false,
      currentPage: 1,
      setCurrentPage: jest.fn(),
    });

    render(<GatheringReviewList gatheringId={1} />);
    expect(screen.getByText('아직 리뷰가 없어요')).toBeInTheDocument();
  });

  it('에러가 발생��을 때 에러 메시지를 렌더링합니다', () => {
    mockUseGatheringReview.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error('Error fetching data'),
      currentPage: 1,
      setCurrentPage: jest.fn(),
    });

    render(<GatheringReviewList gatheringId={1} />);
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
  });

  it('리뷰가 있을 때 리뷰 목록을 렌더링합니다', () => {
    const reviews: GatheringReview[] = [
      {
        id: 1,
        comment: '리뷰 1',
        score: 5,
        createdAt: '2024-01-01T00:00:00',
        Gathering: {
          id: 1,
          name: '모임 1',
          type: 'DALLAEMFIT',
          dateTime: '2024-01-01T00:00:00',
          location: '건대입구',
          image: '/test.png',
        },
        User: { id: 1, name: '사용자 1', image: '/test.png' },
      },
      {
        id: 2,
        comment: '리뷰 2',
        score: 4,
        createdAt: '2024-01-02T00:00:00',
        Gathering: {
          id: 1,
          name: '모임 1',
          type: 'DALLAEMFIT',
          dateTime: '2024-01-01T00:00:00',
          location: '건대입구',
          image: '/test.png',
        },
        User: { id: 2, name: '사용자 2', image: '/test2.png' },
      },
    ];

    mockUseGatheringReview.mockReturnValue({
      data: { data: reviews, totalPages: 1 },
      isLoading: false,
      isError: false,
      currentPage: 1,
      setCurrentPage: jest.fn(),
    });

    render(<GatheringReviewList gatheringId={1} />);
    expect(screen.getByText('리뷰 1')).toBeInTheDocument();
    expect(screen.getByText('리뷰 2')).toBeInTheDocument();
  });

  it('페이지네이션이 필요한 경우 페이지네이션 컴포넌트를 렌더링합니다', () => {
    const reviews: GatheringReview[] = [
      {
        id: 1,
        comment: '리뷰 1',
        score: 5,
        createdAt: '2024-01-01T00:00:00',
        Gathering: {
          id: 1,
          name: '모임 1',
          type: 'DALLAEMFIT',
          dateTime: '2024-01-01T00:00:00',
          location: '건대입구',
          image: '/test.png',
        },
        User: { id: 1, name: '사용자 1', image: '/test.png' },
      },
    ];

    mockUseGatheringReview.mockReturnValue({
      data: { data: reviews, totalPages: 2 },
      isLoading: false,
      isError: false,
      currentPage: 1,
      setCurrentPage: jest.fn(),
    });

    render(<GatheringReviewList gatheringId={1} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
