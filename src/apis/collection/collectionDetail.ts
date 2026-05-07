import type { CollectionStatus } from "./collection";
import type { Condition } from "./collection";
import type { CollectionAlbum } from "./collection";
import type { ApiResponse } from "../commontype";
import { call } from "../auth/ApiService";

export type CollectionItemDetail = {
    collectionItemId: number;
    status: CollectionStatus;
    condition?: Condition;
    memo?: string;
    purchasePrice?: number;
    purchaseDate?: string;
    purchaseStore?: string;
    currentEstimatedPrice?: number;
    priceChangeRate?: number;
    priceChangeAmount?: number;
    album: CollectionAlbum;
  };
  
  export const getCollectionItemDetail = async (
    collectionItemId: number,
  ): Promise<CollectionItemDetail> => {
    const res = (await call(
      `/api/collections/${collectionItemId}`,
      "GET",
    )) as ApiResponse<CollectionItemDetail>;
    return res.data;
  };