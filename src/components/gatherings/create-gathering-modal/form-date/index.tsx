'use client';

import { useState } from 'react';
import { type ControllerRenderProps } from 'react-hook-form';
import { useBreakpoint } from 'use-breakpoint';

import Button from '~/src/components/common/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/src/components/common/drawer';
import { FormItem, FormLabel } from '~/src/components/common/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/src/components/common/pop-over';
import DatePicker from '~/src/components/gatherings/create-gathering-modal/form-date/date-picker';
import TimePicker from '~/src/components/gatherings/create-gathering-modal/form-date/time-picker';
import Trigger from '~/src/components/gatherings/create-gathering-modal/form-date/trigger';
import { type CreateGatheringForm } from '~/src/components/gatherings/create-gathering-modal/schema';
import { getBreakpoints } from '~/src/utils/breakpoints';

interface Props {
  label: string;
  type: 'gathering' | 'registration';
  field: ControllerRenderProps<CreateGatheringForm, 'date'>;
}

const BREAKPOINTS = getBreakpoints();

export default function FormDate({ label, type, field }: Props) {
  const { breakpoint } = useBreakpoint(BREAKPOINTS);

  const [open, setOpen] = useState(false);
  const [funnel, setFunnel] = useState(1);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setFunnel(open ? 1 : 2);
  };

  return (
    <FormItem className="w-full">
      <FormLabel>{label}</FormLabel>

      {breakpoint !== 'mobile' ? (
        <Popover>
          <PopoverTrigger asChild>
            <Trigger type={type} field={field} />
          </PopoverTrigger>

          <PopoverContent className="flex w-fit space-x-4 divide-x divide-secondary-200">
            <DatePicker type={type} field={field} />

            <div className="flex max-h-[240px] divide-x divide-secondary-200">
              <TimePicker type={type} field={field} />
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={handleOpenChange}>
          <DrawerTrigger asChild>
            <Trigger type={type} field={field} />
          </DrawerTrigger>

          <DrawerContent aria-describedby="날짜 선택 Drawer">
            <DrawerHeader hidden className="p-0">
              <DrawerTitle hidden>날짜 선택</DrawerTitle>
            </DrawerHeader>

            <div className="p-4 pb-0">
              {funnel === 1 ? (
                <DatePicker type={type} field={field} />
              ) : (
                <TimePicker type={type} field={field} />
              )}
            </div>

            <DrawerFooter>
              {funnel === 1 ? (
                <Button size="small" onClick={() => setFunnel(2)}>
                  시간 선택
                </Button>
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleOpenChange(false)}
                >
                  닫기
                </Button>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </FormItem>
  );
}
