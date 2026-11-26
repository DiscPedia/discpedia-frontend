import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getConcertRecord, updateConcertRecord, type ConcertRecord } from "../../apis/concert/concert";
import { ConcertScaffold } from "../../components/concert/ConcertScaffold";
import { concertDateLabel } from "../../components/concert/concertDate";
import "./detail.css";

function concertTimeLabel(value: string | null): string {
  if (!value) return "";
  const [hour, minute] = value.split(":").map(Number);
  return `${hour < 12 ? "오전" : "오후"} ${hour % 12 || 12}:${String(minute).padStart(2, "0")}`;
}

export default function ConcertDetailPage() {
  const { id } = useParams();
  const recordId = Number(id);
  const navigate = useNavigate();
  const [record, setRecord] = useState<ConcertRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!Number.isInteger(recordId)) return;
    let active = true;
    getConcertRecord(recordId).then((result) => { if (active) setRecord(result); })
      .catch(() => { if (active) setError("관람 기록을 불러오지 못했습니다."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [recordId]);

  async function markAttended() {
    if (!record) return;
    try {
      setSaving(true);
      const updated = await updateConcertRecord(record.concertRecordId, { attendanceStatus: "ATTENDED" });
      setRecord(updated);
    } catch {
      setError("관람 상태를 변경하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ConcertScaffold title="관람 기록" onBack={() => navigate("/concert-records")}
      action={record ? { label: "수정", onClick: () => navigate(`/concert-records/${recordId}/edit`) } : undefined}
      bottomAction={record?.attendanceStatus === "PLANNED" ? <button type="button" className="concert-primary" onClick={markAttended} disabled={saving}>{saving ? "변경 중..." : "관람 완료로 변경"}</button> : undefined}
      footer={record?.attendanceStatus === "ATTENDED" ? "private" : "none"}>
      {loading && <p className="concert-hint">기록을 불러오는 중...</p>}
      {error && <p className="concert-error" role="alert">{error}</p>}
      {record?.attendanceStatus === "PLANNED" && <>
        <section className="concert-detail-hero concert-card">
          {record.posterImageUrl ? <img className="concert-poster" src={record.posterImageUrl} alt={`${record.concertName} 포스터`} /> : <div className="concert-poster concert-poster-empty">포스터</div>}
          <div className="concert-detail-copy">
            <span className={`concert-detail-badge ${record.attendanceStatus === "PLANNED" ? "planned" : "attended"}`}>{record.attendanceStatus === "PLANNED" ? "관람 예정" : "다녀옴"}</span>
            <h2>{record.concertName}</h2>
            <p>{record.artist.name}</p>
            <p>{concertDateLabel(record.concertDate)}{record.startTime ? ` · ${concertTimeLabel(record.startTime)}` : ""}</p>
            <p>{record.venue}{record.sessionLabel ? ` · ${record.sessionLabel}` : ""}</p>
          </div>
        </section>
        {record.seat && <section className="concert-detail-seat concert-card"><span>좌석</span><strong>{record.seat}</strong></section>}
        <p className="concert-detail-note">공연이 끝나면 직접 관람 완료로 변경해 주세요.</p>
      </>}
      {record?.attendanceStatus === "ATTENDED" && <>
        <section className="concert-detail-hero attended concert-card">
          {record.posterImageUrl ? <img className="concert-poster" src={record.posterImageUrl} alt={`${record.concertName} 포스터`} /> : <div className="concert-poster concert-poster-empty">포스터</div>}
          <div className="concert-detail-copy">
            <span className="concert-attended-date">다녀옴 · {concertDateLabel(record.concertDate)}</span>
            <h2>{record.concertName}</h2>
            <p>{record.artist.name} · {record.venue}</p>
            <p>{[record.sessionLabel, record.seat].filter(Boolean).join(" · ")}</p>
          </div>
        </section>
        <section className="concert-detail-panel concert-card">
          <div className="concert-panel-heading"><h3>관람 후기</h3><button type="button" onClick={() => navigate(`/concert-records/${recordId}/review`)}>{record.review ? "수정" : "작성"}</button></div>
          {record.review ? <><p className="concert-rating" aria-label={`별점 ${record.review.rating}점`}>{"★".repeat(record.review.rating)}<span>{"★".repeat(5 - record.review.rating)}</span></p><p className="concert-review-content">{record.review.content}</p></> : <p className="concert-hint">이 공연의 후기를 남겨 보세요.</p>}
        </section>
        <section className="concert-detail-panel concert-card">
          <div className="concert-panel-heading"><h3>셋리스트</h3><button type="button" onClick={() => navigate(`/concert-records/${recordId}/setlist`)}>{record.setlist.length ? "수정" : "작성"}</button></div>
          {record.setlist.length ? <ol className="concert-setlist-preview">{record.setlist.map((track) => <li key={track.order}><span>{String(track.order).padStart(2, "0")}</span>{track.title}</li>)}</ol> : <p className="concert-hint">기억나는 연주곡을 기록해 보세요.</p>}
        </section>
      </>}
    </ConcertScaffold>
  );
}
