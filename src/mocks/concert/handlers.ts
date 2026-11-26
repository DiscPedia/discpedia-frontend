import { http, HttpResponse } from "msw";
import type {
  ConcertRecord,
  ConcertRecordSummary,
  CreateConcertRecordRequest,
  PutConcertReviewRequest,
  PutConcertSetlistRequest,
  UpdateConcertRecordRequest,
} from "../../apis/concert/concert";
import { API_BASE_URL } from "../../apis/auth/api-config";
import { initialConcertRecords, mockConcertArtists } from "./fixtures";

const base = `${API_BASE_URL}/api/v1/concert-records`;
const storagePrefix = "discpedia:concert-mock:v1:";
const memory = new Map<string, ConcertRecord[]>();

function tokenFrom(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  return authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
}

function storageKey(token: string): string {
  // Mock 데이터를 계정별로 분리하되 토큰 원문을 저장 키에 노출하지 않습니다.
  let hash = 0;
  for (const char of token) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `${storagePrefix}${hash.toString(16)}`;
}

function load(token: string): ConcertRecord[] {
  const key = storageKey(token);
  if (memory.has(key)) return memory.get(key)!;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        memory.set(key, parsed as ConcertRecord[]);
        return memory.get(key)!;
      }
    }
  } catch {
    // 저장소가 차단된 브라우저에서는 메모리 Mock으로 계속 동작합니다.
  }
  const seeded = structuredClone(initialConcertRecords);
  memory.set(key, seeded);
  return seeded;
}

function save(token: string, records: ConcertRecord[]): void {
  const key = storageKey(token);
  memory.set(key, records);
  try {
    localStorage.setItem(key, JSON.stringify(records));
  } catch {
    // 큰 사용자 포스터 등으로 저장 용량을 넘겨도 현재 세션은 유지합니다.
  }
}

function ok<T>(data: T, status = 200) {
  return HttpResponse.json(
    { success: true, message: "OK", data, timestamp: new Date().toISOString() },
    { status },
  );
}

function error(status: number, code: string, message: string) {
  return HttpResponse.json(
    { success: false, code, message, data: null, timestamp: new Date().toISOString() },
    { status },
  );
}

function recordId(value: string | undefined): number {
  return Number(value);
}

function findRecord(records: ConcertRecord[], id: number): ConcertRecord | undefined {
  return records.find((record) => record.concertRecordId === id);
}

function normalized(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("ko-KR");
}

function sessionKey(record: Pick<ConcertRecord, "startTime" | "sessionLabel">): string {
  return record.startTime || normalized(record.sessionLabel || "");
}

function duplicate(records: ConcertRecord[], candidate: ConcertRecord, exceptId?: number): boolean {
  return records.some(
    (record) =>
      record.concertRecordId !== exceptId &&
      normalized(record.concertName) === normalized(candidate.concertName) &&
      record.concertDate === candidate.concertDate &&
      normalized(record.venue) === normalized(candidate.venue) &&
      sessionKey(record) === sessionKey(candidate),
  );
}

function summary(record: ConcertRecord): ConcertRecordSummary {
  const { review, setlist, ...rest } = record;
  return {
    ...rest,
    review: review ? { rating: review.rating, contentPreview: review.content.slice(0, 100) } : null,
    setlistTrackCount: setlist.length,
  };
}

function authorized(request: Request) {
  const token = tokenFrom(request);
  return token ? { token, records: load(token) } : null;
}

export const concertHandlers = [
  http.get(base, ({ request }) => {
    const state = authorized(request);
    if (!state) return error(401, "UNAUTHORIZED", "로그인이 필요합니다.");
    const url = new URL(request.url);
    const page = Math.max(0, Number(url.searchParams.get("page")) || 0);
    const size = Math.min(100, Math.max(1, Number(url.searchParams.get("size")) || 20));
    const ordered = [...state.records].sort((a, b) =>
      b.concertDate.localeCompare(a.concertDate) || b.concertRecordId - a.concertRecordId,
    );
    const items = ordered.slice(page * size, (page + 1) * size).map(summary);
    return ok({
      items,
      page,
      size,
      totalItems: ordered.length,
      totalPages: Math.ceil(ordered.length / size),
      hasNext: (page + 1) * size < ordered.length,
    });
  }),

  http.post(base, async ({ request }) => {
    const state = authorized(request);
    if (!state) return error(401, "UNAUTHORIZED", "로그인이 필요합니다.");
    const body = (await request.json()) as CreateConcertRecordRequest;
    const hasId = typeof body.artistId === "number";
    const hasName = Boolean(body.artistName?.trim());
    if (hasId === hasName || !body.concertName?.trim() || !body.concertDate || !body.venue?.trim()) {
      return error(400, "INVALID_CONCERT_RECORD", "필수 정보를 확인해 주세요.");
    }
    const artist = hasId
      ? mockConcertArtists.find((item) => item.artistId === body.artistId)
      : null;
    if (hasId && !artist) return error(400, "ARTIST_NOT_FOUND", "아티스트를 찾을 수 없습니다.");
    const now = new Date().toISOString();
    const record: ConcertRecord = {
      concertRecordId: Math.max(300, ...state.records.map((item) => item.concertRecordId)) + 1,
      concertName: body.concertName.trim(),
      artist: artist ?? { artistId: null, name: body.artistName!.trim() },
      concertDate: body.concertDate,
      startTime: body.startTime || null,
      sessionLabel: body.sessionLabel?.trim() || null,
      attendanceStatus: body.attendanceStatus ?? "PLANNED",
      venue: body.venue.trim(),
      seat: body.seat?.trim() || null,
      posterImageUrl: body.posterImageUrl || null,
      review: null,
      setlist: [],
      createdAt: now,
      updatedAt: now,
    };
    if (duplicate(state.records, record)) {
      return error(409, "CONCERT_RECORD_ALREADY_EXISTS", "같은 회차의 관람 기록이 이미 있습니다.");
    }
    save(state.token, [...state.records, record]);
    return ok(record, 201);
  }),

  http.get(`${base}/:id`, ({ request, params }) => {
    const state = authorized(request);
    if (!state) return error(401, "UNAUTHORIZED", "로그인이 필요합니다.");
    const record = findRecord(state.records, recordId(String(params.id)));
    return record ? ok(record) : error(404, "CONCERT_RECORD_NOT_FOUND", "관람 기록이 없습니다.");
  }),

  http.patch(`${base}/:id`, async ({ request, params }) => {
    const state = authorized(request);
    if (!state) return error(401, "UNAUTHORIZED", "로그인이 필요합니다.");
    const id = recordId(String(params.id));
    const current = findRecord(state.records, id);
    if (!current) return error(404, "CONCERT_RECORD_NOT_FOUND", "관람 기록이 없습니다.");
    const body = (await request.json()) as UpdateConcertRecordRequest;
    let artist = current.artist;
    if (typeof body.artistId === "number") {
      const selected = mockConcertArtists.find((item) => item.artistId === body.artistId);
      if (!selected) return error(400, "ARTIST_NOT_FOUND", "아티스트를 찾을 수 없습니다.");
      artist = selected;
    } else if (typeof body.artistName === "string" && body.artistName.trim()) {
      artist = { artistId: null, name: body.artistName.trim() };
    }
    const updated: ConcertRecord = {
      ...current,
      ...body,
      artist,
      concertName: body.concertName?.trim() ?? current.concertName,
      venue: body.venue?.trim() ?? current.venue,
      seat: body.seat === undefined ? current.seat : body.seat?.trim() || null,
      sessionLabel: body.sessionLabel === undefined ? current.sessionLabel : body.sessionLabel?.trim() || null,
      startTime: body.startTime === undefined ? current.startTime : body.startTime || null,
      updatedAt: new Date().toISOString(),
    };
    if (duplicate(state.records, updated, id)) {
      return error(409, "CONCERT_RECORD_ALREADY_EXISTS", "같은 회차의 관람 기록이 이미 있습니다.");
    }
    save(state.token, state.records.map((record) => (record.concertRecordId === id ? updated : record)));
    return ok(updated);
  }),

  http.delete(`${base}/:id`, ({ request, params }) => {
    const state = authorized(request);
    if (!state) return error(401, "UNAUTHORIZED", "로그인이 필요합니다.");
    const id = recordId(String(params.id));
    if (!findRecord(state.records, id)) return error(404, "CONCERT_RECORD_NOT_FOUND", "관람 기록이 없습니다.");
    save(state.token, state.records.filter((record) => record.concertRecordId !== id));
    return ok(null);
  }),

  http.put(`${base}/:id/review`, async ({ request, params }) => {
    const state = authorized(request);
    if (!state) return error(401, "UNAUTHORIZED", "로그인이 필요합니다.");
    const id = recordId(String(params.id));
    const current = findRecord(state.records, id);
    if (!current) return error(404, "CONCERT_RECORD_NOT_FOUND", "관람 기록이 없습니다.");
    const body = (await request.json()) as PutConcertReviewRequest;
    if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5 || !body.content?.trim()) {
      return error(400, "INVALID_CONCERT_REVIEW", "별점과 후기를 확인해 주세요.");
    }
    const review = { rating: body.rating, content: body.content.trim(), updatedAt: new Date().toISOString() };
    save(state.token, state.records.map((record) => record.concertRecordId === id ? { ...record, review, updatedAt: review.updatedAt } : record));
    return ok(review);
  }),

  http.delete(`${base}/:id/review`, ({ request, params }) => {
    const state = authorized(request);
    if (!state) return error(401, "UNAUTHORIZED", "로그인이 필요합니다.");
    const id = recordId(String(params.id));
    if (!findRecord(state.records, id)) return error(404, "CONCERT_RECORD_NOT_FOUND", "관람 기록이 없습니다.");
    save(state.token, state.records.map((record) => record.concertRecordId === id ? { ...record, review: null, updatedAt: new Date().toISOString() } : record));
    return ok(null);
  }),

  http.put(`${base}/:id/setlist`, async ({ request, params }) => {
    const state = authorized(request);
    if (!state) return error(401, "UNAUTHORIZED", "로그인이 필요합니다.");
    const id = recordId(String(params.id));
    const current = findRecord(state.records, id);
    if (!current) return error(404, "CONCERT_RECORD_NOT_FOUND", "관람 기록이 없습니다.");
    const body = (await request.json()) as PutConcertSetlistRequest;
    if (!Array.isArray(body.tracks) || body.tracks.length > 100 || body.tracks.some((track) => !track.title?.trim())) {
      return error(400, "INVALID_SETLIST", "셋리스트를 확인해 주세요.");
    }
    const setlist = body.tracks.map((track, index) => ({ ...track, order: index + 1, title: track.title.trim() }));
    save(state.token, state.records.map((record) => record.concertRecordId === id ? { ...record, setlist, updatedAt: new Date().toISOString() } : record));
    return ok(setlist);
  }),
];
