import { jest } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react';

import CalendarDown from '~/src/components/common/calendar-dropdown';

describe('CalendarDown Component', () => {
  const onDateSelectMock = jest.fn();
  const onResetMock = jest.fn();
  const onCloseMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('CalendarDown 컴포넌트가 정상적으로 렌더링된다', () => {
    render(
      <CalendarDown
        onDateSelect={onDateSelectMock}
        selectedDate={new Date()}
        onReset={onResetMock}
        onClose={onCloseMock}
      />,
    );
    expect(screen.getByText('적용')).toBeInTheDocument();
    expect(screen.getByText('초기화')).toBeInTheDocument();
  });

  test('적용 버튼 클릭 시 onDateSelect가 호출된다', () => {
    const selectedDate = new Date(2024, 11, 19);
    render(
      <CalendarDown
        onDateSelect={onDateSelectMock}
        selectedDate={selectedDate}
        onReset={onResetMock}
        onClose={onCloseMock}
      />,
    );

    const applyButton = screen.getByText('적용');
    fireEvent.click(applyButton);
    expect(onDateSelectMock).toHaveBeenCalledWith(selectedDate);
  });

  test('초기화 버튼 클릭 시 onReset이 호출된다', () => {
    render(
      <CalendarDown
        onDateSelect={onDateSelectMock}
        selectedDate={new Date()}
        onReset={onResetMock}
        onClose={onCloseMock}
      />,
    );

    const resetButton = screen.getByText('초기화');
    fireEvent.click(resetButton);
    expect(onResetMock).toHaveBeenCalled();
  });

  test('캘린더 밖을 클릭하면 onClose가 호출된다', () => {
    render(
      <CalendarDown
        onDateSelect={onDateSelectMock}
        selectedDate={new Date()}
        onReset={onResetMock}
        onClose={onCloseMock}
      />,
    );

    act(() => {
      fireEvent.mouseDown(document);
    });

    expect(onCloseMock).toHaveBeenCalled();
  });

  test('캘린더 안을 클릭하면 onClose가 호출되지 않는다', () => {
    render(
      <CalendarDown
        onDateSelect={onDateSelectMock}
        selectedDate={new Date()}
        onReset={onResetMock}
        onClose={onCloseMock}
      />,
    );

    const calendar = screen.getByRole('dialog');
    fireEvent.mouseDown(calendar);
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  test('className이 전달되면 올바르게 적용된다', () => {
    render(
      <CalendarDown
        onDateSelect={onDateSelectMock}
        selectedDate={new Date()}
        onReset={onResetMock}
        onClose={onCloseMock}
        className="test-class"
      />,
    );
    expect(screen.getByRole('dialog')).toHaveClass('test-class');
  });
});
