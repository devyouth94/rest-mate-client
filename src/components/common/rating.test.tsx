import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Rating from '~/src/components/common/rating';

describe('Rating', () => {
  it('value에 따라 하트가 올바르게 활성화 되는가', () => {
    const { container } = render(<Rating value={3} />);

    const heartIcons = container.querySelectorAll('circle');

    heartIcons.forEach((icon, index) => {
      expect(icon).toHaveClass(index < 3 ? 'scale-100' : 'scale-0');
    });
  });

  it('onClick, onScoreChange 함수가 제대로 호출되는가', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const onScoreChange = jest.fn();

    const { getAllByRole } = render(
      <Rating value={0} onClick={onClick} onScoreChange={onScoreChange} />,
    );

    const heartIcons = getAllByRole('button');

    await user.click(heartIcons[0]);

    expect(onClick).toHaveBeenCalled();
    expect(onScoreChange).toHaveBeenCalledWith(1);
  });

  it('onClick, onScoreChange 함수 중 하나라도 있으면 애니메이션이 활성화되는가', () => {
    const onClick = jest.fn();

    const { container } = render(<Rating value={0} onClick={onClick} />);

    const heartIcons = container.querySelectorAll('circle');

    heartIcons.forEach((icon) => {
      expect(icon).toHaveClass('transition-all');
    });
  });

  it('onClick, onScoreChange 함수 둘 다 없다면 애니메이션이 활성화되지 않는가', () => {
    const { container } = render(<Rating value={0} />);

    const heartIcons = container.querySelectorAll('circle');

    heartIcons.forEach((icon) => {
      expect(icon).not.toHaveClass('transition-all');
    });
  });
});
