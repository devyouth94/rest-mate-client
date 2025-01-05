'use client';

import { useEffect, useRef } from 'react';
import useBreakpoint from 'use-breakpoint';

import Loading from '~/app/loading';
import GatheringCardLarge from '~/src/components/gathering-card/gathering-card-large';
import GatheringCardSmall from '~/src/components/gathering-card/gathering-card-small';
import { useGatheringFilter } from '~/src/hooks/gatherings/use-gathering-filter';
import { type SortBy } from '~/src/services/gatherings/types';
import useGatherings from '~/src/services/gatherings/use-gatherings';
import { getBreakpoints } from '~/src/utils/breakpoints';

const BREAKPOINTS = getBreakpoints();

export default function CardContainer() {
  const { type, location, date, sortBy } = useGatheringFilter();
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'mobile');
  const observerRef = useRef<HTMLDivElement>(null);

  const { data, isFetching, fetchNextPage, hasNextPage } = useGatherings({
    type,
    location,
    date: (date as string) ?? undefined,
    sortBy: sortBy as SortBy,
  });

  const flattenedData =
    data?.flat().filter((gathering) => gathering.canceledAt === null) ?? [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (!isFetching && (!data || flattenedData.length === 0)) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-sm font-medium text-gray-500">
          아직 모임이 없어요, <br />
          지금 바로 모임을 만들어보세요!
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-10">
      {breakpoint === 'tablet' || breakpoint === 'desktop' ? (
        <div className="flex flex-col gap-6">
          {flattenedData?.map((gathering) => (
            <GatheringCardLarge key={gathering.id} gathering={gathering} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {flattenedData?.map((gathering) => (
            <GatheringCardSmall key={gathering.id} gathering={gathering} />
          ))}
        </div>
      )}
      {isFetching && <Loading />}
      {hasNextPage && (
        <div
          ref={observerRef}
          role="scroll-observer"
          className="z-20 h-8 w-full"
        />
      )}
    </div>
  );
}
