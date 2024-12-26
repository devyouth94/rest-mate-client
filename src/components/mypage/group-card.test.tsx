import { fireEvent, render, screen } from '@testing-library/react';

import GroupCard from '~/src/components/mypage/group-card';
import { type GatheringLocation } from '~/src/services/types';

describe('GroupCard', () => {
  const mockProps = {
    joinedGathering: {
      id: 1,
      name: 'Test Gathering',
      dateTime: new Date().toISOString(),
      participantCount: 5,
      capacity: 10,
      location: 'Test Location' as GatheringLocation,
      isCompleted: false,
      isReviewed: false,
      image: '',
    },
    state: 'default' as const,
  };

  it('renders the group card with correct details', () => {
    render(<GroupCard {...mockProps} />);
    expect(screen.getByText('Test Gathering')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('changes state to "disabled" when cancel button is clicked', () => {
    render(<GroupCard {...mockProps} />);
    const cancelButton = screen.getByText('예약 취소하기');
    fireEvent.click(cancelButton);

    expect(screen.getByText(/모집 취소된 모임이에요/)).toBeInTheDocument();
  });
});
