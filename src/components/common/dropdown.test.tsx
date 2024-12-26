import { fireEvent, render, screen } from '@testing-library/react';

import Dropdown from '~/src/components/common/dropdown';

describe('Dropdown 컴포넌트 테스트', () => {
  const mockOptions = ['Option 1', 'Option 2', 'Option 3'];
  const mockOnSelect = jest.fn();
  const mockOnClose = jest.fn();

  const setup = (version: 'Login' | 'Filter', selectedOption = '') => {
    render(
      <Dropdown
        options={mockOptions}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
        version={version}
        selectedOption={selectedOption}
        filterRef={{ current: null }}
      />,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('옵션 목록이 제대로 렌더링되는지 확인', () => {
    setup('Login');
    mockOptions.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('옵션 클릭 시 onSelect 콜백이 호출되는지 확인', () => {
    setup('Filter');
    const option = screen.getByText('Option 1');
    fireEvent.click(option);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith('Option 1');
  });

  it('선택된 옵션에 스타일이 올바르게 적용되는지 확인', () => {
    setup('Login', 'Option 2');
    const selectedOption = screen.getByText('Option 2');

    expect(selectedOption).toHaveClass('bg-orange-100');
  });

  it('드롭다운 외부 클릭 시 onClose 콜백이 호출되는지 확인', () => {
    setup('Filter');
    fireEvent.mouseDown(document);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('드롭다운 내부 클릭 시 onClose가 호출되지 않는지 확인', () => {
    setup('Filter');
    const option = screen.getByText('Option 1');
    fireEvent.mouseDown(option);

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
