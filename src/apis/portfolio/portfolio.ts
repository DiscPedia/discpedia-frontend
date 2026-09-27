import { call } from "../auth/ApiService";
import type { ApiResponse } from "../commontype";

export type PortfolioValuePoint = {
  month: string;
  label: string;
  value: number;
};

export type PortfolioGenre = {
  genre: string;
  label: string;
  count: number;
  ratio: number;
  color: string;
};

export type PortfolioReport = {
  totalValue: number;
  monthlyChangeAmount: number;
  monthlyChangeRate: number;
  albumCount: number;
  valueHistory: PortfolioValuePoint[];
  genreDistribution: PortfolioGenre[];
};

// 서버가 준비되기 전에도 화면을 개발·확인할 수 있도록 둔 임시 응답입니다.
// .env에 VITE_USE_MOCK_PORTFOLIO=false를 설정하면 실제 API를 호출합니다.
export const portfolioReportMock: PortfolioReport = {
  totalValue: 1_274_000,
  monthlyChangeAmount: 24_000,
  monthlyChangeRate: 15.2,
  albumCount: 25,
  valueHistory: [
    { month: "2025-10", label: "10월", value: 850_000 },
    { month: "2025-11", label: "11월", value: 920_000 },
    { month: "2025-12", label: "12월", value: 970_000 },
    { month: "2026-01", label: "1월", value: 1_080_000 },
    { month: "2026-02", label: "2월", value: 1_120_000 },
    { month: "2026-03", label: "3월", value: 1_240_000 },
    { month: "2026-04", label: "4월", value: 1_274_000 },
  ],
  genreDistribution: [
    { genre: "ROCK", label: "록", count: 8, ratio: 32, color: "#3B82F6" },
    { genre: "POP", label: "팝", count: 7, ratio: 28, color: "#10B981" },
    { genre: "CLASSIC", label: "클래식", count: 6, ratio: 24, color: "#F59E0B" },
    { genre: "JAZZ", label: "재즈", count: 4, ratio: 16, color: "#EF4444" },
  ],
};

const usePortfolioMock = import.meta.env.VITE_USE_MOCK_PORTFOLIO !== "false";

export const getPortfolioReport = async (
  months = 7,
): Promise<PortfolioReport> => {
  if (usePortfolioMock) {
    // 실제 네트워크 요청과 같은 로딩 상태를 확인할 수 있게 아주 짧게 지연합니다.
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    return portfolioReportMock;
  }

  const response = (await call(
    `/api/v1/portfolio/report?months=${months}`,
    "GET",
  )) as ApiResponse<PortfolioReport>;

  return response.data;
};
