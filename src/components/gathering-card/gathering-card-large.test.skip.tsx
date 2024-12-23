import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { type Gathering } from '~/src/services/gatherings/types';

import GatheringCardLarge from './gathering-card-large';

const MOCK_GATHERING: Gathering = {
  id: 1,
  type: 'DALLAEMFIT',
  name: '테스트 모임',
  dateTime: '2024-12-31T14:00:00',
  registrationEnd: '2024-12-30T23:59:59',
  location: '건대입구',
  capacity: 20,
  participantCount: 5,
  image: 'https://picsum.photos/400?random=1',
  createdBy: 1,
  canceledAt: null,
};

describe('GatheringCardLarge 컴포넌트', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('기본 정보가 올바르게 렌더링되어야 함', () => {
    render(<GatheringCardLarge gathering={MOCK_GATHERING} />);

    expect(screen.getByText(MOCK_GATHERING.name)).toBeInTheDocument();
    expect(screen.getByText(MOCK_GATHERING.location)).toBeInTheDocument();
  });

  it('참가자 수와 정원이 올바르게 표시되어야 함', () => {
    render(<GatheringCardLarge gathering={MOCK_GATHERING} />);

    expect(
      screen.getByText(
        `${MOCK_GATHERING.participantCount}/${MOCK_GATHERING.capacity}명`,
      ),
    ).toBeInTheDocument();
  });

  it('마감된 모임의 경우 마감 메시지가 표시되어야 함', () => {
    const closedGathering = {
      ...MOCK_GATHERING,
      registrationEnd: '2023-01-01T00:00:00', // 과거 날짜
    };

    render(<GatheringCardLarge gathering={closedGathering} />);

    expect(screen.getByText('마감된 챌린지예요,')).toBeInTheDocument();
    expect(screen.getByText('다음 기회에 만나요🙏')).toBeInTheDocument();
  });

  it('오늘 마감되는 모임의 경우 마감 시간 태그가 표시되어야 함', () => {
    const today = new Date();
    const todayEnd = new Date(today.setHours(20, 0, 0, 0)).toISOString();

    const todayClosingGathering = {
      ...MOCK_GATHERING,
      registrationEnd: todayEnd,
    };

    render(<GatheringCardLarge gathering={todayClosingGathering} />);

    expect(screen.getByText(/오늘.*마감/)).toBeInTheDocument();
  });

  describe('찜하기 기능', () => {
    it('찜하기 버튼을 클릭하면 localStorage에 저장되어야 함', async () => {
      render(<GatheringCardLarge gathering={MOCK_GATHERING} />);
      const user = userEvent.setup();

      // Save 아이콘 찾기
      const saveButton = screen.getByRole('button', { name: '찜하기' });

      // 클릭 전 localStorage 확인
      expect(JSON.parse(localStorage.getItem('wishlist') || '[]')).toHaveLength(
        0,
      );

      // 버튼 클릭
      await user.click(saveButton);

      // localStorage에 저장되었는지 확인
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      expect(wishlist).toContain(MOCK_GATHERING.id);
    });

    it('이미 찜한 모임은 다시 클릭하면 localStorage에서 제거되어야 함', async () => {
      // 미리 localStorage에 찜하기 데이터 설정
      localStorage.setItem('wishlist', JSON.stringify([MOCK_GATHERING.id]));

      render(<GatheringCardLarge gathering={MOCK_GATHERING} />);
      const user = userEvent.setup();

      const saveButton = screen.getByRole('button', { name: '찜하기' });

      // 클릭 전에는 찜한 상태
      expect(JSON.parse(localStorage.getItem('wishlist') || '[]')).toContain(
        MOCK_GATHERING.id,
      );

      // 버튼 클릭
      await user.click(saveButton);

      // localStorage에서 제거되었는지 확인
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      expect(wishlist).not.toContain(MOCK_GATHERING.id);
    });

    it('이미 찜된 마감 모임은 찜 취소 후 버튼이 사라져야 함', async () => {
      const closedGathering = {
        ...MOCK_GATHERING,
        registrationEnd: '2023-01-01T00:00:00',
      };

      localStorage.setItem('wishlist', JSON.stringify([closedGathering.id]));

      render(<GatheringCardLarge gathering={closedGathering} />);
      const user = userEvent.setup();

      // 초기에는 SaveBye 버튼이 존재
      const saveButton = screen.getByTestId('mock-svg');
      expect(saveButton).toBeInTheDocument();

      // 찜 취소
      await user.click(saveButton);

      // localStorage에서 제거되었는지 확인
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      expect(wishlist).not.toContain(closedGathering.id);

      // 버튼이 사라졌는지 확인
      expect(screen.queryByTestId('mock-svg')).not.toBeInTheDocument();
    });
  });
});
