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
import PortfolioValuationNotice from "../components/portfolio/PortfolioValuationNotice";
import PortfolioValueChart from "../components/portfolio/PortfolioValueChart";

const PORTFOLIO_MONTHS = 7;

const PortfolioPage = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState<PortfolioReport | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadReport = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await getPortfolioReport(PORTFOLIO_MONTHS);
        if (!cancelled) setReport(response);
      } catch {
        if (!cancelled) {
          setErrorMessage("포트폴리오 리포트를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadReport();
    return () => {
      cancelled = true;
    };
  }, [requestVersion]);

  const retry = () => setRequestVersion((version) => version + 1);

  return (
    <main className="flex min-h-dvh w-full flex-col bg-[#f7f7f8]">
      <PortfolioHeader onBack={() => navigate("/myPage")} />
      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-5 scrollbar-hide">
        {isLoading && !report && (
          <div
            className="animate-pulse space-y-6"
            role="status"
            aria-label="포트폴리오 로딩 중"
          >
            <div className="h-[121px] rounded-[22px] bg-white" />
            <div className="h-[245px] rounded-[20px] bg-white" />
            <div className="h-[278px] rounded-[20px] bg-white" />
          </div>
        )}

        {errorMessage && !report && (
          <div className="rounded-2xl border border-red-200 bg-white p-5 text-center">
            <p className="text-sm text-red-600">{errorMessage}</p>
            <button
              type="button"
              onClick={retry}
              className="mt-4 rounded-full bg-[#172033] px-4 py-2 text-sm font-bold text-white"
            >
              다시 시도
            </button>
          </div>
        )}

        {report && report.ownedCount === 0 && (
          <section className="rounded-[22px] border border-[#e8e9ed] bg-white px-6 py-12 text-center shadow-sm shadow-black/[0.05]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff3e8] text-2xl" aria-hidden="true">
              ♫
            </div>
            <h2 className="mt-4 text-lg font-extrabold text-[#1f2937]">
              보유 중인 음반이 없어요
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#7b8493]">
              컬렉션에 음반을 추가하면 가치와 장르 분포를 확인할 수 있어요.
            </p>
            <button
              type="button"
              onClick={() => navigate("/collection")}
              className="mt-6 rounded-full bg-[#ff6818] px-5 py-2.5 text-sm font-bold text-white"
            >
              내 컬렉션 보기
            </button>
          </section>
        )}

        {report && report.ownedCount > 0 && (
          <div className="space-y-7">
            <PortfolioSummaryCard
              totalValue={report.totalValue}
              changeAmount={report.changeAmount}
              changeRate={report.changeRate}
            />
            <PortfolioValuationNotice
              asOf={report.asOf}
              fallbackCount={report.fallbackCount}
            />
            <PortfolioValueChart values={report.valueHistory} />
            <PortfolioGenreChart
              genres={report.genreDistribution}
              albumCount={report.ownedCount}
            />
            <PortfolioDownloadButton report={report} />
          </div>
        )}
      </div>
    </main>
  );
};

export default PortfolioPage;
