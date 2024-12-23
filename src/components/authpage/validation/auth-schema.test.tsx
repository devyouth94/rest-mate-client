import { signupSchema } from '~/src/components/authpage/validation/auth-schemas';
import { loginSchema } from '~/src/components/authpage/validation/auth-schemas';

describe('signupSchema', () => {
  const validData = {
    name: '이름',
    email: 'test1@test.com',
    companyName: '회사',
    password: 'test1234*',
    confirmPassword: 'test1234*',
  };

  it('잘못된 이메일일 경우', () => {
    const invalidEmail = { ...validData, email: 'invalidEmail' };
    expect(() => signupSchema.parse(invalidEmail)).toThrow(
      '이메일 형식이 아닙니다',
    );
  });

  it('이름이 너무 짧을 경우', () => {
    const invalidName = { ...validData, name: 'a' };
    expect(() => signupSchema.parse(invalidName)).toThrow(
      '이름은 2글자 이상이어야 합니다',
    );
  });

  it('회사명이 너무 짧을 경우', () => {
    const invalidCompany = { ...validData, companyName: 'a' };
    expect(() => signupSchema.parse(invalidCompany)).toThrow(
      '회사명을 정확히 입력해주세요',
    );
  });

  it('비밀번호가 너무 짧을 경우', () => {
    const shortPasswordData = { ...validData, password: '1234' };
    expect(() => signupSchema.parse(shortPasswordData)).toThrow(
      '비밀번호는 8자리 이상이어야 합니다',
    );
  });

  it('비밀번호에 영문, 숫자, 특수문자가 모두 포함되지 않을 경우', () => {
    const invalidPasswordData = { ...validData, password: 'test1234' };
    expect(() => signupSchema.parse(invalidPasswordData)).toThrow(
      '영문, 숫자, 특수문자(~!@#$%^&*)를 모두 조합해 주세요',
    );
  });

  it('비밀번호와 비밀번호 확인이 일치하지 않을 경우', () => {
    const differentPasswordData = {
      ...validData,
      password: 'test1234*',
      confirmPassword: 'DifferentPassword',
    };
    expect(() => signupSchema.parse(differentPasswordData)).toThrow(
      '비밀번호가 일치하지 않습니다',
    );
  });

  it('모든 유효성 조건이 만족된 경우', () => {
    const parsedData = signupSchema.parse(validData);
    expect(parsedData).toEqual(validData);
  });
});

describe('loginSchema', () => {
  const validData = {
    email: 'test1@test.com',
    password: 'test1234*',
  };

  it('잘못된 이메일일 경우', () => {
    const invalidEmail = { ...validData, email: 'invalidEmail' };
    expect(() => loginSchema.parse(invalidEmail)).toThrow(
      '이메일 형식이 아닙니다',
    );
  });

  it('이메일을 입력하지 않았을 경우', () => {
    const missingEmailData = { ...validData, email: '' };
    expect(() => loginSchema.parse(missingEmailData)).toThrow(
      '이메일을 입력해주세요',
    );
  });

  it('비밀번호를 입력하지 않았을 경우', () => {
    const shortPasswordData = { ...validData, password: '' };
    expect(() => loginSchema.parse(shortPasswordData)).toThrow(
      '비밀번호를 입력해주세요',
    );
  });

  it('모든 유효성 조건이 만족된 경우', () => {
    const parsedData = loginSchema.parse(validData);
    expect(parsedData).toEqual(validData);
  });
});
