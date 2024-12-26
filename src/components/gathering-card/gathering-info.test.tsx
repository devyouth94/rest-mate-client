import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GatheringInfo from '~/src/components/gathering-card/gathering-info';
import { type Gathering } from '~/src/services/gatherings/types';
import { wrapper } from '~/src/utils/wrapper';

jest.mock('~/src/hooks/gatherings/use-count-animation', () => ({
  __esModule: true,
  useCountAnimation: (value: number) => value,
}));

describe('GatheringInfo 컴포넌트', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockGathering: Gathering = {
    id: 1,
    type: 'DALLAEMFIT',
    name: '테스트 모임',
    dateTime: '2024-12-31T14:00:00+09:00',
    registrationEnd: '2024-12-30T23:59:59+09:00',
    location: '건대입구',
    capacity: 20,
    participantCount: 5,
    image: 'https://picsum.photos/400?random=1',
    createdBy: 1,
    canceledAt: null,
  };

  it('모집 정원이 5명 이상일 때 Confirmation 컴포넌트를 렌더링해야 함', () => {
    render(<GatheringInfo gathering={mockGathering} />, { wrapper });
    expect(screen.getByText('개설확정')).toBeInTheDocument();
  });

  it('찜하기 버튼을 클릭하면 localStorage에 저장되어야 함', async () => {
    render(<GatheringInfo gathering={mockGathering} />, { wrapper });
    const user = userEvent.setup();

    // Save 아이콘 찾기
    const saveButton = screen.getByRole('button', { name: /찜하기/ });

    // 클릭 전 localStorage 확인
    expect(JSON.parse(localStorage.getItem('wishlist') || '[]')).toHaveLength(
      0,
    );

    // 버튼 클릭
    await user.click(saveButton);

    // localStorage에 저장되었는지 확인
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    expect(wishlist).toContain(mockGathering.id);
  });

  it('이미 찜한 모임은 다시 클릭하면 localStorage에서 제거되어야 함', async () => {
    // 미리 localStorage에 찜하기 데이터 설정
    localStorage.setItem('wishlist', JSON.stringify([mockGathering.id]));

    render(<GatheringInfo gathering={mockGathering} />, { wrapper });
    const user = userEvent.setup();

    // Save 아이콘 찾기
    const saveButton = screen.getByRole('button', { name: /찜하기 취소/ });

    // 클릭 전에는 찜한 상태
    expect(JSON.parse(localStorage.getItem('wishlist') || '[]')).toContain(
      mockGathering.id,
    );

    // 버튼 클릭
    await user.click(saveButton);

    // localStorage에서 제거되었는지 확인
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    expect(wishlist).not.toContain(mockGathering.id);
  });
});
