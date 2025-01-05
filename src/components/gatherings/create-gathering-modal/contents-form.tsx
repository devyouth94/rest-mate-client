'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '~/src/components/common/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
} from '~/src/components/common/form';
import Input from '~/src/components/common/input';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/src/components/common/modal';
import { ScrollArea } from '~/src/components/common/scroll-area';
import FormDate from '~/src/components/gatherings/create-gathering-modal/form-date';
import FormGatheringType from '~/src/components/gatherings/create-gathering-modal/form-gathering-type';
import FormImage from '~/src/components/gatherings/create-gathering-modal/form-image';
import FormLocation from '~/src/components/gatherings/create-gathering-modal/form-location';
import {
  type CreateGatheringForm,
  createGatheringSchema,
} from '~/src/components/gatherings/create-gathering-modal/schema';
import useCreateGathering from '~/src/services/gatherings/use-create-gathering';
import { cn } from '~/src/utils/class-name';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContentsForm({ open, onOpenChange }: Props) {
  const form = useForm<CreateGatheringForm>({
    resolver: zodResolver(createGatheringSchema),
    defaultValues: {
      name: '',
      date: {
        gathering: {
          date: new Date(),
        },
      },
      capacity: '',
    },
  });

  const { control, formState, handleSubmit: onSubmit, reset } = form;
  const { isDirty, isValid, isSubmitting } = formState;

  const { mutate: createGathering, isPending } = useCreateGathering();

  const handleSubmit = (form: CreateGatheringForm) => {
    createGathering(form, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  useEffect(() => {
    if (open) return;

    reset();
  }, [open, reset]);

  return (
    <DialogContent
      aria-describedby="모임 만들기 폼"
      className={cn(
        'flex h-dvh flex-col tablet:h-[calc(100dvh-48px)] desktop:h-dvh',
        'w-full max-tablet:rounded-none max-tablet:px-4 max-tablet:pb-3',
      )}
    >
      <DialogHeader>
        <DialogTitle>모임 만들기</DialogTitle>
      </DialogHeader>

      <ScrollArea className="grow">
        <Form {...form}>
          <form
            id="create-gathering-form"
            onSubmit={onSubmit(handleSubmit)}
            className="space-y-6 pb-6"
          >
            {/* 모임 이름 폼 */}
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>모임 이름</FormLabel>
                  <Input placeholder="모임 이름을 작성해주세요" {...field} />
                </FormItem>
              )}
            />

            {/* 장소 폼 */}
            <FormField
              control={control}
              name="location"
              render={({ field }) => <FormLocation field={field} />}
            />

            {/* 이미지 폼 */}
            <FormField
              control={control}
              name="image"
              render={({ field }) => <FormImage field={field} />}
            />

            {/* 모임 타입 폼 */}
            <FormField
              control={control}
              name="type"
              render={({ field }) => <FormGatheringType field={field} />}
            />

            {/* 날짜 폼 */}
            <div className="flex flex-col gap-4 tablet:flex-row tablet:gap-9">
              <FormField
                control={control}
                name="date"
                render={({ field }) => (
                  <FormDate type="gathering" label="모임 날짜" field={field} />
                )}
              />

              <FormField
                control={control}
                name="date"
                render={({ field }) => (
                  <FormDate
                    type="registration"
                    label="마감 날짜(선택사항)"
                    field={field}
                  />
                )}
              />
            </div>

            {/* 모집 정원 폼 */}
            <FormField
              control={control}
              name="capacity"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>모집 정원</FormLabel>
                  <Input
                    placeholder="최소 5인 이상 입력해주세요"
                    error={formState.errors.capacity?.message}
                    {...field}
                  />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </ScrollArea>

      {/* 확인 버튼 */}
      <DialogFooter>
        <Button
          type="submit"
          form="create-gathering-form"
          size="small"
          disabled={!isDirty || !isValid || isSubmitting || isPending}
        >
          확인
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
