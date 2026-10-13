import { unwrapData } from "../apiResponse";
import { call } from "../auth/ApiService";

export type PortfolioValuePoint = {
  month: string;
  snapshotDate: string;
  totalValue: number;
  ownedCount: number;
  fallbackCount: number;
};

export type PortfolioGenre = {
  genre: string;
  count: number;
  percentage: number;
};

export type PortfolioReport = {
  totalValue: number;
  ownedCount: number;
  fallbackCount: number;
  changeAmount: number | null;
  changeRate: number | null;
  comparisonDate: string | null;
  asOf: string;
  valueHistory: PortfolioValuePoint[];
  genreDistribution: PortfolioGenre[];
};

const PORTFOLIO_REPORT_PATH = "/api/v1/portfolio/report";

/** GET /api/v1/portfolio/report?months={1..24} */
export const getPortfolioReport = async (
  months = 6,
): Promise<PortfolioReport> => {
  if (!Number.isInteger(months) || months < 1 || months > 24) {
    throw new RangeError("months는 1~24 사이의 정수여야 합니다.");
  }

  const query = new URLSearchParams({ months: String(months) });
  const response = await call(`${PORTFOLIO_REPORT_PATH}?${query}`, "GET");

  return unwrapData<PortfolioReport>(response);
};
