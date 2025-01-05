import { type UseFormReturn } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { toast } from 'sonner';

import useLoginCallbackAtom from '~/src/hooks/use-login-callback-atom';
import { post } from '~/src/services/api';
import { useGetUserInfo } from '~/src/services/auths/get-user';
import {
  type ErrorResponseData,
  type SigninData,
  type TokenResponseData,
  type User,
} from '~/src/services/auths/types';

import { setAccessTokenAtom, setUserInfoAtom } from './../../stores/auth-store';

export function useLogin(form: UseFormReturn<SigninData>) {
  const router = useRouter();

  const { callbackData, onChangeCallbackPath } = useLoginCallbackAtom();

  const setAccessToken = useSetAtom(setAccessTokenAtom);
  const setUserInfo = useSetAtom(setUserInfoAtom);
  const { refetchUser } = useGetUserInfo();

  return useMutation<TokenResponseData, ErrorResponseData, SigninData, User>({
    mutationFn: (data) =>
      post<TokenResponseData>('/auths/signin', {
        email: data.email,
        password: data.password,
      }),
    onSuccess: async (data) => {
      setAccessToken(data.token);
      try {
        const userData = await refetchUser();
        if (userData !== undefined) {
          setUserInfo(userData);
        }

        toast.success(`${userData?.name}님, 환영합니다.`);

        if (callbackData.path) {
          onChangeCallbackPath({ isCallback: true });
          router.push(`/${callbackData.path}`);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('로그인 중 오류', error);
      }
    },

    onError: (error) => {
      if (error?.data?.code === 'INVALID_CREDENTIALS') {
        form.setError('password', {
          type: 'manual',
          message: '비밀번호가 아이디와 일치하지 않습니다.',
        });
      }
      if (error?.data?.code === 'USER_NOT_FOUND') {
        form.setError('email', {
          type: 'manual',
          message: '존재하지 않는 아이디입니다.',
        });
      }
      if (error?.data?.code === 'SERVER_ERROR') {
        form.setError('email', {
          type: 'manual',
          message: '서버 오류가 발생했습니다.',
        });
      }
    },
  });
}
