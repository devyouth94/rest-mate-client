import formatDateTime from '~/src/utils/format-date-time';

describe('formatDateTime', () => {
  it('UTC 시간(Z)을 한국 시간으로 변환해야 합니다', () => {
    const input = '2024-12-15T12:00:00.000Z';
    const expectedOutput = {
      date: '12월 15일',
      time: '12:00', // Z를 +09:00으로 변환
    };

    const result = formatDateTime(input);
    expect(result).toEqual(expectedOutput);
  });

  it('자정 시간을 올바르게 처리해야 합니다', () => {
    const input = '2024-12-15T00:00:00.000Z';
    const expectedOutput = {
      date: '12월 15일',
      time: '00:00',
    };

    const result = formatDateTime(input);
    expect(result).toEqual(expectedOutput);
  });

  it('시간대 정보가 없는 날짜와 시간을 한국 시간으로 처리해야 합니다', () => {
    const input = '2024-12-15T12:00:00';
    const expectedOutput = {
      date: '12월 15일',
      time: '12:00', // 한국 시간으로 간주
    };

    const result = formatDateTime(input);
    expect(result).toEqual(expectedOutput);
  });

  it('이미 한국 시간대(+09:00)가 명시된 시간을 올바르게 처리해야 합니다', () => {
    const input = '2024-12-15T12:00:00+09:00';
    const expectedOutput = {
      date: '12월 15일',
      time: '12:00',
    };

    const result = formatDateTime(input);
    expect(result).toEqual(expectedOutput);
  });

  it('다양한 시간 형식을 처리해야 합니다', () => {
    const testCases = [
      {
        input: '2024-12-15T00:00:00',
        expected: { date: '12월 15일', time: '00:00' },
      },
      {
        input: '2024-12-15T23:59:00Z',
        expected: { date: '12월 15일', time: '23:59' },
      },
      {
        input: '2024-12-15T09:30:00+09:00',
        expected: { date: '12월 15일', time: '09:30' },
      },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = formatDateTime(input);
      expect(result).toEqual(expected);
    });
  });
});
