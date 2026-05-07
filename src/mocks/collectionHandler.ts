import { http, HttpResponse } from "msw";
import albumMock1 from "../assets/albumMock1.svg";
import albumMock2 from "../assets/albumMock2.svg";
import type {
  CollectionItem,
  CollectionSummary,
  CollectionStatus,
  MediaType,
} from "../apis/collection/collection";
import type {ApiResponse} from "../apis/commontype";

const now = new Date().toISOString();

const collectionSummaryMock: ApiResponse<CollectionSummary> = {
  success: true,
  message: "Collection summary retrieved",
  timestamp: now,
  data: {
    totalValue: 1274000,
    counts: {
      total: 25,
      lp: 18,
      cd: 7,
      wishlist: 5,
      etc: 0,
    },
  },
};

const collectionItemsMock: CollectionItem[] = [
  {
    collectionItemId: 1001,
    status: "OWNED",
    condition: "USED",
    purchasePrice: 42000,
    currentEstimatedPrice: 50000,
    priceChangeRate: 19.0,
    priceChangeAmount: 8000,
    album: {
      albumId: 201,
      title: "리스트 : 피아노 협주곡 1번",
      artistName: "리스트",
      releaseDate: "2026-03-31",
      mediaType: "LP",
      categoryPath: "음반>클래식>협주곡",
      coverImageUrl: albumMock2,
      listPrice: 25600,
    },
  },
  {
    collectionItemId: 1002,
    status: "OWNED",
    condition: "SEALED",
    purchasePrice: 39000,
    currentEstimatedPrice: 38000,
    priceChangeRate: -2.6,
    priceChangeAmount: -1000,
    album: {
      albumId: 202,
      title: "리스트 : 피아노 협주곡 2번",
      artistName: "리스트",
      releaseDate: "2026-03-31",
      mediaType: "CD",
      categoryPath: "음반>클래식>협주곡",
      coverImageUrl: albumMock2,
      listPrice: 22000,
    },
  },
  {
    collectionItemId: 1003,
    status: "WISHLIST",
    album: {
      albumId: 203,
      title: "정규 4집 개화",
      artistName: "악뮤",
      releaseDate: "2026-04-07",
      mediaType: "LP",
      categoryPath: "음반>가요",
      coverImageUrl: albumMock1,
      listPrice: 24900,
    },
  },
];

const filterItems = (
  items: CollectionItem[],
  mediaType?: MediaType | null,
  status?: CollectionStatus | null,
  q?: string | null,
) => {
  return items.filter((item) => {
    const mediaMatch = mediaType ? item.album.mediaType === mediaType : true;
    const statusMatch = status ? item.status === status : true;
    const keyword = (q ?? "").trim().toLowerCase();
    const qMatch = keyword
      ? item.album.title.toLowerCase().includes(keyword) ||
        item.album.artistName.toLowerCase().includes(keyword)
      : true;
    return mediaMatch && statusMatch && qMatch;
  });
};

export const collectionHandlers = [
  http.get("*/api/collections/summary", () => {
    return HttpResponse.json(collectionSummaryMock);
  }),

  http.get("*/api/collections", ({ request }) => {
    const url = new URL(request.url);
    const mediaType = url.searchParams.get("mediaType") as MediaType | null;
    const status = url.searchParams.get("status") as CollectionStatus | null;
    const q = url.searchParams.get("q");
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 20);

    const filtered = filterItems(collectionItemsMock, mediaType, status, q);
    const start = page * size;
    const paged = filtered.slice(start, start + size);

    return HttpResponse.json({
      success: true,
      message: "Collection items retrieved",
      timestamp: now,
      data: {
        items: paged,
        page,
        size,
        totalItems: filtered.length,
        totalPages: Math.ceil(filtered.length / size),
        hasNext: start + size < filtered.length,
      },
    });
  }),
];