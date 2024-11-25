import type { Metadata } from 'next';

import { pretendard } from '~/src/fonts/fonts';
import { cn } from '~/src/utils/class-name';

import '~/src/styles/globals.css';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<Props>) {
  return (
    <html lang="ko">
      <body className={cn(pretendard.variable, 'font-pretendard')}>
        {children}
      </body>
    </html>
  );
}
