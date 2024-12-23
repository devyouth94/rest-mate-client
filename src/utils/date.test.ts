import { convertTo24Hour, getDateForFormData } from '~/src/utils/date';

describe('getDateForFormData', () => {
  describe('성공 케이스', () => {
    it('날짜만 입력했을 때', () => {
      const date = new Date('2024-12-19');
      expect(getDateForFormData(date)).toBe('2024-12-19');
    });

    it('날짜와 시간을 입력했을 때', () => {
      const date = new Date('2024-12-19');
      expect(getDateForFormData(date, 15)).toBe('2024-12-19T15:00:00');
    });

    it('날짜와 시간, 분을 입력했을 때', () => {
      const date = new Date('2024-12-19');
      expect(getDateForFormData(date, 8, 30)).toBe('2024-12-19T08:30:00');
    });
  });

  describe('실패 케이스', () => {
    it('시간은 24 이상의 값이 될 수 없음', () => {
      const date = new Date('2024-12-19');
      expect(() => getDateForFormData(date, 24)).toThrow();
    });

    it('시간은 음수가 될 수 없음', () => {
      const date = new Date('2024-12-19');
      expect(() => getDateForFormData(date, -1)).toThrow();
    });

    it('분은 60 이상의 값이 될 수 없음', () => {
      const date = new Date('2024-12-19');
      expect(() => getDateForFormData(date, 15, 60)).toThrow();
    });

    it('분은 음수가 될 수 없음', () => {
      const date = new Date('2024-12-19');
      expect(() => getDateForFormData(date, 15, -1)).toThrow();
    });
  });

  describe('경계값 케이스', () => {
    it('0시 0분이 정상적으로 처리되어야 함', () => {
      const testDate = new Date('2024-12-19');
      expect(getDateForFormData(testDate, 0, 0)).toBe('2024-12-19T00:00:00');
    });

    it('12시 0분이 정상적으로 처리되어야 함', () => {
      const testDate = new Date('2024-12-19');
      expect(getDateForFormData(testDate, 12, 0)).toBe('2024-12-19T12:00:00');
    });
  });
});

describe('convertTo24Hour', () => {
  describe('성공 케이스', () => {
    it('AM 9시는 9시로 변환되어야 함', () => {
      expect(convertTo24Hour({ hour: 9, ampm: 'AM' })).toBe(9);
    });

    it('PM 12시는 12시로 변환되어야 함', () => {
      expect(convertTo24Hour({ hour: 12, ampm: 'PM' })).toBe(12);
    });

    it('PM 9시는 21시로 변환되어야 함', () => {
      expect(convertTo24Hour({ hour: 9, ampm: 'PM' })).toBe(21);
    });
  });

  describe('실패 케이스', () => {
    it('시간은 1 미만이 될 수 없음', () => {
      expect(() => convertTo24Hour({ hour: 0, ampm: 'AM' })).toThrow();
    });

    it('시간은 12 초과가 될 수 없음', () => {
      expect(() => convertTo24Hour({ hour: 13, ampm: 'PM' })).toThrow();
    });
  });

  describe('경계값 케이스', () => {
    it('AM 12시는 0시로 변환되어야 함', () => {
      expect(convertTo24Hour({ hour: 12, ampm: 'AM' })).toBe(0);
    });
  });
});
