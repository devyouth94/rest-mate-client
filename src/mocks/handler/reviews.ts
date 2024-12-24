import { http, HttpResponse } from 'msw';

import reviewJSON from '~/src/mocks/handler/reviews.json';
import { baseUrl, getQueryParams } from '~/src/mocks/utils';

export const reviewsHandlers = [
  http.get(baseUrl('/reviews'), ({ request }) => {
    const { offset, limit, type, location, date, sortBy } = getQueryParams(
      request.url,
      ['offset', 'limit', 'type', 'location', 'date', 'sortBy'] as const,
    );

    const { data } = reviewJSON;

    // 필터링 적용
    const filteredData = filterReviews(data, { type, location, date });

    // 참여자 수 계산
    const participantCounts = calculateParticipantCounts(filteredData);

    // 정렬 적용
    const sortedData = sortReviews(filteredData, sortBy, participantCounts);

    // 페이지네이션 데이터 계산
    return HttpResponse.json(
      calculatePaginationData(sortedData, offset, limit),
    );
  }),

  http.get(baseUrl('/reviews/scores'), ({ request }) => {
    const { type } = getQueryParams(request.url, ['type'] as const);

    const { data } = reviewJSON;

    // 필터링 적용
    const filteredData = filterReviews(data, { type });

    // 별점 통계 계산
    const scoreStats = calculateScoreStats(filteredData);

    // 평균 점수 계산
    const averageScore = calculateAverageScore(filteredData);

    return HttpResponse.json([
      {
        teamId: 'fesi0501',
        type,
        averageScore: Number(averageScore.toFixed(1)),
        ...scoreStats,
      },
    ]);
  }),
];

export const filterReviews = (
  reviews: typeof reviewJSON.data,
  filters: {
    type: string | null;
    location?: string | null;
    date?: string | null;
  },
) => {
  return reviews.filter((review) => {
    const typeMatch = filters.type
      ? filters.type === 'DALLAEMFIT'
        ? ['OFFICE_STRETCHING', 'MINDFULNESS'].includes(review.Gathering.type)
        : review.Gathering.type === filters.type
      : true;
    const locationMatch = filters.location
      ? review.Gathering.location === filters.location
      : true;
    const dateMatch = filters.date
      ? review.createdAt.split('T')[0] === filters.date
      : true;

    return typeMatch && locationMatch && dateMatch;
  });
};

export const calculateParticipantCounts = (reviews: typeof reviewJSON.data) => {
  return reviews.reduce(
    (acc, review) => {
      const gatheringId = review.Gathering.id;
      acc[gatheringId] = (acc[gatheringId] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );
};

export const sortReviews = (
  reviews: typeof reviewJSON.data,
  sortBy: string | null,
  participantCounts: Record<number, number>,
) => {
  if (!sortBy) return reviews;

  return [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'createdAt':
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'score':
        return b.score - a.score;
      case 'participantCount':
        return (
          participantCounts[b.Gathering.id] - participantCounts[a.Gathering.id]
        );
      default:
        return 0;
    }
  });
};

export const calculatePaginationData = (
  filteredData: typeof reviewJSON.data,
  offset: string | null,
  limit: string | null,
) => {
  const slicedData = filteredData.slice(
    Number(offset),
    Number(offset) + Number(limit),
  );

  return {
    data: slicedData,
    totalItemCount: filteredData.length,
    currentPage: Math.floor(Number(offset) / Number(limit)) + 1,
    totalPages: Math.ceil(filteredData.length / Number(limit)),
  };
};

export const calculateScoreStats = (reviews: typeof reviewJSON.data) => {
  return reviews.reduce(
    (acc, review) => {
      switch (review.score) {
        case 1:
          acc.oneStar++;
          break;
        case 2:
          acc.twoStars++;
          break;
        case 3:
          acc.threeStars++;
          break;
        case 4:
          acc.fourStars++;
          break;
        case 5:
          acc.fiveStars++;
          break;
      }
      return acc;
    },
    {
      oneStar: 0,
      twoStars: 0,
      threeStars: 0,
      fourStars: 0,
      fiveStars: 0,
    },
  );
};

export const calculateAverageScore = (reviews: typeof reviewJSON.data) => {
  const totalScore = reviews.reduce((sum, review) => sum + review.score, 0);
  return reviews.length > 0 ? totalScore / reviews.length : 0;
};
