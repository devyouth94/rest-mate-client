import { fireEvent, render, screen } from '@testing-library/react';

import Pagination from '~/src/components/gathering-card/pagination';

describe('Pagination', () => {
  const onPageChangeMock = jest.fn();

  beforeEach(() => {
    onPageChangeMock.mockClear();
  });

  it('첫 페이지일 때 이전 버튼이 비활성화됩니다', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />,
    );
    const prevButton = screen.getByLabelText('Go to previous page');
    expect(prevButton).toHaveClass('cursor-default');
    fireEvent.click(prevButton);
    expect(onPageChangeMock).not.toHaveBeenCalled();
  });

  it('마지막 페이지일 때 다음 버튼이 비활성화됩니다', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />,
    );
    const nextButton = screen.getByLabelText('Go to next page');
    expect(nextButton).toHaveClass('cursor-default');
    fireEvent.click(nextButton);
    expect(onPageChangeMock).not.toHaveBeenCalled();
  });

  it('페이지 번호를 클릭하면 onPageChange가 호출됩니다', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />,
    );
    const page3 = screen.getByText('3');
    fireEvent.click(page3);
    expect(onPageChangeMock).toHaveBeenCalledWith(3);
  });

  it('페이지 번호가 현재 페이지일 때 활성화됩니다', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />,
    );
    const activePage = screen.getByText('3');
    expect(activePage).toHaveAttribute('aria-current', 'page');
  });

  it('small일 때 올바르게 페이지 번호를 렌더링합니다', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChangeMock}
        size="small"
      />,
    );
    const pageNumbers = [1, 2, 3, 4, 5].map((page) =>
      screen.getByText(page.toString()),
    );
    expect(pageNumbers.map((el) => el.textContent)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
    ]);
  });

  it('large일 때 올바르게 페이지 번호를 렌더링합니다', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={onPageChangeMock}
        size="large"
      />,
    );
    const pageNumbers = [1, 2, 3, 4, 5, 10].map((page) =>
      screen.getByText(page.toString()),
    );
    expect(pageNumbers.map((el) => el.textContent)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '10',
    ]);
  });

  it('small일 때 올바르게 페이지 번호를 렌더링합니다', () => {
    render(
      <Pagination
        currentPage={8}
        totalPages={15}
        onPageChange={onPageChangeMock}
        size="small"
      />,
    );
    const pageNumbers = [1, 7, 8, 9, 15].map((page) =>
      screen.getByText(page.toString()),
    );
    expect(pageNumbers.map((el) => el.textContent)).toEqual([
      '1',
      '7',
      '8',
      '9',
      '15',
    ]);
  });

  it('large일 때 올바르게 페이지 번호를 렌더링합니다', () => {
    render(
      <Pagination
        currentPage={8}
        totalPages={15}
        onPageChange={onPageChangeMock}
        size="large"
      />,
    );
    const pageNumbers = [1, 6, 7, 8, 9, 10, 15].map((page) =>
      screen.getByText(page.toString()),
    );
    expect(pageNumbers.map((el) => el.textContent)).toEqual([
      '1',
      '6',
      '7',
      '8',
      '9',
      '10',
      '15',
    ]);
  });
});
