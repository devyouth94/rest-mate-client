'use client';

import { useRouter } from 'next/navigation';

import Button from '~/src/components/common/button';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/src/components/common/modal';
import useLoginCallbackAtom from '~/src/hooks/use-login-callback-atom';

export default function ContentsLogin() {
  const router = useRouter();
  const { onChangeCallbackPath } = useLoginCallbackAtom();

  const handleClickLogin = () => {
    onChangeCallbackPath({ path: 'gatherings' });
    router.push('/login');
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="opacity-0">로그인</DialogTitle>
      </DialogHeader>

      <div className="flex justify-center">로그인이 필요해요</div>

      <DialogFooter className="flex justify-end">
        <Button onClick={handleClickLogin} className="w-[120px]">
          확인
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
