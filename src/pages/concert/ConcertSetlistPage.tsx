import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getConcertRecord, putConcertSetlist, type ConcertRecord, type SetlistTrack } from "../../apis/concert/concert";
import { ConcertScaffold } from "../../components/concert/ConcertScaffold";
import { concertDateLabel } from "../../components/concert/concertDate";
import "./setlist.css";

export default function ConcertSetlistPage() {
  const { id } = useParams();
  const recordId = Number(id);
  const navigate = useNavigate();
  const [record, setRecord] = useState<ConcertRecord | null>(null);
  const [tracks, setTracks] = useState<SetlistTrack[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getConcertRecord(recordId).then((result) => {
      if (!active) return;
      setRecord(result);
      setTracks(result.setlist);
    }).catch(() => { if (active) setError("공연 정보를 불러오지 못했습니다."); });
    return () => { active = false; };
  }, [recordId]);

  function changeTrack(index: number, field: "title" | "artistName", value: string) {
    setTracks((current) => current.map((track, position) => position === index ? { ...track, [field]: value } : track));
  }

  function moveTrack(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= tracks.length) return;
    setTracks((current) => {
      const copy = [...current];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!record || record.attendanceStatus !== "ATTENDED") return;
    if (tracks.some((track) => !track.title.trim())) {
      setError("모든 곡의 제목을 입력해 주세요.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await putConcertSetlist(recordId, { tracks: tracks.map((track, index) => ({ ...track, title: track.title.trim(), artistName: track.artistName.trim() || record.artist.name, order: index + 1 })) });
      navigate(`/concert-records/${recordId}`, { replace: true });
    } catch {
      setError("셋리스트를 저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ConcertScaffold title="셋리스트 기록" onBack={() => navigate(`/concert-records/${recordId}`)}
      bottomAction={<button type="submit" form="concert-setlist-form" className="concert-primary" disabled={saving || !record || record.attendanceStatus !== "ATTENDED"}>{saving ? "저장 중..." : "셋리스트 저장"}</button>}>
      {record && <form id="concert-setlist-form" onSubmit={submit} className="concert-setlist-form">
        <div className="concert-setlist-summary concert-card"><strong>{record.concertName}</strong><span>{record.artist.name} · {concertDateLabel(record.concertDate)} · {record.venue}</span></div>
        {record.attendanceStatus === "ATTENDED" ? <>
          <p className="concert-setlist-intro">공연에서 연주한 곡을 순서대로 적어 주세요.</p>
          {tracks.map((track, index) => <div className="concert-setlist-track concert-card" key={`${index}-${track.order}`}>
            <span className="concert-track-number">{String(index + 1).padStart(2, "0")}</span>
            <div className="concert-track-inputs">
              <input aria-label={`${index + 1}번 곡명`} value={track.title} onChange={(event) => changeTrack(index, "title", event.target.value)} placeholder="곡명" />
              <input aria-label={`${index + 1}번 곡 아티스트`} value={track.artistName} onChange={(event) => changeTrack(index, "artistName", event.target.value)} placeholder="아티스트" />
            </div>
            <div className="concert-track-actions">
              <button type="button" aria-label={`${index + 1}번 곡 위로 이동`} disabled={index === 0} onClick={() => moveTrack(index, -1)}>↑</button>
              <button type="button" aria-label={`${index + 1}번 곡 아래로 이동`} disabled={index === tracks.length - 1} onClick={() => moveTrack(index, 1)}>↓</button>
              <button type="button" aria-label={`${index + 1}번 곡 삭제`} onClick={() => setTracks((current) => current.filter((_, position) => position !== index))}>×</button>
            </div>
          </div>)}
          <button className="concert-add-track concert-card" type="button" onClick={() => setTracks((current) => [...current, { order: current.length + 1, title: "", artistName: record.artist.name, encore: false, memo: null }])}>+ 곡 추가</button>
          <p className="concert-hint">곡 순서는 위아래 버튼으로 변경할 수 있어요.</p>
        </> : <p className="concert-error">관람 완료한 공연에 셋리스트를 작성할 수 있어요.</p>}
        {error && <p className="concert-error" role="alert">{error}</p>}
      </form>}
      {!record && !error && <p className="concert-hint">공연 정보를 불러오는 중...</p>}
      {!record && error && <p className="concert-error" role="alert">{error}</p>}
    </ConcertScaffold>
  );
}
