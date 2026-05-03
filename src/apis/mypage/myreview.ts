import { call } from "../auth/ApiService";

export type MyReviewMockItem = {
  album: {
    coverImageUrl: string;
    albumName: string;
    artistName: string;
  };
  rating: number;
  reviewDate: string;
  content: string;
};

export const getMyReview = async (): Promise<MyReviewMockItem[]> => {
  return (await call("/api/myreview", "GET")) as MyReviewMockItem[];
};
