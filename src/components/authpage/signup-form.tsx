'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';

import { signupSchema } from '~/src/components/authpage/validation/auth-schemas';
import Button from '~/src/components/common/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
} from '~/src/components/common/form';
import Input from '~/src/components/common/input';
import { useSignup } from '~/src/services/auths/use-signup';

export default function SignupForm() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      companyName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: Signup, isPending } = useSignup(form);

  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    Signup(values);
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-[24px]"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">이름</FormLabel>
                <Input
                  error={form.formState.errors.name?.message}
                  type="text"
                  placeholder="이름을 입력해주세요"
                  {...field}
                />
              </FormItem>
            )}
          />

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
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="companyName">회사</FormLabel>
                <Input
                  error={form.formState.errors.companyName?.message}
                  type="text"
                  placeholder="회사명을 입력해주세요"
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="confirmPassword">비밀번호 확인</FormLabel>
                <Input
                  error={form.formState.errors.confirmPassword?.message}
                  type="password"
                  placeholder="비밀번호를 다시 한 번 입력해주세요"
                  {...field}
                />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={!form.formState.isDirty || isPending}>
            확인
          </Button>
        </form>
      </Form>
    </>
  );
}
