import { http, HttpResponse } from "msw";

const artists = [
  { id: 1, initial: "Z", name: "잔나비", subName: "" },
  { id: 2, initial: "B", name: "백예린", subName: "" },
  { id: 3, initial: "S", name: "실리카겔", subName: "" },
  { id: 4, initial: "H", name: "한로로", subName: "" },
  { id: 5, initial: "A", name: "악뮤", subName: "(AKMU)" },
  { id: 6, initial: "I", name: "아일릿", subName: "(ILLIT)" },
  { id: 7, initial: "N", name: "뉴진스", subName: "(NewJeans)" },
  { id: 8, initial: "D", name: "데이식스", subName: "(DAY6)" },
  { id: 9, initial: "K", name: "김정치마", subName: "" },
  { id: 10, initial: "H", name: "혁오", subName: "(HYUKOH)" },
  { id: 11, initial: "K", name: "김동률", subName: "" },
  { id: 12, initial: "S", name: "새소년", subName: "" },
];

export const handlers = [
  http.get("/api/artists", () => {
    return HttpResponse.json({ artists });
  }),
];
