import { call } from "../auth/ApiService";

export type LoginProvider = "google" | "kakao";

export type Me = {
  id: number;
  name: string;
  profileImageUrl: string | null;
  provider: LoginProvider;
};

export type MyPageStats = {
  collectionCount: number;
  wishlistCount: number;
  reviewCount: number;
};

export const getMe = async (): Promise<Me> => {
  return (await call("/api/me", "GET")) as Me;
};

export const getMyPageStats = async (): Promise<MyPageStats> => {
  return (await call("/api/me/stats", "GET")) as MyPageStats;
};