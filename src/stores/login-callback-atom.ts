import { atomWithStorage } from 'jotai/utils';

export type LoginCallback = {
  path: string | null;
  isCallback: boolean;
};

export const loginCallbackAtom = atomWithStorage<LoginCallback>(
  'loginCallback',
  {
    path: null,
    isCallback: false,
  },
);
