import { http, HttpResponse } from "msw";

import albumMock1 from "../assets/albumMock1.svg";
import albumMock2 from "../assets/albumMock2.svg";

import type { MyReviewMockItem } from "../apis/mypage/myreview";

const myreviewMockData: MyReviewMockItem[] = [
    {
      album: {
        coverImageUrl: albumMock1,
        albumName: "정규 4집 개화",
        artistName: "악뮤",
      },
      rating: 5,
      reviewDate: "2026.04.05",
      content:
        "좋음, 좋음, 좋음! 🎵 로키와 그레이스, 그리고 나 이 3명의 우정 영원하길. 평서문. (👇)",
    },
    {
      album: {
        coverImageUrl: albumMock2,
        albumName: "리스트 : 피아노 협주곡 1번",
        artistName: "리스트",
      },
      rating: 4,
      reviewDate: "2026.04.02",
      content:
        "일반적인 SF와 달리 인류애를 풀충전 시켜주는 아주 흥미진진한 화성 낙오기. 데뷔작부터 이런 이야기를 만들어낸 앤디 위어, 그리고...",
    },
  ];

  export const myreviewHandlers = [
    http.get("*/api/myreview", () => {
      return HttpResponse.json(myreviewMockData);
    }),
  ];