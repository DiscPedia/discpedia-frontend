import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import "./concert.css";

type Props = {
  title: string;
  children: ReactNode;
  action?: { label: string; onClick: () => void };
  footer?: "navigation" | "private" | "none";
  bottomAction?: ReactNode;
  onBack?: () => void;
};

export function ConcertScaffold({ title, children, action, footer = "none", bottomAction, onBack }: Props) {
  const navigate = useNavigate();

  return (
    <div className="concert-page">
      <div className="concert-status" aria-hidden="true">
        <span>9:41</span><span className="concert-status-icons">● ▰</span>
      </div>
      <header className="concert-header">
        <button type="button" onClick={onBack ?? (() => navigate(-1))}>뒤로</button>
        <h1>{title}</h1>
        {action ? <button type="button" onClick={action.onClick}>{action.label}</button> : <span />}
      </header>
      <main className="concert-main">{children}</main>
      {bottomAction && <div className="concert-action-footer">{bottomAction}</div>}
      {footer === "navigation" && (
        <nav className="concert-nav" aria-label="하단 탐색">
          <button type="button" onClick={() => navigate("/home")}>홈</button>
          <button type="button" className="active" onClick={() => navigate("/concert-records")}>관람 기록</button>
          <button type="button" onClick={() => navigate("/myPage")}>마이</button>
        </nav>
      )}
      {footer === "private" && <footer className="concert-private-footer">내 기록만 볼 수 있어요</footer>}
    </div>
  );
}
