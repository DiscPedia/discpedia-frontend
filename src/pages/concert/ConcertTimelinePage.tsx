import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConcertRecords, type ConcertRecordSummary } from "../../apis/concert/concert";
import { ConcertScaffold } from "../../components/concert/ConcertScaffold";
import { concertDateLabel } from "../../components/concert/concertDate";
import "./timeline.css";

export default function ConcertTimelinePage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<ConcertRecordSummary[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getConcertRecords(page).then((result) => {
      if (!active) return;
      setRecords((previous) => page === 0 ? result.items : [...previous, ...result.items]);
      setHasNext(result.hasNext);
    }).catch(() => {
      if (active) setError("관람 기록을 불러오지 못했습니다.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page]);

  const planned = records.filter((record) => record.attendanceStatus === "PLANNED");
  const attended = records.filter((record) => record.attendanceStatus === "ATTENDED");

  const cards = (items: ConcertRecordSummary[]) => items.map((record) => (
    <button key={record.concertRecordId} type="button" className="concert-list-card concert-card" onClick={() => navigate(`/concert-records/${record.concertRecordId}`)}>
      {record.posterImageUrl ? <img className="concert-poster" src={record.posterImageUrl} alt={`${record.concertName} 포스터`} /> : <div className="concert-poster concert-poster-empty">포스터</div>}
      <span className="concert-list-copy">
        <span className={`concert-list-date ${record.attendanceStatus === "PLANNED" ? "planned" : "attended"}`}>{concertDateLabel(record.concertDate)}</span>
        <strong>{record.concertName}</strong>
        <span className="concert-list-meta">{record.artist.name} · {record.venue}{record.sessionLabel ? ` · ${record.sessionLabel}` : ""}</span>
        <span className={`concert-list-status ${record.attendanceStatus === "PLANNED" ? "planned" : "attended"}`}>{record.attendanceStatus === "PLANNED" ? "관람 예정" : "다녀옴"}</span>
      </span>
    </button>
  ));

  return (
    <ConcertScaffold title="관람 기록" footer="navigation" onBack={() => navigate("/myPage")} action={{ label: "+ 등록", onClick: () => navigate("/concert-records/new") }}>
      <div className="concert-list-heading"><h2>나의 콘서트</h2><span>{records.length}개의 기록</span></div>
      {loading && page === 0 ? <p className="concert-hint">기록을 불러오는 중...</p> : null}
      {error ? <p className="concert-error" role="alert">{error}</p> : null}
      {!loading && !error && records.length === 0 ? <p className="concert-card concert-empty">첫 콘서트 관람 기록을 등록해 보세요.</p> : null}
      {planned.length > 0 && <section className="concert-list-section"><h3>다가오는 공연</h3>{cards(planned)}</section>}
      {attended.length > 0 && <section className="concert-list-section"><h3>다녀온 공연</h3>{cards(attended)}</section>}
      {records.length > 0 && <p className="concert-list-note">내 관람 기록은 나만 볼 수 있어요.</p>}
      {hasNext && <button type="button" className="concert-list-more" onClick={() => { setLoading(true); setPage((value) => value + 1); }}>기록 더 보기</button>}
    </ConcertScaffold>
  );
}
