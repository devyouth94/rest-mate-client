import { render } from '@testing-library/react';

import Heart from '~/src/assets/icons/heart';

describe('Heart', () => {
  it('isActive가 true일 때 하트가 활성화 되는가', () => {
    const { container } = render(<Heart isActive />);

    const heart = container.querySelector('circle');

    expect(heart).toHaveClass('scale-100 opacity-100');
  });

  it('isAnimate가 true일 때 하트가 애니메이션 되는가', () => {
    const { container } = render(<Heart isAnimate />);

    const heart = container.querySelector('circle');

    expect(heart).toHaveClass('transition-all');
  });
});
