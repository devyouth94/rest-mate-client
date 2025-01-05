import { render } from '@testing-library/react';

import ReviewCardItem from '~/src/components/reviews/review-card-item';
import reviewJSON from '~/src/mocks/handler/reviews.json';

const reviewCardItem = reviewJSON.data[0];

describe('ReviewCardItem', () => {
  it('리뷰 카드 아이템이 잘 렌더링 되는가(조건부 렌더링 전부 false가 기본값)', () => {
    const { getByText, queryByText, queryByAltText } = render(
      <ReviewCardItem {...reviewCardItem} />,
    );

    expect(getByText(reviewCardItem.comment)).toBeInTheDocument();

    const nameTag = queryByText(reviewCardItem.User.name);
    const typeDescription = queryByText(reviewCardItem.Gathering.location);
    const gatheringImage = queryByAltText(reviewCardItem.Gathering.name);

    expect(nameTag).not.toBeInTheDocument();
    expect(typeDescription).not.toBeInTheDocument();
    expect(gatheringImage).not.toBeInTheDocument();
  });

  it('hasNameTag가 true일 때 이름이 잘 렌더링 되는가', () => {
    const { getByText } = render(
      <ReviewCardItem {...reviewCardItem} hasNameTag />,
    );

    expect(getByText(reviewCardItem.User.name)).toBeInTheDocument();
  });

  it('hasImage가 true일 때 이미지가 잘 렌더링 되는가', () => {
    const { getByAltText } = render(
      <ReviewCardItem {...reviewCardItem} hasImage />,
    );

    expect(getByAltText(reviewCardItem.Gathering.name)).toBeInTheDocument();
  });

  it('hasTypeDescription이 true일 때 설명이 잘 렌더링 되는가', () => {
    const { getByText } = render(
      <ReviewCardItem {...reviewCardItem} hasTypeDescription />,
    );

    expect(getByText(reviewCardItem.Gathering.location)).toBeInTheDocument();
  });
});
