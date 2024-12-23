import { act, renderHook } from '@testing-library/react';

import { useCountAnimation } from './use-count-animation';

describe('useCountAnimation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('초기 카운트는 0이어야 함', () => {
    const { result } = renderHook(() => useCountAnimation(10));
    expect(result.current).toBe(0);
  });

  it('cleanup이 제대로 동작해야 함', () => {
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
    const { unmount } = renderHook(() => useCountAnimation(10));

    act(() => {
      unmount();
    });

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
