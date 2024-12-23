import Image from 'next/image';

import Tag from '~/src/components/common/tag';
import { cn } from '~/src/utils/class-name';

interface GatheringDetailImageProps {
  image: string;
  registrationEnd: string;
  className?: string;
}

export default function GatheringDetailImage({
  image,
  className,
  registrationEnd,
}: GatheringDetailImageProps) {
  return (
    <div
      className={cn(`relative rounded-3xl border border-gray-200`, className)}
    >
      {/* 오늘이 마감일인 경우에만 Tag 표시 */}
      {new Date(registrationEnd).toDateString() ===
        new Date().toDateString() && (
        <Tag size="small" className="absolute right-0 top-0">
          오늘{' '}
          {new Date(registrationEnd).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}{' '}
          마감
        </Tag>
      )}
      <Image
        src={image}
        alt="gathering image"
        fill
        className="rounded-3xl object-cover"
      />
    </div>
  );
}
