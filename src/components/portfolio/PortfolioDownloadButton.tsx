import type { PortfolioReport } from "../../apis/portfolio/portfolio";

type PortfolioDownloadButtonProps = {
  report: PortfolioReport;
};

const PortfolioDownloadButton = ({ report }: PortfolioDownloadButtonProps) => {
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "discpedia-portfolio-report.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="fixed bottom-5 right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg shadow-black/25 transition-transform hover:scale-105 active:scale-95"
      aria-label="포트폴리오 리포트 다운로드"
      title="리포트 데이터 다운로드"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v11" />
        <path d="m8 10 4 4 4-4" />
        <path d="M5 20h14" />
      </svg>
    </button>
  );
};

export default PortfolioDownloadButton;
