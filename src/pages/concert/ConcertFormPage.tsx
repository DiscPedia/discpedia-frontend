import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createConcertRecord, getConcertRecord, updateConcertRecord, type AttendanceStatus, type ConcertRecord } from "../../apis/concert/concert";
import { searchArtists, type Artist } from "../../apis/recommand/artist";
import { ConcertScaffold } from "../../components/concert/ConcertScaffold";
import { mockConcertArtists } from "../../mocks/concert/fixtures";
import "./form.css";

const mocksEnabled = import.meta.env.VITE_ENABLE_CONCERT_MOCKS === "true" ||
  (import.meta.env.DEV && import.meta.env.VITE_ENABLE_CONCERT_MOCKS !== "false");

export default function ConcertFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const recordId = id ? Number(id) : null;
  const [status, setStatus] = useState<AttendanceStatus>("PLANNED");
  const [artistName, setArtistName] = useState("");
  const [artistOptions, setArtistOptions] = useState<Artist[]>(() => mocksEnabled
    ? mockConcertArtists.map((artist) => ({ id: artist.artistId, name: artist.name, initial: "", subName: "" }))
    : []);
  const [artistId, setArtistId] = useState<number | null>(null);
  const [concertName, setConcertName] = useState("");
  const [concertDate, setConcertDate] = useState("");
  const [venue, setVenue] = useState("");
  const [sessionLabel, setSessionLabel] = useState("");
  const [startTime, setStartTime] = useState("");
  const [seat, setSeat] = useState("");
  const [posterImageUrl, setPosterImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(recordId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!recordId) return;
    let active = true;
    getConcertRecord(recordId).then((record: ConcertRecord) => {
      if (!active) return;
      setStatus(record.attendanceStatus);
      setArtistName(record.artist.name);
      setArtistId(record.artist.artistId);
      setConcertName(record.concertName);
      setConcertDate(record.concertDate);
      setVenue(record.venue);
      setSessionLabel(record.sessionLabel ?? "");
      setStartTime(record.startTime ?? "");
      setSeat(record.seat ?? "");
      setPosterImageUrl(record.posterImageUrl);
    }).catch(() => { if (active) setError("관람 기록을 불러오지 못했습니다."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [recordId]);

  useEffect(() => {
    if (mocksEnabled || !artistName.trim()) return;
    let active = true;
    const timer = window.setTimeout(() => {
      searchArtists({ q: artistName, size: 10 }).then((results) => {
        if (active) setArtistOptions(results);
      }).catch(() => { if (active) setArtistOptions([]); });
    }, 250);
    return () => { active = false; window.clearTimeout(timer); };
  }, [artistName]);

  function changeArtist(value: string) {
    setArtistName(value);
    if (!value.trim() && !mocksEnabled) setArtistOptions([]);
    setArtistId(artistOptions.find((artist) => artist.name === value)?.id ?? null);
  }

  function choosePoster(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1_500_000) {
      setError("포스터 이미지는 1.5MB 이하로 선택해 주세요.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") setPosterImageUrl(reader.result); };
    reader.onerror = () => setError("이미지를 읽지 못했습니다.");
    reader.readAsDataURL(file);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!artistName.trim() || !concertName.trim() || !concertDate || !venue.trim()) {
      setError("필수 항목을 모두 입력해 주세요.");
      return;
    }
    const data = {
      concertName: concertName.trim(), concertDate, venue: venue.trim(), attendanceStatus: status,
      sessionLabel: sessionLabel.trim() || null, startTime: startTime || null,
      seat: seat.trim() || null, posterImageUrl,
      ...(artistId ? { artistId } : { artistName: artistName.trim() }),
    };
    try {
      setSaving(true);
      const record = recordId
        ? await updateConcertRecord(recordId, data)
        : await createConcertRecord(data);
      navigate(`/concert-records/${record.concertRecordId}`, { replace: true });
    } catch (cause) {
      setError(cause instanceof Error && /conflict/i.test(cause.message)
        ? "같은 공연·날짜·공연장·회차의 기록이 이미 있어요."
        : "관람 기록을 저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ConcertScaffold title={recordId ? "관람 기록 수정" : "관람 기록 등록"} onBack={() => navigate(recordId ? `/concert-records/${recordId}` : "/concert-records")}
      bottomAction={<button className="concert-primary" type="submit" form="concert-record-form" disabled={saving || loading}>{saving ? "저장 중..." : "관람 기록 저장"}</button>}>
      {loading ? <p className="concert-hint">기록을 불러오는 중...</p> : (
        <form id="concert-record-form" className="concert-form" onSubmit={submit}>
          <div className="concert-status-switch" role="group" aria-label="관람 상태">
            <button type="button" className={status === "PLANNED" ? "selected" : ""} onClick={() => setStatus("PLANNED")}>관람 예정</button>
            <button type="button" className={status === "ATTENDED" ? "selected" : ""} onClick={() => setStatus("ATTENDED")}>다녀옴</button>
          </div>
          <label>아티스트 *
            <input list="concert-artist-options" value={artistName} onChange={(event) => changeArtist(event.target.value)} placeholder="아티스트 검색 또는 이름 직접 입력" required />
            <datalist id="concert-artist-options">{artistOptions.map((artist) => <option key={artist.id} value={artist.name} />)}</datalist>
          </label>
          <p className="concert-form-help">목록에 없다면 이름을 직접 입력하세요.</p>
          <label>공연명 *<input value={concertName} onChange={(event) => setConcertName(event.target.value)} placeholder="공연명을 입력해 주세요" required /></label>
          <label>관람 날짜 *<input type="date" value={concertDate} onChange={(event) => setConcertDate(event.target.value)} required /></label>
          <label>공연장 *<input value={venue} onChange={(event) => setVenue(event.target.value)} placeholder="공연장 이름 입력" required /></label>
          <div className="concert-form-row"><label>회차<input value={sessionLabel} onChange={(event) => setSessionLabel(event.target.value)} placeholder="예: 2회차" /></label><label>시작 시간<input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} /></label></div>
          <label>좌석<input value={seat} onChange={(event) => setSeat(event.target.value)} placeholder="예: 2층 B구역 12열 8번" /></label>
          <label>포스터<span className="concert-file-input"><input type="file" accept="image/*" onChange={choosePoster} />{posterImageUrl ? "이미지 선택됨 · 다시 선택" : "이미지 선택 (선택)"}</span></label>
          {posterImageUrl && <img className="concert-form-poster" src={posterImageUrl} alt="선택한 공연 포스터" />}
          <p className="concert-hint">* 필수 항목 · 나머지는 선택 사항이에요.</p>
          {error && <p className="concert-error" role="alert">{error}</p>}
        </form>
      )}
    </ConcertScaffold>
  );
}
