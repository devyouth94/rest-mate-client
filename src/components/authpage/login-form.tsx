'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';

import { loginSchema } from '~/src/components/authpage/validation/auth-schemas';
import Button from '~/src/components/common/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
} from '~/src/components/common/form';
import Input from '~/src/components/common/input';
import { useLogin } from '~/src/services/auths/use-login';

export default function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: Login, isPending } = useLogin(form);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    Login(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-[24px]"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">아이디</FormLabel>
              <Input
                error={form.formState.errors.email?.message}
                type="email"
                placeholder="이메일을 입력해주세요"
                {...field}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">비밀번호</FormLabel>
              <Input
                error={form.formState.errors.password?.message}
                type="password"
                placeholder="비밀번호를 입력해주세요"
                {...field}
              />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!form.formState.isDirty || isPending}>
          로그인
        </Button>
      </form>
    </Form>
  );
}
