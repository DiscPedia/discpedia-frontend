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
      await updateConcertRecord(record.concertRecordId, { attendanceStatus: "ATTENDED" });
      navigate("/concert-records", { replace: true });
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
      {record && <>
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
        {record.attendanceStatus === "PLANNED" && <p className="concert-detail-note">공연이 끝나면 직접 관람 완료로 변경해 주세요.</p>}
      </>}
    </ConcertScaffold>
  );
}
