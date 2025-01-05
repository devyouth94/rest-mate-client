import { type User } from '~/src/services/auths/types';
import { type GetReviewListResponse } from '~/src/services/reviews/types';
import {
  type GatheringLocation,
  type GatheringType,
  type PageParam,
} from '~/src/services/types';

export interface Gathering {
  id: number;
  type: GatheringType;
  name: string;
  dateTime: string;
  registrationEnd: string;
  location: GatheringLocation;
  participantCount: number;
  capacity: number;
  image: string;
  createdBy: number;
  canceledAt: string | null;
}

export interface JoinedGathering {
  id: number;
  teamId?: string;
  type?: GatheringType;
  name?: string;
  dateTime?: string;
  registrationEnd?: string;
  location?: GatheringLocation;
  participantCount?: number;
  capacity?: number;
  image?: string;
  createdBy?: number;
  canceledAt?: string | null;
  joinedAt?: string | null; // ISO 8601 날짜 문자열
  isCompleted?: boolean;
  isReviewed?: boolean;
}

export type CreateGatheringResponse = Gathering;

export interface GetGatheringDetailRequest {
  id: number;
}

export interface GetGatheringParticipantsRequest extends Partial<PageParam> {
  gatheringId: number;
}

export type GetGatheringParticipantsResponse = GatheringParticipant[];

export interface GatheringParticipant {
  userId: number;
  gatheringId: number;
  joinedAt: string;
  User: User;
}

export interface GetGatheringReviewRequest {
  gatheringId: number;
}

export type GetGatheringReviewResponse = GetReviewListResponse;

export interface GatheringReview {
  id: number;
  score: number;
  comment: string;
  createdAt: string;
  Gathering: {
    id: number;
    type: string;
    name: string;
    dateTime: string;
    location: string;
    image: string;
  };
  User: {
    id: number;
    name: string;
    image: string;
  };
}

export interface GetGatheringsRequest {
  limit?: number;
  offset?: number;
  type?: GatheringType;
  location?: GatheringLocation;
  date?: string;
  createdBy?: number;
}

export type GetGatheringsResponse = Gathering[];

export type SortBy = 'dateTime' | 'registrationEnd' | 'participantCount';

export type SortOrder = 'asc' | 'desc';
