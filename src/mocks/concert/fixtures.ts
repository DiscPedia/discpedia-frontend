import seoulJazzPoster from "../../assets/concert/seoul-jazz-night.png";
import springMelodyPoster from "../../assets/concert/spring-melody.png";
import type { ConcertRecord } from "../../apis/concert/concert";

// Figma 화면의 가상 공연 예시입니다. 실제 공연 정보나 KOPIS 데이터가 아닙니다.
export const concertPosterAssets = { seoulJazzPoster, springMelodyPoster };

export const mockConcertArtists = [
  { artistId: 1, name: "잔나비" },
  { artistId: 2, name: "아이유" },
  { artistId: 3, name: "한로로" },
];

export const initialConcertRecords: ConcertRecord[] = [
  {
    concertRecordId: 301,
    concertName: "서울 재즈 나이트",
    artist: { artistId: 1, name: "잔나비" },
    concertDate: "2026-12-12",
    startTime: "19:00",
    sessionLabel: "2회차",
    attendanceStatus: "PLANNED",
    venue: "올림픽홀",
    seat: "2층 B구역 12열 8번",
    posterImageUrl: seoulJazzPoster,
    review: null,
    setlist: [],
    createdAt: "2026-11-24T09:00:00Z",
    updatedAt: "2026-11-24T09:00:00Z",
  },
  {
    concertRecordId: 302,
    concertName: "봄의 멜로디",
    artist: { artistId: 2, name: "아이유" },
    concertDate: "2026-05-09",
    startTime: null,
    sessionLabel: "1회차",
    attendanceStatus: "ATTENDED",
    venue: "KSPO DOME",
    seat: "1층 스탠딩 A구역",
    posterImageUrl: springMelodyPoster,
    review: {
      rating: 5,
      content: "무대 연출과 라이브가 정말 좋았어요. 다시 보고 싶은 공연!",
      updatedAt: "2026-05-10T02:00:00Z",
    },
    setlist: [
      { order: 1, title: "밤편지", artistName: "아이유", encore: false, memo: null },
      { order: 2, title: "Love poem", artistName: "아이유", encore: false, memo: null },
      { order: 3, title: "Blueming", artistName: "아이유", encore: false, memo: null },
    ],
    createdAt: "2026-05-10T01:00:00Z",
    updatedAt: "2026-05-10T02:00:00Z",
  },
];
