import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { RESET } from 'jotai/utils';

import {
  type LoginCallback,
  loginCallbackAtom,
} from '~/src/stores/login-callback-atom';

export default function useLoginCallbackAtom() {
  const [callbackData, setCallbackData] = useAtom(loginCallbackAtom);

  const onChangeCallbackPath = useCallback(
    (callbackData: Partial<LoginCallback>) => {
      setCallbackData((prev) => ({ ...prev, ...callbackData }));
    },
    [setCallbackData],
  );

  const onResetCallbackPath = useCallback(() => {
    setCallbackData(RESET);
  }, [setCallbackData]);

  return { callbackData, onChangeCallbackPath, onResetCallbackPath };
}
