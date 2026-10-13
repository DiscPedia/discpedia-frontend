export const PORTFOLIO_REPORT_INVALIDATED_EVENT =
  "discpedia:portfolio-report-invalidated";

export const invalidatePortfolioReport = () => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(PORTFOLIO_REPORT_INVALIDATED_EVENT));
};
