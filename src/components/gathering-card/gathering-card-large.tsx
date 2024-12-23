'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import SaveBye from '~/src/assets/icons/circle-bye.svg';
import Save from '~/src/assets/icons/save';
import MemberCountChip from '~/src/components/common/member-count-chip';
import ProgressBar from '~/src/components/common/progress-bar';
import Tag from '~/src/components/common/tag';
import ChipInfoContainer from '~/src/components/gathering-card/chip-info-container';
import ClosedButton from '~/src/components/gathering-card/closed-button';
import Confirmation from '~/src/components/gathering-card/confirmation';
import { GatheringTypeContainer } from '~/src/components/gathering-card/gathering-type-container';
import JoinNowButton from '~/src/components/gathering-card/join-now-button';
import { type GatheringCardProps } from '~/src/components/gathering-card/type-props';
import useGatheringCard from '~/src/hooks/gatherings/use-gathering-card';
import { isRegistrationEnded } from '~/src/utils/is-registration-ended';

export default function GatheringCardLarge({
  gathering,
  ...props
}: GatheringCardProps) {
  const router = useRouter();
  const { isSaved, handleSaveButton, cardState } = useGatheringCard({
    participantCount: gathering.participantCount,
    capacity: gathering.capacity,
    gatheringId: gathering.id,
  });

  const isEnded = isRegistrationEnded(gathering.registrationEnd);

  const handleClick = () => {
    if (!isEnded) {
      router.push(`/gatherings/${gathering.id}`);
    }
  };

  return (
    <div
      {...props}
      onClick={handleClick}
      role="card-large"
      className={`relative flex rounded-3xl border-2 border-gray-100 transition-shadow hover:border-gray-200 hover:shadow-card-hover`}
    >
      {/* 이미지 */}
      <div className="relative w-[280px] flex-shrink-0">
        {/* 이미지 없으면 그냥 하얗게 비워놓음 */}
        {gathering.image && (
          <Image
            src={gathering.image}
            alt="cat"
            fill
            className="rounded-l-3xl object-cover"
          />
        )}

        {/* 오늘이 마감일인 경우에만 Tag 표시 */}
        {new Date(gathering.registrationEnd).toDateString() ===
          new Date().toDateString() && (
          <Tag size="large" className="absolute right-0 top-0">
            오늘{' '}
            {new Date(gathering.registrationEnd).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}{' '}
            마감
          </Tag>
        )}
      </div>

      {/* 이미지 빼고 */}
      <div className="flex w-full flex-col">
        {/* 위 */}
        <div className="flex flex-col">
          {/* 제목이랑 칩이랑 */}
          <div className="mb-5 ml-6 mt-4 flex flex-col gap-2">
            {/* 타이틀 */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{gathering.name}</span>
              <span className="text-lg font-semibold">|</span>
              <span className="text-sm font-medium text-gray-700">
                {gathering.location}
              </span>
            </div>
            <ChipInfoContainer dateTime={gathering.dateTime} />
            <GatheringTypeContainer type={gathering.type} />
          </div>
        </div>
        <div>
          <Save
            className="absolute right-4 top-4"
            isActive={isSaved}
            onClick={handleSaveButton(gathering.id)}
          />
        </div>

        {/* 아래 */}
        {/* container-progress */}
        <div className="flex items-end justify-between gap-6 px-6 pb-4 pt-2">
          {/* bar랑 그 위에 상태창 */}
          <div className="flex w-full flex-col gap-2">
            {/* 인원수랑 개설확정 */}
            <div className="flex gap-2">
              <MemberCountChip
                current={gathering.participantCount}
                capacity={gathering.capacity}
                className={cardState === 'closed' ? 'text-orange-400' : ''}
              />
              {cardState === 'confirmation' && <Confirmation />}
            </div>
            <ProgressBar
              current={gathering.participantCount}
              capacity={gathering.capacity}
              barClassName={cardState === 'closed' ? 'bg-orange-400' : ''}
            />
          </div>

          {/* 버튼 */}
          {cardState === 'closed' ? <ClosedButton /> : <JoinNowButton />}
        </div>
      </div>

      {isRegistrationEnded(gathering.registrationEnd) && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden rounded-3xl bg-black bg-opacity-80"
        >
          <div className="pointer-events-auto text-center text-sm font-medium text-white">
            마감된 챌린지예요, <br />
            다음 기회에 만나요🙏
          </div>
          {isSaved && (
            <SaveBye
              role="button"
              aria-label="save-bye-large"
              className="pointer-events-auto absolute right-4 top-4 cursor-pointer"
              onClick={(e: React.MouseEvent<SVGSVGElement>) => {
                e.preventDefault();
                handleSaveButton(gathering.id)(e);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
