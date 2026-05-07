import { http, HttpResponse } from "msw";

import type { Me, MyPageStats } from "../apis/mypage/mypage";

/** MSW mock: 소셜 로그인 후 사용자 정보 (GET /api/me) */
const meResponse: Me = {
  id: 101,
  name: "김도현",
  profileImageUrl: null,
  provider: "google",
};

/** MSW mock: 마이페이지 통계 (GET /api/me/stats) */
const statsResponse: MyPageStats = {
  collectionCount: 25,
  wishlistCount: 5,
  reviewCount: 12,
};

export const mypageHandlers = [
  http.get("*/api/me", () => {
    return HttpResponse.json(meResponse);
  }),
  http.get("*/api/me/stats", () => {
    return HttpResponse.json(statsResponse);
  }),
];
