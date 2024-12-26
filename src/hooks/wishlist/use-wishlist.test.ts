import { renderHook, waitFor } from '@testing-library/react';

import { useWishList } from '~/src/hooks/wishlist/use-wishlist';
import { get } from '~/src/services/api';
import { wrapper } from '~/src/utils/wrapper';

jest.mock('~/src/services/api');

describe('useWishList', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('빈 localStorage일 때 빈 wishlist 반환', () => {
    const { result } = renderHook(() => useWishList(), { wrapper });
    expect(result.current.wishlist).toEqual([]);
  });

  it('localStorage에 데이터가 있을 때 올바르게 파싱', () => {
    localStorage.setItem('wishlist', JSON.stringify([1, 2, 3]));
    const { result } = renderHook(() => useWishList(), { wrapper });
    expect(result.current.wishlist).toEqual([1, 2, 3]);
  });

  it('wishlist가 비어있을 때 API 호출하지 않음', async () => {
    const { result } = renderHook(() => useWishList(), { wrapper });
    expect(get).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it('wishlist가 있을 때 API 호출', async () => {
    localStorage.setItem('wishlist', JSON.stringify([1, 2]));
    const mockData = [{ id: 1 }, { id: 2 }];
    (get as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useWishList(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });

    expect(get).toHaveBeenCalledWith('/gatherings', {
      params: {
        id: '1,2',
        type: result.current.type,
      },
    });
  });
});
