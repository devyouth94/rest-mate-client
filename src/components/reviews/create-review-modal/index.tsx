'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogDescription } from '@radix-ui/react-dialog';

import Button from '~/src/components/common/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
} from '~/src/components/common/form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/src/components/common/modal';
import Rating from '~/src/components/common/rating';
import { ScrollArea } from '~/src/components/common/scroll-area';
import Textarea from '~/src/components/common/textarea';
import {
  type CreateReviewForm,
  createReviewSchema,
} from '~/src/components/reviews/create-review-modal/schema';
import useCreateReview from '~/src/services/reviews/use-create-review';

interface Props {
  gatheringId: number;
}

export default function CreateReviewModal({ gatheringId }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateReviewForm>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      score: 0,
      comment: '',
    },
  });

  const { control, formState, handleSubmit: onSubmit, reset } = form;
  const { isDirty, isValid, isSubmitting } = formState;

  const { mutate: createReview, isPending } = useCreateReview();

  const handleOpenChange = (open: boolean) => {
    if (!open) reset();
    setOpen(open);
  };

  const handleSubmit = ({ score, comment }: CreateReviewForm) => {
    createReview(
      { gatheringId, score, comment },
      {
        onSuccess: () => {
          handleOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="small" className="w-[120px]">
          리뷰 작성하기
        </Button>
      </DialogTrigger>

      <DialogContent aria-describedby="리뷰 작성 폼" className="flex flex-col">
        <DialogHeader>
          <DialogTitle>리뷰 쓰기</DialogTitle>
          <DialogDescription hidden>리뷰 작성 폼</DialogDescription>
        </DialogHeader>

        <ScrollArea className="grow">
          <Form {...form}>
            <form
              id="create-review-form"
              onSubmit={onSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* 별점 */}
              <FormField
                control={control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>만족스러운 경험이었나요?</FormLabel>
                    <Rating
                      value={field.value}
                      onScoreChange={field.onChange}
                    />
                  </FormItem>
                )}
              />

              {/* 후기 */}
              <FormField
                control={control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>경험에 대해 남겨주세요.</FormLabel>
                    <Textarea
                      {...field}
                      placeholder="남겨주신 리뷰는 프로그램 운영 및 다른 회원 분들께 큰 도움이 됩니다."
                    />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="gap-4">
          <Button
            variant="outlined"
            type="button"
            onClick={() => handleOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type="submit"
            form="create-review-form"
            disabled={!isDirty || !isValid || isSubmitting || isPending}
          >
            리뷰 등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
