import { call } from "./auth/ApiService";
import type { ApiResponse } from "./commontype";

export type CreateReviewRequest = {
  rating: number;
  content: string;
};

export type ReviewMutationResponse = {
  reviewId: number;
  albumId: number;
  rating: number;
  content: string;
  createdAt: string;
};

export const createReview = async (
  aladinItemId: number,
  request: CreateReviewRequest,
): Promise<ReviewMutationResponse> => {
  const res = (await call(
    `/api/v1/albums/${aladinItemId}/reviews`,
    "POST",
    request,
  )) as ApiResponse<ReviewMutationResponse>;

  return res.data;
};
