import { type ComponentPropsWithoutRef } from 'react';

import { type Gathering } from '~/src/services/gatherings/types';

export interface GatheringCardProps extends ComponentPropsWithoutRef<'div'> {
  gathering: Gathering;
  className?: string;
}
