import { useEffect, useMemo, useRef } from 'react';
import { useAtom } from 'jotai';

import GroupCard from '~/src/components/mypage/group-card';
import TabBottom from '~/src/components/mypage/tab-bottom';
import TabTop from '~/src/components/mypage/tab-top';
import ReviewCardItem from '~/src/components/reviews/review-card-item';
import useGetJoinedGatheringsInfinite from '~/src/services/mypage/use-get-joined-gatherings-infinite';
import useGetJoinedReviewInfiniteList from '~/src/services/mypage/use-get-joined-review-infinite-list';
import { accessTokenAtom, userInfoAtom } from '~/src/stores/auth-store';
import { activeTabAtom, reviewSubTabAtom } from '~/src/stores/my-page-atoms';

export default function DataRenderer() {
  const [activeTab] = useAtom(activeTabAtom);
  const [reviewSubTab] = useAtom(reviewSubTabAtom);
  const [user] = useAtom(userInfoAtom);
  const [accessToken] = useAtom(accessTokenAtom);

  const {
    data: groupData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetJoinedGatheringsInfinite(
    {
      ...(activeTab === 'myReviews' && reviewSubTab === 'writableReviews'
        ? {
            reviewed: false,
            completed: true,
          }
        : {
            completed: undefined,
            reviewed: undefined,
          }),
    },
    user?.id,
    accessToken!,
  );

  const flattenedGroupData = useMemo(
    () => groupData?.pages.flatMap((page) => page) || [],
    [groupData],
  );
  const filteredGroupData = useMemo(
    () =>
      activeTab === 'createdGroups'
        ? flattenedGroupData.filter((item) => item.createdBy === user?.id)
        : flattenedGroupData,
    [flattenedGroupData, activeTab, user],
  );
  const filteredAndSortedGroupData = useMemo(() => {
    const today = new Date().toISOString();

    return filteredGroupData
      .map((item) => ({
        ...item,
        state:
          new Date(item.dateTime) < new Date(today) &&
          item.isCompleted === false
            ? ('disabled' as const)
            : ('default' as const),
      }))
      .sort((a, b) => {
        const isAPast = new Date(a.dateTime) < new Date(today);
        const isBPast = new Date(b.dateTime) < new Date(today);

        if (isAPast !== isBPast) {
          return isAPast ? 1 : -1;
        }

        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
      });
  }, [filteredGroupData]);

  const { data: reviewData } = useGetJoinedReviewInfiniteList(user?.id);

  const getEmptyMessage = useMemo(() => {
    if (activeTab === 'myGroups') return '신청한 모임이 아직 없어요';
    if (activeTab === 'myReviews') {
      return reviewSubTab === 'writtenReviews'
        ? '아직 작성한 리뷰가 없어요'
        : '아직 작성 가능한 리뷰가 없어요';
    }
    if (activeTab === 'createdGroups') return '아직 만든 모임이 없어요';
    return null;
  }, [activeTab, reviewSubTab]);

  const isEmpty = useMemo(
    () =>
      activeTab === 'myReviews' && reviewSubTab === 'writtenReviews'
        ? !reviewData?.length
        : !filteredAndSortedGroupData.length,
    [activeTab, reviewSubTab, reviewData, filteredAndSortedGroupData],
  );

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentRef = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="mt-4 flex grow flex-col border-t-2 border-secondary-900 px-4 py-6 tablet:p-6 desktop:mt-[30px]">
      <TabTop />
      {activeTab === 'myReviews' && <TabBottom />}

      {isEmpty ? (
        <div className="flex grow items-center justify-center">
          <p className="text-sm font-medium text-secondary-500">
            {getEmptyMessage}
          </p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-4" role="listitem">
          {activeTab === 'myReviews' && reviewSubTab === 'writtenReviews'
            ? reviewData?.map((data) => (
                <ReviewCardItem
                  key={data.id}
                  {...data}
                  hasNameTag={false}
                  hasImage={true}
                  hasTypeDescription={true}
                />
              ))
            : filteredAndSortedGroupData.map((data) => (
                <GroupCard
                  key={data.id}
                  joinedGathering={data}
                  state={data.state}
                />
              ))}
        </div>
      )}

      <div
        ref={observerRef}
        className="h-10"
        data-testid="observer-target"
      ></div>

      {isFetchingNextPage && (
        <div className="flex justify-center p-4 text-sm text-secondary-500">
          로딩 중...
        </div>
      )}
    </div>
  );
}
