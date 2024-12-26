/* eslint-disable @next/next/no-img-element */
import { type ImageProps } from 'next/image';
import { fireEvent, render, screen } from '@testing-library/react';

// Next/Image 컴포넌트 모킹
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImageProps) => (
    <img
      src={props.src?.toString() || ''}
      alt={props.alt || ''}
      width={props.width}
      height={props.height}
    />
  ),
}));

// SVG 모킹
jest.mock('../../assets/icons/sort.svg?url', () => 'sort-icon-mock', {
  virtual: true,
});

// CreateGatheringModal 컴포넌트 모킹 추가
jest.mock('~/src/components/gatherings/create-gathering-modal', () => ({
  __esModule: true,
  default: () => null,
}));

import GatheringPanel from '~/src/components/gathering-card/gathering-panel';

// useGatheringFilter 훅을 모킹
const mockSetType = jest.fn();
jest.mock('~/src/hooks/gatherings/use-gathering-filter', () => ({
  useGatheringFilter: () => ({
    type: 'DALLAEMFIT',
    location: '건대입구',
    date: '2024-12-31T14:00:00',
    sortBy: 'registrationEnd',
    setType: mockSetType,
    setLocation: jest.fn(),
    setDate: jest.fn(),
    setSortBy: jest.fn(),
  }),
}));

describe('GatheringPanel', () => {
  beforeEach(() => {
    mockSetType.mockClear();
  });

  it('지역 필터가 올바르게 작동하는지 테스트', () => {
    render(<GatheringPanel />);

    // 지역 필터 버튼 클릭
    const locationFilter = screen.getByText('지역 전체');
    fireEvent.click(locationFilter);

    // 옵션이 모두 표시되는지 확인
    expect(screen.getByText('건대입구')).toBeInTheDocument();
    expect(screen.getByText('을지로3가')).toBeInTheDocument();
    expect(screen.getByText('신림')).toBeInTheDocument();
    expect(screen.getByText('홍대입구')).toBeInTheDocument();
  });

  it('정렬 필터가 올바르게 작동하는지 테스트', () => {
    render(<GatheringPanel />);

    // 정렬 버튼 클릭하여 드롭다운 열기
    const sortButton = screen.getByRole('button', {
      name: /sortIcon/i,
    });
    fireEvent.click(sortButton);

    // 드롭다운이 열린 상태에서 옵션들을 확인
    const sortOptions = ['마감 임박', '참여 인원 순', '최신 순'];
    sortOptions.forEach((option) => {
      const elements = screen.getAllByText(option);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('탭이 올바르게 렌더링되고 작동하는지 테스트', () => {
    render(<GatheringPanel />);

    // 워케이션 탭 클릭
    const workationTab = screen.getByText('워케이션');
    fireEvent.click(workationTab);

    // setType이 'WORKATION'으로 호출되었는지 확인
    expect(mockSetType).toHaveBeenCalledWith('WORKATION');
  });
});
