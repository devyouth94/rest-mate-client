import { server } from '~/src/mocks/server';

import '@testing-library/jest-dom';

// 재사용할 mock 함수들을 먼저 생성
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockPrefetch = jest.fn();
const mockBack = jest.fn();
const mockRefresh = jest.fn();
const mockForward = jest.fn();

// Next.js 라우터 전역 모킹
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
      replace: mockReplace,
      prefetch: mockPrefetch,
      back: mockBack,
      refresh: mockRefresh,
      forward: mockForward,
      pathname: '',
    };
  },
}));

// mock 함수들을 매 테스트 전에 초기화하기 위해 전역 beforeEach 설정
beforeEach(() => {
  mockPush.mockClear();
  mockReplace.mockClear();
  mockPrefetch.mockClear();
  mockBack.mockClear();
  mockRefresh.mockClear();
  mockForward.mockClear();
});

// 모든 테스트 전에 msw 서버 시작
beforeAll(() => {
  server.listen();
});

// 각 테스트 후에 msw 서버 핸들러 초기화
afterEach(() => {
  server.resetHandlers();
});

// 모든 테스트 후에 msw 서버 종료
afterAll(() => {
  server.close();
});
