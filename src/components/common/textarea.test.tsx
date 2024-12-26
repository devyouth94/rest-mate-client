import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import Textarea from '~/src/components/common/textarea';

describe('Textarea 컴포넌트', () => {
  it('플레이스홀더가 제대로 렌더링 되는지 확인', () => {
    render(<Textarea placeholder="무언가를 입력하세요" />);

    const textarea = screen.getByPlaceholderText('무언가를 입력하세요');
    expect(textarea).toBeInTheDocument();
  });

  it('입력값이 잘 처리되는지 확인', () => {
    const handleChange = jest.fn();
    render(
      <Textarea placeholder="무언가를 입력하세요" onChange={handleChange} />,
    );
    const textarea = screen.getByPlaceholderText('무언가를 입력하세요');

    fireEvent.change(textarea, { target: { value: 'Hello' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
