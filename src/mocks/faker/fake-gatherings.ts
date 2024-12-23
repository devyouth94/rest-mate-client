import { fakerKO as faker } from '@faker-js/faker';

import {
  type GatheringLocation,
  type GatheringType,
} from '~/src/services/types';

export default function makeFakeGatherings(
  count: number,
  id?: number,
  type?: GatheringType,
  location?: GatheringLocation,
  date?: string,
) {
  const capacity = faker.number.int({ min: 10, max: 50 });
  return Array.from({ length: count }, () => {
    const today = new Date();
    const randomHour = faker.number.int({ min: 18, max: 22 });
    const todayEnd = new Date(
      today.setHours(randomHour, 0, 0, 0),
    ).toISOString();

    const currentId = id ?? faker.number.int({ min: 1, max: 9999 });

    return {
      id: currentId,
      type:
        type ??
        faker.helpers.arrayElement<GatheringType>([
          'OFFICE_STRETCHING',
          'MINDFULNESS',
          'WORKATION',
        ]),
      name: (() => {
        const currentType =
          type ??
          faker.helpers.arrayElement<GatheringType>([
            'OFFICE_STRETCHING',
            'MINDFULNESS',
            'WORKATION',
            'DALLAEMFIT',
          ]);

        switch (currentType) {
          case 'WORKATION':
            return '워케이션';
          case 'OFFICE_STRETCHING':
            return '달램핏 오피스 스트레칭';
          case 'MINDFULNESS':
            return '달램핏 마인드풀니스';
          case 'DALLAEMFIT':
            return faker.helpers.arrayElement([
              '달램핏 오피스 스트레칭',
              '달램핏 마인드풀니스',
            ]);
          default:
            return '워케이션';
        }
      })(),
      dateTime: date
        ? `${date}T${faker.number
            .int({ min: 0, max: 23 })
            .toString()
            .padStart(2, '0')}:00:00+09:00`
        : (() => {
            const randomDate =
              faker.helpers.maybe(() => faker.date.future({ years: 1 }), {
                probability: 0.7,
              }) ?? faker.date.past({ years: 1 });

            return randomDate.toISOString();
          })(),
      // 20% 확률로 오늘 마감이게 함
      registrationEnd:
        currentId % 5 === 0
          ? todayEnd
          : (faker.helpers.maybe(
              () => faker.date.soon({ days: 28 }).toISOString(),
              {
                probability: 0.8,
              },
            ) ?? faker.date.past({ years: 1 }).toISOString()),
      location:
        location ??
        faker.helpers.arrayElement<GatheringLocation>([
          '건대입구',
          '을지로3가',
          '신림',
          '홍대입구',
        ]),
      capacity,
      participantCount: faker.number.int({ min: 1, max: capacity }),
      image: `https://picsum.photos/400?random=${faker.number.int({ min: 1, max: 1000 })}`,
      createdBy: faker.number.int({ min: 1, max: 1000 }),
      canceledAt:
        faker.helpers.maybe(() => faker.date.past().toISOString(), {
          probability: 0.3,
        }) ?? null,
    };
  });
}
