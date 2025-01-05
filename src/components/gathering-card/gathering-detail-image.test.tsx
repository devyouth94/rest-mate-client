import { render, screen } from '@testing-library/react';

import GatheringDetailImage from '~/src/components/gathering-card/gathering-detail-image';

describe('GatheringDetailImage', () => {
  it('오늘이 마감일인 경우 Tag를 렌더링한다', () => {
    const today = new Date().toISOString().split('T')[0];
    render(<GatheringDetailImage image="/test.jpg" registrationEnd={today} />);

    expect(screen.getByText(/오늘/)).toBeInTheDocument();
  });

  it('오늘이 마감일이 아닌 경우 Tag를 렌더링하지 않는다', () => {
    const notToday = new Date(Date.now() + 86400000)
      .toISOString()
      .split('T')[0]; // 내일 날짜
    render(
      <GatheringDetailImage image="/test.jpg" registrationEnd={notToday} />,
    );

    expect(screen.queryByText(/오늘/)).not.toBeInTheDocument();
  });
});
