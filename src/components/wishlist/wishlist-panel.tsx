'use client';

import GatheringTab from '~/src/components/common/gathering-tab';
import { useWishList } from '~/src/hooks/wishlist/use-wishlist';
import { type GatheringType } from '~/src/services/types';

export default function WishlistPanel() {
  const { type, setType } = useWishList();

  const handleChangeType = (type: GatheringType) => {
    setType(type);
  };

  return (
    <div className="flex flex-col gap-4">
      <GatheringTab>
        <div className="flex items-start justify-between">
          <GatheringTab.Main type={type} onChangeFilter={handleChangeType} />
        </div>
        <GatheringTab.Sub type={type} onChangeFilter={handleChangeType} />
      </GatheringTab>
    </div>
  );
}
