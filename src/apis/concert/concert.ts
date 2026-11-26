import { call } from "../auth/ApiService";
import { unwrapData, unwrapPage } from "../apiResponse";
import type { PageResponse } from "../commontype";

export type AttendanceStatus = "PLANNED" | "ATTENDED";

export type ConcertArtist = {
  artistId: number | null;
  name: string;
};

export type ConcertReview = {
  rating: number;
  content: string;
  updatedAt: string;
};

export type SetlistTrack = {
  order: number;
  title: string;
  artistName: string;
  encore: boolean;
  memo: string | null;
};

export type ConcertRecord = {
  concertRecordId: number;
  concertName: string;
  artist: ConcertArtist;
  concertDate: string;
  startTime: string | null;
  sessionLabel: string | null;
  attendanceStatus: AttendanceStatus;
  venue: string;
  seat: string | null;
  posterImageUrl: string | null;
  review: ConcertReview | null;
  setlist: SetlistTrack[];
  createdAt: string;
  updatedAt: string;
};

export type ConcertRecordSummary = Omit<ConcertRecord, "review" | "setlist"> & {
  review: { rating: number; contentPreview: string } | null;
  setlistTrackCount: number;
};

type ArtistSelection =
  | { artistId: number; artistName?: never }
  | { artistId?: never; artistName: string };

export type CreateConcertRecordRequest = ArtistSelection & {
  concertName: string;
  concertDate: string;
  startTime?: string | null;
  sessionLabel?: string | null;
  attendanceStatus?: AttendanceStatus;
  venue: string;
  seat?: string | null;
  posterImageUrl?: string | null;
};

export type UpdateConcertRecordRequest = Partial<
  Omit<CreateConcertRecordRequest, "artistId" | "artistName">
> &
  Partial<{ artistId: number | null; artistName: string | null }>;

export type PutConcertReviewRequest = Pick<ConcertReview, "rating" | "content">;
export type PutConcertSetlistRequest = { tracks: SetlistTrack[] };

const BASE = "/api/v1/concert-records";

export async function getConcertRecords(page = 0, size = 20): Promise<PageResponse<ConcertRecordSummary>> {
  const query = new URLSearchParams({ page: String(page), size: String(size) });
  return unwrapPage<ConcertRecordSummary>(await call(`${BASE}?${query}`, "GET"));
}

export async function getConcertRecord(id: number): Promise<ConcertRecord> {
  return unwrapData<ConcertRecord>(await call(`${BASE}/${id}`, "GET"));
}

export async function createConcertRecord(request: CreateConcertRecordRequest): Promise<ConcertRecord> {
  return unwrapData<ConcertRecord>(await call(BASE, "POST", request));
}

export async function updateConcertRecord(id: number, request: UpdateConcertRecordRequest): Promise<ConcertRecord> {
  return unwrapData<ConcertRecord>(await call(`${BASE}/${id}`, "PATCH", request));
}

export async function deleteConcertRecord(id: number): Promise<void> {
  await call(`${BASE}/${id}`, "DELETE");
}

export async function putConcertReview(id: number, request: PutConcertReviewRequest): Promise<ConcertReview> {
  return unwrapData<ConcertReview>(await call(`${BASE}/${id}/review`, "PUT", request));
}

export async function deleteConcertReview(id: number): Promise<void> {
  await call(`${BASE}/${id}/review`, "DELETE");
}

export async function putConcertSetlist(id: number, request: PutConcertSetlistRequest): Promise<SetlistTrack[]> {
  return unwrapData<SetlistTrack[]>(await call(`${BASE}/${id}/setlist`, "PUT", request));
}
