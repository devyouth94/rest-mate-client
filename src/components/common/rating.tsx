import { type ComponentPropsWithoutRef, type MouseEvent } from 'react';

import HeartIcon from '~/src/assets/icons/heart';
import { cn } from '~/src/utils/class-name';

interface Props extends ComponentPropsWithoutRef<'svg'> {
  value: number;
  onScoreChange?: (value: number) => void;
}

const MAX_VALUE = 5;

export default function Rating({
  value,
  onScoreChange,
  onClick,
  ...props
}: Props) {
  const handleClick = (e: MouseEvent<SVGSVGElement>, value: number) => {
    onClick?.(e);
    onScoreChange?.(value);
  };

  return (
    <div className={cn('flex gap-0.5', onScoreChange && 'cursor-pointer')}>
      {Array.from({ length: MAX_VALUE }, (_, index) => (
        <HeartIcon
          role="button"
          key={index}
          isActive={index < value}
          isAnimate={!!onScoreChange || !!onClick}
          onClick={(e) => handleClick(e, index + 1)}
          {...props}
        />
      ))}
    </div>
  );
}
