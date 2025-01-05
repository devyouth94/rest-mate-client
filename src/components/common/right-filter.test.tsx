import { fireEvent, render, screen } from '@testing-library/react';

import RightFilter from '~/src/components/common/right-filter';

jest.mock('~/src/components/common/calendar-dropdown', () => ({
  __esModule: true,
  default: jest.fn(({ onDateSelect, onReset }) => (
    <div role="dialog">
      <button onClick={() => onDateSelect(new Date(2024, 11, 19))}>19</button>
      <button aria-label="초기화" onClick={onReset}>
        초기화
      </button>
    </div>
  )),
}));

jest.mock('~/src/components/common/dropdown', () => ({
  __esModule: true,
  default: jest.fn(({ options, onSelect, selectedOption }) => (
    <div role="listbox">
      {options.map((option: string) => (
        <button
          key={option}
          role="option"
          aria-selected={selectedOption === option}
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )),
}));

describe('RightFilter 컴포넌트', () => {
  const placeholder = '필터 선택';
  const options = ['옵션 1', '옵션 2', '옵션 3'];
  const onOptionSelect = jest.fn();
  const onDateSelect = jest.fn();
  const onDateReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('캘린더가 열리고 날짜를 선택하면 onDateSelect가 호출되어야 한다.', () => {
    render(
      <RightFilter
        options={options}
        placeholder={placeholder}
        calendar
        onDateSelect={onDateSelect}
      />,
    );

    const button = screen.getByRole('button', { name: placeholder });
    fireEvent.click(button);

    const dayButton = screen.getByText('19');
    fireEvent.click(dayButton);

    expect(onDateSelect).toHaveBeenCalledWith(new Date(2024, 11, 19));
  });

  test('초기화를 누르면 onDateReset이 호출되어야 한다.', () => {
    render(
      <RightFilter
        placeholder={placeholder}
        calendar
        onDateReset={onDateReset}
        options={options}
      />,
    );

    const button = screen.getByRole('button', { name: placeholder });
    fireEvent.click(button);

    const resetButton = screen.getByRole('button', { name: /초기화/i });
    fireEvent.click(resetButton);

    expect(onDateReset).toHaveBeenCalled();
  });

  test('옵션 드롭다운이 열리고 옵션을 선택하면 onOptionSelect가 호출되어야 한다.', () => {
    render(
      <RightFilter
        options={options}
        placeholder={placeholder}
        onOptionSelect={onOptionSelect}
      />,
    );

    const button = screen.getByRole('button', { name: placeholder });
    fireEvent.click(button);

    const option = screen.getByRole('option', { name: '옵션 2' });
    fireEvent.click(option);

    expect(onOptionSelect).toHaveBeenCalledWith('옵션 2');
  });

  test('플레이스홀더가 제대로 표시되어야 한다.', () => {
    render(<RightFilter options={options} placeholder={placeholder} />);

    const button = screen.getByRole('button', { name: placeholder });
    expect(button).toBeInTheDocument();
  });
});
