import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useAtom, useSetAtom } from 'jotai';
import { toast } from 'sonner';

import CircleEdit from '~/src/assets/icons/circle-edit.svg?url';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/src/components/common/avatar';
import Button from '~/src/components/common/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
} from '~/src/components/common/form';
import Input from '~/src/components/common/input';
import { DialogFooter } from '~/src/components/common/modal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/src/components/common/modal';
import { useEditUser } from '~/src/services/auths/edit-user';
import { type User, type UserEditType } from '~/src/services/auths/types';
import { setUserInfoAtom, userInfoAtom } from '~/src/stores/auth-store';

export default function ProfileEdit() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [user] = useAtom(userInfoAtom);
  const setUser = useSetAtom(setUserInfoAtom);

  const form = useForm<UserEditType>({
    defaultValues: {
      companyName: user?.companyName || '',
      image: user?.image || '',
    },
  });

  const {
    setValue,
    // reset,
    formState: { isDirty },
  } = form;

  const handleCancel = () => {
    setIsModalOpen(false);
    form.reset({
      companyName: user?.companyName || '',
      image: user?.image || '',
    });

    setImageFile(null);
    setPreviewImage(user?.image || '');
  };

  const { mutate: EditUser, isPending } = useEditUser();

  const onSubmit = async (data: UserEditType) => {
    const formData = new FormData();
    formData.append('companyName', data.companyName || '');
    if (imageFile) {
      formData.append('image', imageFile);
    }
    EditUser(formData, {
      onSuccess: (update) => {
        setUser(update as unknown as User);
        setIsModalOpen(false);
        toast.success('수정되었습니다.');
      },
      onError: (error) => {
        toast.error('수정 중에 오류가 발생했습니다.');
        console.error(error);
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxFileSize = 2 * 1024 * 1024;
      if (file.size > maxFileSize) {
        return;
      }

      setImageFile(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        const preview = reader.result as string;
        setPreviewImage(preview);
        setValue('image', preview, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Image
            src={CircleEdit}
            alt="circle-edit"
            width={32}
            height={32}
            className="cursor-pointer rounded-2xl shadow-sm hover:shadow-md"
          />
        </DialogTrigger>

        <DialogContent
          aria-describedby="회원정보 수정하기 폼"
          className="flex flex-col gap-6"
        >
          <DialogHeader>
            <DialogTitle>프로필 수정하기</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-6"
            >
              <Avatar
                className="relative h-14 w-14 cursor-pointer"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <AvatarImage src={previewImage || user?.image}></AvatarImage>
                <AvatarFallback />
                <Image
                  src={CircleEdit}
                  width={18}
                  height={18}
                  alt="Edit-Icon"
                  className="absolute bottom-0 right-0 z-10"
                />
              </Avatar>

              <input
                type="file"
                hidden
                id="fileInput"
                accept="image/*"
                onChange={handleImageChange}
              />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="companyName">회사</FormLabel>
                    <Input type="text" {...field} />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex gap-2">
                <Button onClick={handleCancel} type="button" variant="outlined">
                  취소
                </Button>
                <Button type="submit" disabled={!isDirty || isPending}>
                  수정하기
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
