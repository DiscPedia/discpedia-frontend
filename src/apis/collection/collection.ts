import { call } from "../auth/ApiService";
import type { ApiResponse, PageResponse } from "../commontype";

export type MediaType = "LP" | "CD" | "ETC";
export type CollectionStatus = "OWNED" | "WISHLIST";
export type Condition = "NEW" | "SEALED" | "USED";

export type CollectionSummary = {
  totalValue: number;
  counts: {
    total: number;
    lp: number;
    cd: number;
    wishlist: number;
    etc: number;
  };
};

export type CollectionAlbum = {
  albumId: number;
  title: string;
  artistName: string;
  releaseDate: string;
  mediaType: MediaType;
  categoryPath: string;
  coverImageUrl: string;
  listPrice: number;
};

export type CollectionItem = {
  collectionItemId: number;
  album: CollectionAlbum;
  status: CollectionStatus;
  condition?: Condition;
  purchasePrice?: number;
  currentEstimatedPrice?: number;
  priceChangeRate?: number;
  priceChangeAmount?: number;
};

export type CollectionListParams = {
  mediaType?: MediaType;
  status?: CollectionStatus;
  q?: string;
  page?: number;
  size?: number;
  sort?: string;
};

const toQueryString = (params: CollectionListParams) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

export const getCollectionSummary = async (): Promise<CollectionSummary> => {
  const res = (await call(
    "/api/collections/summary",
    "GET",
  )) as ApiResponse<CollectionSummary>;
  return res.data;
};

export const getCollectionItems = async (
  params: CollectionListParams,
): Promise<PageResponse<CollectionItem>> => {
  const query = toQueryString(params);
  const res = (await call(`/api/collections${query}`, "GET")) as ApiResponse<
    PageResponse<CollectionItem>
  >;
  return res.data;
};
