import { render, screen } from '@testing-library/react';

import profilelarge from '~/src/assets/images/profile-large.png';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/src/components/common/avatar';

describe('Avatar 컴포넌트', () => {
  it('AvatarImage에 사진을 prop 받지 않을 때는 기본 이미지가 렌더링된다', () => {
    render(
      <Avatar>
        <AvatarImage />
        <AvatarFallback />
      </Avatar>,
    );

    const fallbackImage = screen.getByAltText('profile_img');

    expect(fallbackImage).toBeInTheDocument();

    expect(fallbackImage).toHaveAttribute(
      'src',
      expect.stringContaining('/_next/image?url=%2Fimg.jpg'),
    );
  });
  it('AvatarImage에 사진을 prop 받을 때는 해당 이미지가 렌더링 된다.', () => {
    render(
      <Avatar>
        <AvatarImage src={profilelarge.src} alt="profile" />
        <AvatarFallback />
      </Avatar>,
    );
  });

  it('size prop이 small일 때 작은 사이즈로 렌더링된다', () => {
    render(
      <Avatar size="small" data-testid="avatar-component">
        <AvatarImage />
        <AvatarFallback />
      </Avatar>,
    );

    const avatarImage = screen.getByTestId('avatar-component');

    expect(avatarImage).toBeInTheDocument();

    expect(avatarImage).toHaveClass('h-7 w-7');
  });
  it('size prop이 small일 때 작은 사이즈로 렌더링된다', () => {
    render(
      <Avatar size="medium" data-testid="avatar-component">
        <AvatarImage />
        <AvatarFallback />
      </Avatar>,
    );

    const avatarImage = screen.getByTestId('avatar-component');

    expect(avatarImage).toBeInTheDocument();

    expect(avatarImage).toHaveClass('h-10 w-10');
  });
});
