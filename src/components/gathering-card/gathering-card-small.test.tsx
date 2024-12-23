import { useRouter } from 'next/navigation';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GatheringCardSmall from '~/src/components/gathering-card/gathering-card-small';
import { type Gathering } from '~/src/services/gatherings/types';

const MOCK_GATHERING: Gathering = {
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

describe('GatheringCardLarge 컴포넌트', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('기본 정보가 올바르게 렌더링되어야 함', () => {
    render(<GatheringCardSmall gathering={MOCK_GATHERING} />);

    expect(screen.getByText(MOCK_GATHERING.name)).toBeInTheDocument();
    expect(screen.getByText(MOCK_GATHERING.location)).toBeInTheDocument();
  });

  it('마감된 모임의 경우 마감 메시지가 표시되어야 함', () => {
    const closedGathering = {
      ...MOCK_GATHERING,
      registrationEnd: '2023-01-01T00:00:00+09:00', // 과거 날짜
    };

    render(<GatheringCardSmall gathering={closedGathering} />);

    expect(
      screen.getByText((content) => content.includes('마감된 챌린지예요')),
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes('다음 기회에 만나요')),
    ).toBeInTheDocument();
  });

  it('오늘 마감되는 모임의 경우 마감 시간 태그가 표시되어야 함', () => {
    const today = new Date();
    const todayEnd = new Date(today.setHours(20, 0, 0, 0)).toISOString();

    const todayClosingGathering = {
      ...MOCK_GATHERING,
      registrationEnd: todayEnd,
    };

    render(<GatheringCardSmall gathering={todayClosingGathering} />);

    expect(screen.getByText(/오늘.*마감/)).toBeInTheDocument();
  });

  describe('찜하기 기능', () => {
    it('찜하기 버튼을 클릭하면 localStorage에 저장되어야 함', async () => {
      render(<GatheringCardSmall gathering={MOCK_GATHERING} />);
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
      expect(wishlist).toContain(MOCK_GATHERING.id);
    });

    it('이미 찜한 모임은 다시 클릭하면 localStorage에서 제거되어야 함', async () => {
      // 미리 localStorage에 찜하기 데이터 설정
      localStorage.setItem('wishlist', JSON.stringify([MOCK_GATHERING.id]));

      render(<GatheringCardSmall gathering={MOCK_GATHERING} />);
      const user = userEvent.setup();

      const saveButton = screen.getByRole('button', { name: /찜하기 취소/ });

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
        registrationEnd: '2023-01-01T00:00:00+09:00',
      };

      localStorage.setItem('wishlist', JSON.stringify([closedGathering.id]));

      render(<GatheringCardSmall gathering={closedGathering} />);
      const user = userEvent.setup();

      // 초기에는 SaveBye 버튼이 존재
      const saveByeButton = screen.getByRole('button', {
        name: 'save-bye-small',
      });
      expect(saveByeButton).toBeInTheDocument();

      // 찜 취소
      await user.click(saveByeButton);

      // localStorage에서 제거되었는지 확인
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      expect(wishlist).not.toContain(closedGathering.id);

      // 버튼이 사라졌는지 확인
      expect(
        screen.queryByRole('button', { name: 'save-bye-small' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('라우팅 동작', () => {
    it('카드 클릭 시 올바른 경로로 이동해야 함', async () => {
      const router = useRouter();
      render(<GatheringCardSmall gathering={MOCK_GATHERING} />);

      const card = screen.getByRole('card-small');
      await userEvent.click(card);

      expect(router.push).toHaveBeenCalledWith(
        `/gatherings/${MOCK_GATHERING.id}`,
      );
    });

    it('마감된 모임은 클릭해도 라우팅이 발생하지 않아야 함', async () => {
      const router = useRouter();
      const closedGathering = {
        ...MOCK_GATHERING,
        registrationEnd: '2023-01-01T00:00:00+09:00',
      };

      render(<GatheringCardSmall gathering={closedGathering} />);

      const card = screen.getByRole('card-small');
      await userEvent.click(card);

      expect(router.push).not.toHaveBeenCalled();
    });
  });

  describe('버튼 상태 전환', () => {
    it('cardState가 closed일 때 ClosedButton이 표시되어야 함', () => {
      const closedGathering = {
        ...MOCK_GATHERING,
        participantCount: 20, // capacity와 동일하게 설정하여 closed 상태 만들기
        capacity: 20,
      };

      render(<GatheringCardSmall gathering={closedGathering} />);

      expect(
        screen.getByRole('button', { name: 'Closed' }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'join now' }),
      ).not.toBeInTheDocument();
    });

    it('cardState가 ongoing일 때 JoinNowButton이 표시되어야 함', () => {
      const ongoingGathering = {
        ...MOCK_GATHERING,
        participantCount: 5,
        capacity: 20,
      };

      render(<GatheringCardSmall gathering={ongoingGathering} />);

      expect(
        screen.getByRole('button', { name: 'join now' }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Closed' }),
      ).not.toBeInTheDocument();
    });

    it('cardState가 confirmation일 때도 JoinNowButton이 표시되어야 함', () => {
      const confirmationGathering = {
        ...MOCK_GATHERING,
        participantCount: 15, // capacity의 75% 이상으로 설정하여 confirmation 상태 만들기
        capacity: 20,
      };

      render(<GatheringCardSmall gathering={confirmationGathering} />);

      expect(
        screen.getByRole('button', { name: 'join now' }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Closed' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('마감된 모임 오버레이', () => {
    it('오버레이 클릭 시 이벤트 전파가 중단되어야 함', async () => {
      const user = userEvent.setup();
      const closedGathering = {
        ...MOCK_GATHERING,
        registrationEnd: '2023-01-01T00:00:00+09:00', // 과거 날짜로 설정
      };

      const mockStopPropagation = jest.fn();
      const mockCardClick = jest.fn();

      render(
        <div onClick={mockCardClick}>
          <GatheringCardSmall gathering={closedGathering} />
        </div>,
      );

      // 오버레이 요소 찾기
      const overlay = screen.getByText((content) =>
        content.includes('마감된 챌린지예요'),
      ).parentElement;

      // 실제 이벤트 객체의 stopPropagation이 호출되는지 확인하기 위해
      // 클릭 이벤트를 시뮬레이션하기 전에 이벤트 리스너 추가
      overlay?.addEventListener('click', (e) => {
        e.stopPropagation = mockStopPropagation;
      });

      // 오버레이 클릭
      await user.click(overlay as HTMLElement);

      // stopPropagation이 호출되었는지 확인
      expect(mockStopPropagation).toHaveBeenCalled();

      // 부모 요소의 클릭 이벤트가 발생하지 않았는지 확인
      expect(mockCardClick).not.toHaveBeenCalled();
    });
  });
});
