import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getConcertRecord, putConcertReview, type ConcertRecord } from "../../apis/concert/concert";
import { ConcertScaffold } from "../../components/concert/ConcertScaffold";
import { concertDateLabel } from "../../components/concert/concertDate";
import "./review.css";

export default function ConcertReviewPage() {
  const { id } = useParams();
  const recordId = Number(id);
  const navigate = useNavigate();
  const [record, setRecord] = useState<ConcertRecord | null>(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getConcertRecord(recordId).then((result) => {
      if (!active) return;
      setRecord(result);
      setRating(result.review?.rating ?? 0);
      setContent(result.review?.content ?? "");
    }).catch(() => { if (active) setError("공연 정보를 불러오지 못했습니다."); });
    return () => { active = false; };
  }, [recordId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!record || record.attendanceStatus !== "ATTENDED") return;
    if (rating < 1 || !content.trim()) {
      setError("별점과 후기를 입력해 주세요.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await putConcertReview(recordId, { rating, content: content.trim() });
      navigate(`/concert-records/${recordId}`, { replace: true });
    } catch {
      setError("후기를 저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ConcertScaffold title="관람 후기 작성" onBack={() => navigate(`/concert-records/${recordId}`)}
      bottomAction={<button type="submit" form="concert-review-form" className="concert-primary" disabled={saving || !record || record.attendanceStatus !== "ATTENDED"}>{saving ? "저장 중..." : "후기 저장"}</button>}>
      {record && <form id="concert-review-form" onSubmit={submit} className="concert-review-form">
        <div className="concert-review-summary concert-card"><strong>{record.concertName}</strong><span>{record.artist.name} · {concertDateLabel(record.concertDate)} · {record.venue}</span></div>
        {record.attendanceStatus === "ATTENDED" ? <>
          <h2>이 공연은 어땠나요?</h2>
          <div className="concert-review-stars" role="group" aria-label="별점 선택">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} className={value <= rating ? "selected" : ""} aria-label={`${value}점`} aria-pressed={value === rating}>★</button>)}</div>
          <p className="concert-review-score">{rating.toFixed(1)} / 5.0</p>
          <label htmlFor="concert-review-text">관람 후기</label>
          <textarea id="concert-review-text" value={content} onChange={(event) => setContent(event.target.value)} placeholder="공연에서 기억에 남은 순간을 적어 주세요." />
          <p className="concert-hint">후기는 나만 볼 수 있어요.</p>
        </> : <p className="concert-error">관람 완료한 공연에 후기를 작성할 수 있어요.</p>}
        {error && <p className="concert-error" role="alert">{error}</p>}
      </form>}
      {!record && !error && <p className="concert-hint">공연 정보를 불러오는 중...</p>}
      {!record && error && <p className="concert-error" role="alert">{error}</p>}
    </ConcertScaffold>
  );
}
