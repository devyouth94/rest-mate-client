import { fireEvent, render, screen } from '@testing-library/react';

import LeftFilter from '~/src/components/common/left-filter';

jest.mock('~/src/components/common/dropdown', () => ({
  __esModule: true,
  default: jest.fn(({ options, onSelect, selectedOption }) =>
    options.length > 0 ? (
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
    ) : null,
  ),
}));

describe('LeftFilter 컴포넌트', () => {
  const options = ['옵션 1', '옵션 2', '옵션 3'];
  const onOptionSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('컴포넌트가 기본적으로 렌더링되어야 한다.', () => {
    render(<LeftFilter options={options} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    const icon = screen.getByRole('img', { name: /정렬 아이콘/i });
    expect(icon).toBeInTheDocument();

    const selectedText = screen.queryByText(options[0]);
    expect(selectedText).toBeInTheDocument();
  });

  test('드롭다운이 열리고 옵션을 선택하면 onOptionSelect가 호출되어야 한다.', () => {
    render(<LeftFilter options={options} onOptionSelect={onOptionSelect} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const option = screen.getByRole('option', { name: options[1] });
    fireEvent.click(option);

    expect(onOptionSelect).toHaveBeenCalledWith(options[1]);
    expect(screen.queryByText(options[1])).toBeInTheDocument();
  });

  test('드롭다운이 토글되어 열리고 닫혀야 한다.', () => {
    render(<LeftFilter options={options} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const option = screen.getByRole('option', { name: options[0] });
    expect(option).toBeInTheDocument();

    fireEvent.click(button);
    expect(
      screen.queryByRole('option', { name: options[0] }),
    ).not.toBeInTheDocument();
  });

  test('옵션이 없을 경우 기본 동작을 확인한다.', () => {
    render(<LeftFilter options={[]} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(button).toHaveTextContent('');
  });
});
