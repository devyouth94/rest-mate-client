import { usePathname } from 'next/navigation';
import { render, screen } from '@testing-library/react';

import ActiveLink from '~/src/components/common/active-link';
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('ActiveLink 컴포넌트', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
  });
  it('현재 페이지와 href가 같으면 스타일이 적용되는지 확인', () => {
    render(<ActiveLink href="/">링크 텍스트</ActiveLink>);

    const linkElement = screen.getByText('링크 텍스트');
    expect(linkElement).toHaveClass('text-secondary-900');
    expect(linkElement).toHaveClass('font-semibold');
  });
  it('badgeCount가 있을 때 배지를 렌더링하는지 확인', () => {
    render(
      <ActiveLink href="/" badgeCount={5}>
        링크 텍스트
      </ActiveLink>,
    );

    const badgeElement = screen.getByText('5');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('flex', 'h-[16px]', 'w-[27px]');
  });

  it('badgeCount가 없을 때 배지가 렌더링되지 않는지 확인', () => {
    render(<ActiveLink href="/">링크 텍스트</ActiveLink>);

    // 배지 요소가 렌더링되지 않았는지 확인
    const badgeElement = screen.queryByText('5');
    expect(badgeElement).not.toBeInTheDocument();
  });
});
