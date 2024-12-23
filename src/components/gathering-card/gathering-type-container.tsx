import { type GatheringType } from '~/src/services/types';

const GatheringTypeMap = {
  OFFICE_STRETCHING: '달램핏 오피스 스트레칭',
  MINDFULNESS: '달램핏 마인드풀니스',
  WORKATION: '워케이션',
  DALLAEMFIT: '달램핏',
};

export const GatheringTypeContainer = ({ type }: { type: GatheringType }) => {
  return (
    <span className="text-sm font-medium text-gray-700">
      {GatheringTypeMap[type]}
    </span>
  );
};
