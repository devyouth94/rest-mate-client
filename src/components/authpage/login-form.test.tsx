import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import LoginForm from '~/src/components/authpage/login-form';
import { useLogin } from '~/src/services/auths/use-login';

// 이메일과 비밀번호 입력 필드 렌더링 테스트 - 통과
// 빈 입력 필드에 대해 에러 메시지가 표시되는지 테스트 - 통과
// 잘못된 이메일 형식에 대해 에러 메시지가 표시되는지 테스트 - 통과
// useLogin 호출 테스트.
// isPending 테스트

jest.mock('~/src/services/auths/use-login', () => ({
  useLogin: jest.fn(),
}));

const mockData = {
  email: 'test@test.com',
  password: 'test1234*',
};

const renderLoginForm = () => render(<LoginForm />);

const getEmailInput = () =>
  screen.getByPlaceholderText(/이메일을 입력해주세요/);
const getPasswordInput = () =>
  screen.getByPlaceholderText(/비밀번호를 입력해주세요/);
const getLoginButton = () => screen.getByRole('button', { name: /로그인/ });

describe('로그인 폼', () => {
  beforeEach(() => {
    (useLogin as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
  });

  test('아이디 비번 입력 필드 렌더링', () => {
    renderLoginForm();

    expect(getEmailInput()).toBeInTheDocument();
    expect(getPasswordInput()).toBeInTheDocument();
    expect(getLoginButton()).toBeInTheDocument();
  });

  describe('유효성 검사', () => {
    test('빈 입력 필드에 대해 에러 메시지가 표시되는지 테스트', async () => {
      renderLoginForm();

      fireEvent.submit(getLoginButton());

      // 에러 메시지가 렌더링되는지 확인
      await waitFor(() => {
        expect(screen.getByText(/이메일을 입력해주세요/)).toBeInTheDocument();
        expect(screen.getByText(/비밀번호를 입력해주세요/)).toBeInTheDocument();
      });
    });

    test('잘못된 이메일 형식에 대해 에러 메시지가 표시되는지 테스트', async () => {
      renderLoginForm();

      const emailInput = getEmailInput();
      const passwordInput = getPasswordInput();
      const loginButton = getLoginButton();

      // 잘못된 이메일 형식 입력
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(passwordInput, { target: { value: mockData.password } });
      fireEvent.submit(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/이메일 형식이 아닙니다/)).toBeInTheDocument();
      });
    });
  });

  describe('모든 필드가 유효한 경우 테스트', () => {
    test('유효성 검사 통과 useLogin 호출 테스트', async () => {
      const mockMutate = jest.fn();
      const mockUseLogin = jest.fn(() => ({
        mutate: mockMutate,
        isPending: false,
      }));

      (useLogin as jest.Mock).mockReturnValue(mockUseLogin());

      renderLoginForm();

      const emailInput = getEmailInput();
      const passwordInput = getPasswordInput();
      const loginButton = getLoginButton();

      fireEvent.change(emailInput, { target: { value: mockData.email } });
      fireEvent.change(passwordInput, { target: { value: mockData.password } });
      fireEvent.submit(loginButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          email: mockData.email,
          password: mockData.password,
        });
      });
    });
    test('isPending 테스트', async () => {
      const mockUseLogin = jest.fn().mockReturnValue({
        mutate: jest.fn(),
        isPending: true,
      });

      (useLogin as jest.Mock).mockReturnValue(mockUseLogin());

      renderLoginForm();

      const loginButton = getLoginButton();

      fireEvent.submit(loginButton);

      await waitFor(() => {
        expect(loginButton).toBeDisabled();
      });
    });
  });
});
