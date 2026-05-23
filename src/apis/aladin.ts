import { call } from "./auth/ApiService";
import type { ApiResponse, PageResponse } from "./commontype";
import type { MediaType } from "./collection/collection";

export type NewRelease = {
  newReleaseId: number;
  aladinItemId: number;
  title: string;
  artistName: string;
  mediaType: MediaType;
  releaseDate: string;
  priceSales: number;
  priceStandard: number;
  coverImageUrl: string;
  productUrl: string;
  categoryName: string;
  publisher: string;
};

export type NewReleaseListParams = {
  page?: number;
  size?: number;
};

const toQueryString = (params: NewReleaseListParams) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `?${query}` : "";
};

export const getNewReleases = async (
  params: NewReleaseListParams = {},
): Promise<PageResponse<NewRelease>> => {
  const query = toQueryString(params);
  const res = (await call(
    `/api/v1/aladin/new-releases${query}`,
    "GET",
  )) as ApiResponse<PageResponse<NewRelease>>;

  return res.data;
};
