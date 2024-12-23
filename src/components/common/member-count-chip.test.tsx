import { render, screen } from '@testing-library/react';

import MemberCountChip from '~/src/components/common/member-count-chip';

jest.mock('~/src/hooks/gatherings/use-count-animation', () => ({
  useCountAnimation: (value: number) => value,
}));

describe('MemberCountChip 컴포넌트', () => {
  it('현재 인원수와 정원이 렌더링되어야 함', () => {
    render(<MemberCountChip current={5} capacity={20} />);
    expect(
      screen.getByRole('status', { name: 'member count' }),
    ).toBeInTheDocument();
    expect(screen.getByText('5/20')).toBeInTheDocument();
  });

  it('className prop이 적용되어야 함', () => {
    render(
      <MemberCountChip current={5} capacity={20} className="custom-class" />,
    );

    const chip = screen.getByText('5/20').parentElement;
    expect(chip).toHaveClass('custom-class');
  });
});
