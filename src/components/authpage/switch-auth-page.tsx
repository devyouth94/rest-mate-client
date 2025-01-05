'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SwitchAuthPage() {
  const pathname = usePathname();

  return (
    <Link className="text-primary-600 underline" href={PATH_MAP[pathname].path}>
      {PATH_MAP[pathname].label}
    </Link>
  );
}

const PATH_MAP: Record<string, { label: string; path: string }> = {
  '/login': {
    label: '회원가입',
    path: '/signup',
  },
  '/signup': {
    label: '로그인',
    path: '/login',
  },
};
