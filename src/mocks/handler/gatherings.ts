import { http, HttpResponse } from 'msw';

import makeFakeParticipants from '~/src/mocks/faker/fake-gathering-participants';
import makeFakeGatherings from '~/src/mocks/faker/fake-gatherings';
import { baseUrl } from '~/src/mocks/utils';
import { type SortBy } from '~/src/services/gatherings/types';
import { type GatheringType } from '~/src/services/types';
import { type GatheringLocation } from '~/src/services/types';

export const gatheringsHandlers = [
  http.get(baseUrl(`/gatherings/:id/participants`), (req) => {
    const { id } = req.params;
    // 아 참가자 수를 못 가져오네
    const participants = makeFakeParticipants(Number(id), 50);
    return HttpResponse.json(participants);
  }),

  // 특정 Gathering 상세정보 API
  http.get(baseUrl(`/gatherings/:id`), (req) => {
    const { id } = req.params;
    const gathering = makeFakeGatherings(1, Number(id))[0];
    if (!gathering) {
      return HttpResponse.json(
        { error: `Gathering with ID ${id} not found` },
        { status: 404 },
      );
    }
    return HttpResponse.json(gathering);
  }),

  // 전체 모임
  http.get(baseUrl(`/gatherings`), ({ request }) => {
    const url = new URL(request.url);
    const ids = url.searchParams.get('id')?.split(',').map(Number);
    const type = url.searchParams.get('type') as GatheringType;
    const locationParam = url.searchParams.get('location');
    const location =
      locationParam === '지역 전체'
        ? undefined
        : (locationParam as GatheringLocation);
    const date = url.searchParams.get('date') || undefined;
    const sortBy = url.searchParams.get('sortBy') as SortBy;
    const offset = Number(url.searchParams.get('offset')) || 0;
    const limit = Number(url.searchParams.get('limit')) || 10;

    // id 파라미터가 있는 경우 해당 id들의 모임만 반환
    if (ids?.length) {
      const gatherings = ids.map((id) => makeFakeGatherings(1, id, type)[0]);
      return HttpResponse.json(gatherings);
    }

    // DALLAEMFIT인 경우 두 가지 타입의 모임을 모두 생성
    if (type === 'DALLAEMFIT') {
      const gatherings = [];
      const halfLimit = Math.ceil(limit / 2);

      // OFFICE_STRETCHING 모임 생성
      gatherings.push(
        ...Array.from(
          { length: halfLimit },
          (_, i) =>
            makeFakeGatherings(
              1,
              i + 1,
              'OFFICE_STRETCHING',
              location,
              date,
            )[0],
        ),
      );

      // MINDFULNESS 모임 생성
      gatherings.push(
        ...Array.from(
          { length: limit - halfLimit },
          (_, i) =>
            makeFakeGatherings(
              1,
              halfLimit + i + 1,
              'MINDFULNESS',
              location,
              date,
            )[0],
        ),
      );

      return HttpResponse.json(gatherings);
    }

    const gatherings = Array.from(
      { length: limit },
      (_, i) => makeFakeGatherings(1, offset + i + 1, type, location, date)[0],
    );

    // 정렬 로직
    if (sortBy) {
      gatherings.sort((a, b) => {
        switch (sortBy) {
          case 'dateTime':
            return (
              new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
            );
          case 'registrationEnd':
            return (
              new Date(b.registrationEnd).getTime() -
              new Date(a.registrationEnd).getTime()
            );
          case 'participantCount':
            return b.participantCount - a.participantCount;
          default:
            return 0;
        }
      });
    }

    return HttpResponse.json(gatherings);
  }),
];
