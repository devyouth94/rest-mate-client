import { render, screen } from '@testing-library/react';
import useBreakpoint from 'use-breakpoint';

import WishlistContainer from '~/src/components/wishlist/wishlist-container';
import { useWishList } from '~/src/hooks/wishlist/use-wishlist';

// Mock the hooks
jest.mock('use-breakpoint');
jest.mock('~/src/hooks/wishlist/use-wishlist');

const MOCK_GATHERING = {
  id: '1',
  title: '모임 1',
  dateTime: '2024-12-31T14:00:00+09:00',
  registrationEnd: '2024-12-30T23:59:59+09:00',
  type: 'DALLAEMFIT',
  location: '서울',
  capacity: 20,
  participantCount: 5,
  image: 'https://picsum.photos/400?random=1',
  createdBy: 1,
  canceledAt: null,
};

describe('WishlistContainer', () => {
  beforeEach(() => {
    // 기본 mock 설정
    (useBreakpoint as jest.Mock).mockReturnValue({ breakpoint: 'desktop' });
    (useWishList as jest.Mock).mockReturnValue({ data: null });
  });

  it('데이터가 없을 때 "아직 찜한 모임이 없어요" 메시지를 표시한다', () => {
    render(<WishlistContainer />);

    expect(screen.getByText('아직 찜한 모임이 없어요')).toBeInTheDocument();
  });

  it('빈 배열 데이터일 때도 "아직 찜한 모임이 없어요" 메시지를 표시한다', () => {
    (useWishList as jest.Mock).mockReturnValue({ data: [] });

    render(<WishlistContainer />);

    expect(screen.getByText('아직 찜한 모임이 없어요')).toBeInTheDocument();
  });

  it('데스크톱에서 GatheringCardLarge를 사용하여 데이터를 렌더링한다', () => {
    const mockData = [[MOCK_GATHERING]];
    (useWishList as jest.Mock).mockReturnValue({ data: mockData });
    (useBreakpoint as jest.Mock).mockReturnValue({ breakpoint: 'desktop' });

    render(<WishlistContainer />);

    expect(screen.getByRole('card-large')).toBeInTheDocument();
  });

  it('모바일에서 GatheringCardSmall을 사용하여 데이터를 렌더링한다', () => {
    const mockData = [[MOCK_GATHERING]];
    (useWishList as jest.Mock).mockReturnValue({ data: mockData });
    (useBreakpoint as jest.Mock).mockReturnValue({ breakpoint: 'mobile' });

    render(<WishlistContainer />);

    expect(screen.getByRole('card-small')).toBeInTheDocument();
  });
});
