import {
  calculateAverageScore,
  calculatePaginationData,
  calculateParticipantCounts,
  calculateScoreStats,
  filterReviews,
  sortReviews,
} from '~/src/mocks/handler/reviews';
import reviewJSON from '~/src/mocks/handler/reviews.json';

describe('리뷰 핸들러 유틸리티 함수 테스트', () => {
  const mockReviews = reviewJSON.data;

  describe('filterReviews', () => {
    it('타입으로 필터링이 정상 작동하는가', () => {
      const filteredReviews = filterReviews(mockReviews, {
        type: 'OFFICE_STRETCHING',
      });
      expect(
        filteredReviews.every(
          (review) => review.Gathering.type === 'OFFICE_STRETCHING',
        ),
      ).toBe(true);
    });

    it('달램핏 타입에 오피스 스트레칭과 마인드풀니스 타입이 잘 포함되는가', () => {
      const filteredReviews = filterReviews(mockReviews, {
        type: 'DALLAEMFIT',
      });
      expect(
        filteredReviews.every((review) =>
          ['OFFICE_STRETCHING', 'MINDFULNESS'].includes(review.Gathering.type),
        ),
      ).toBe(true);
    });

    it('위치로 필터링 되는가', () => {
      const filteredReviews = filterReviews(mockReviews, {
        type: 'DALLAEMFIT',
        location: '신림',
      });
      expect(
        filteredReviews.every((review) => review.Gathering.location === '신림'),
      ).toBe(true);
    });

    it('날짜로 필터링 되는가', () => {
      const filteredReviews = filterReviews(mockReviews, {
        type: 'MINDFULNESS',
        date: '2024-12-30',
      });
      expect(
        filteredReviews.every(
          (review) => review.createdAt.split('T')[0] === '2024-12-30',
        ),
      ).toBe(true);
    });
  });

  describe('calculateParticipantCounts', () => {
    it('참여자 수가 정상적으로 계산되는가', () => {
      const participantCounts = calculateParticipantCounts(mockReviews);
      const gatheringId = mockReviews[0].Gathering.id;
      const expectedCount = mockReviews.filter(
        (review) => review.Gathering.id === gatheringId,
      ).length;

      expect(participantCounts[gatheringId]).toBe(expectedCount);
    });
  });

  describe('sortReviews', () => {
    const participantCounts = calculateParticipantCounts(mockReviews);

    it('생성일로 정렬이 정상적으로 작동하는가', () => {
      const sortedReviews = sortReviews(
        mockReviews,
        'createdAt',
        participantCounts,
      );

      expect(sortedReviews[0].createdAt >= sortedReviews[1].createdAt).toBe(
        true,
      );
    });

    it('리뷰 점수 기준으로 정렬이 정삭적으로 작동하는가', () => {
      const sortedReviews = sortReviews(
        mockReviews,
        'score',
        participantCounts,
      );
      expect(sortedReviews[0].score >= sortedReviews[1].score).toBe(true);
    });

    it('참여자 수 기준으로 정렬이 정삭적으로 작동하는가', () => {
      const sortedReviews = sortReviews(
        mockReviews,
        'participantCount',
        participantCounts,
      );
      expect(
        participantCounts[sortedReviews[0].Gathering.id] >=
          participantCounts[sortedReviews[1].Gathering.id],
      ).toBe(true);
    });
  });

  describe('calculatePaginationData', () => {
    it('페이지네이션 데이터를 정확히 계산해야 함', () => {
      const result = calculatePaginationData(mockReviews, '0', '10');
      expect(result.data.length).toBeLessThanOrEqual(10);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(Math.ceil(mockReviews.length / 10));
      expect(result.totalItemCount).toBe(mockReviews.length);
    });
  });

  describe('calculateScoreStats', () => {
    it('별점 통계를 정확히 계산해야 함', () => {
      const stats = calculateScoreStats(mockReviews);
      const totalCount = Object.values(stats).reduce(
        (sum, count) => sum + count,
        0,
      );
      expect(totalCount).toBe(mockReviews.length);
    });
  });

  describe('calculateAverageScore', () => {
    it('평균 점수를 정확히 계산해야 함', () => {
      const average = calculateAverageScore(mockReviews);
      const expectedAverage =
        mockReviews.reduce((sum, review) => sum + review.score, 0) /
        mockReviews.length;
      expect(average).toBe(expectedAverage);
    });

    it('리뷰가 없을 때 0을 반환해야 함', () => {
      const average = calculateAverageScore([]);
      expect(average).toBe(0);
    });
  });
});
