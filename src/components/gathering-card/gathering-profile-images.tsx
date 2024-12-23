'use client';

import Image from 'next/image';
import { toast } from 'sonner';

import Loading from '~/app/loading';
import ProfileLarge from '~/src/assets/images/profile-large.png';
import { type GatheringParticipant } from '~/src/services/gatherings/types';
import useGatheringParticipants from '~/src/services/gatherings/use-gathering-participants';
interface Props {
  gatheringId: number;
  participantCount: number;
}

export default function GatheringProfileImages({
  gatheringId,
  participantCount,
}: Props) {
  const { data, isLoading, isError, error } =
    useGatheringParticipants(gatheringId);

  if (isLoading) return <Loading />;
  if (isError || !data) {
    console.error('Error fetching gathering details:', error);
    toast.error('프로필 이미지 로드 실패');
    return (
      <div className="z-0 -ml-2 flex h-[29px] w-[29px] items-center justify-center rounded-full bg-gray-100 text-sm font-semibold group-hover:hidden">
        +0
      </div>
    );
  }
  const images = data
    .map((participant: GatheringParticipant) => participant.User.image)
    .slice(0, participantCount);
  const participants = data
    .map((participant: GatheringParticipant) => participant.User)
    .slice(0, participantCount);

  const maxImages = Math.min(4, participantCount); // 최대 4개만 보이게
  const displayedImages = images.slice(0, maxImages);
  const remainingCount = Math.max(0, participantCount - maxImages);

  return (
    <div className="group flex items-center">
      {displayedImages.map((src, index) => (
        <div
          key={index}
          className={`relative -ml-2 ${index === 0 ? 'ml-0' : ''}`}
        >
          <Image
            key={index}
            src={!!src ? src : ProfileLarge}
            alt={`Profile Image ${index + 1}`}
            width={29}
            height={29}
            className="rounded-full object-cover"
            style={{ aspectRatio: '1' }}
          />
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="z-0 -ml-2 flex h-[29px] w-[29px] items-center justify-center rounded-full bg-gray-100 text-sm font-semibold group-hover:hidden">
          +{remainingCount}
        </div>
      )}
      <div className="absolute right-0 top-0 z-[1] hidden max-h-72 overflow-y-auto rounded bg-white shadow-xl group-hover:inline-flex group-hover:flex-col">
        {participants.map((participant, index) => (
          <div
            key={index}
            className="flex items-center gap-2 border-b border-gray-200 py-2 pl-3 pr-4"
          >
            <Image
              src={!!participant.image ? participant.image : ProfileLarge}
              alt={`Profile Image ${index + 1}`}
              width={29}
              height={29}
              className="rounded-full object-cover"
              style={{ aspectRatio: '1' }}
            />
            <span className="text-xs">{participant.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
