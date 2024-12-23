'use client';

import PersonIcon from '~/src/assets/icons/person.svg';
import { useCountAnimation } from '~/src/hooks/gatherings/use-count-animation';
import { cn } from '~/src/utils/class-name';

interface MemberCountChipProps {
  current: number;
  capacity: number;
  className?: string;
}

export default function MemberCountChip({
  current,
  capacity,
  className,
}: MemberCountChipProps) {
  const animatedCurrent = useCountAnimation(current);

  return (
    <span
      role="status"
      aria-label="member count"
      className={cn(
        `inline-flex items-center gap-0.5 text-sm font-medium text-gray-700`,
        className,
      )}
    >
      <PersonIcon className={className} />
      <span className="duration-1000">
        {animatedCurrent}/{capacity}
      </span>
    </span>
  );
}
