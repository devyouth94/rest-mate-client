import { act, renderHook } from '@testing-library/react';

import useGatheringCard from '~/src/hooks/gatherings/use-gathering-card';

describe('useGatheringCard 훅', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('초기 상태가 올바르게 설정되어야 함', () => {
    const { result } = renderHook(() =>
      useGatheringCard({
        gatheringId: 1,
        participantCount: 3,
        capacity: 10,
      }),
    );

    expect(result.current.isSaved).toBe(false);
    expect(result.current.cardState).toBe('ongoing');
  });

  it('참가자 수에 따라 cardState가 올바르게 변경되어야 함', () => {
    const { result, rerender } = renderHook(
      ({ participantCount }) =>
        useGatheringCard({
          gatheringId: 1,
          participantCount,
          capacity: 10,
        }),
      { initialProps: { participantCount: 3 } },
    );

    expect(result.current.cardState).toBe('ongoing');

    rerender({ participantCount: 6 });
    expect(result.current.cardState).toBe('confirmation');

    rerender({ participantCount: 10 });
    expect(result.current.cardState).toBe('closed');
  });

  it('찜하기 버튼 클릭 시 로컬스토리지에 모임 ID가 추가되어야 함', () => {
    const { result } = renderHook(() =>
      useGatheringCard({
        gatheringId: 1,
        participantCount: 3,
        capacity: 10,
      }),
    );

    const mockEvent = {
      stopPropagation: jest.fn(),
    } as unknown as React.MouseEvent<SVGSVGElement>;

    act(() => {
      result.current.handleSaveButton(1)(mockEvent);
    });

    expect(result.current.isSaved).toBe(true);
    expect(JSON.parse(localStorage.getItem('wishlist') || '[]')).toContain(1);
  });

  it('로컬 스토리지에 저장된 모임 ID가 있을 때 isSaved가 true로 초기화되고, 찜하기 취소 시 제거되어야 함', () => {
    localStorage.setItem('wishlist', JSON.stringify([1]));

    const { result } = renderHook(() =>
      useGatheringCard({
        gatheringId: 1,
        participantCount: 3,
        capacity: 10,
      }),
    );

    expect(result.current.isSaved).toBe(true);

    const mockEvent = {
      stopPropagation: jest.fn(),
    } as unknown as React.MouseEvent<SVGSVGElement>;

    act(() => {
      result.current.handleSaveButton(1)(mockEvent);
    });

    expect(result.current.isSaved).toBe(false);
    expect(JSON.parse(localStorage.getItem('wishlist') || '[]')).not.toContain(
      1,
    );
  });
});
