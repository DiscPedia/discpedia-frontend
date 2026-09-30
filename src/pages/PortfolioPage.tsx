import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getPortfolioReport,
  type PortfolioReport,
} from "../apis/portfolio/portfolio";
import PortfolioDownloadButton from "../components/portfolio/PortfolioDownloadButton";
import PortfolioGenreChart from "../components/portfolio/PortfolioGenreChart";
import PortfolioHeader from "../components/portfolio/PortfolioHeader";
import PortfolioSummaryCard from "../components/portfolio/PortfolioSummaryCard";
import PortfolioValueChart from "../components/portfolio/PortfolioValueChart";

const PortfolioPage = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState<PortfolioReport | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadReport = async () => {
      try {
        setErrorMessage("");
        const response = await getPortfolioReport(7);
        if (!cancelled) setReport(response);
      } catch {
        if (!cancelled) {
          setErrorMessage("포트폴리오 리포트를 불러오지 못했습니다.");
        }
      }
    };

    void loadReport();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="flex min-h-dvh w-full flex-col bg-[#f7f7f8]">
      <PortfolioHeader onBack={() => navigate("/myPage")} />
      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-5 scrollbar-hide">
        {!report && !errorMessage && (
          <div className="animate-pulse space-y-6" aria-label="포트폴리오 로딩 중">
            <div className="h-[121px] rounded-[22px] bg-white" />
            <div className="h-[245px] rounded-[20px] bg-white" />
            <div className="h-[278px] rounded-[20px] bg-white" />
          </div>
        )}

        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        {report && (
          <div className="space-y-7">
            <PortfolioSummaryCard
              totalValue={report.totalValue}
              monthlyChangeAmount={report.monthlyChangeAmount}
              monthlyChangeRate={report.monthlyChangeRate}
            />
            <PortfolioValueChart values={report.valueHistory} />
            <PortfolioGenreChart
              genres={report.genreDistribution}
              albumCount={report.albumCount}
            />
            <PortfolioDownloadButton report={report} />
          </div>
        )}
      </div>
    </main>
  );
};

export default PortfolioPage;
