type PortfolioSummaryCardProps = {
  totalValue: number;
  changeAmount: number | null;
  changeRate: number | null;
};

const formatWon = (value: number) => `₩${Math.abs(value).toLocaleString("ko-KR")}`;

const PortfolioSummaryCard = ({
  totalValue,
  changeAmount,
  changeRate,
}: PortfolioSummaryCardProps) => {
  const isUp = changeAmount !== null && changeAmount > 0;
  const isDown = changeAmount !== null && changeAmount < 0;
  const badgeIsUp = changeRate !== null && changeRate > 0;
  const badgeIsDown = changeRate !== null && changeRate < 0;

  return (
    <section className="rounded-[22px] bg-gradient-to-br from-white via-white to-[#fff7ea] px-5 py-5 shadow-[0_4px_15px_rgba(31,41,55,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#6b7280]">총 자산 가치</p>
          <p className="mt-1.5 text-[34px] font-extrabold leading-none tracking-[-0.06em] text-[#172033] sm:text-[38px]">
            {formatWon(totalValue)}
          </p>
          <p className="mt-2 text-xs font-medium text-[#98a1b0]">
            전월 대비 가치 변화{" "}
            {changeAmount === null
              ? "—"
              : `${isUp ? "+" : isDown ? "-" : ""}${formatWon(changeAmount)} ${isUp ? "상승" : isDown ? "하락" : "변동 없음"}`}
          </p>
        </div>
        <span
          className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
            badgeIsUp
              ? "bg-[#effcf4] text-[#16a34a]"
              : badgeIsDown
                ? "bg-[#fff1f2] text-[#e11d48]"
                : "bg-gray-100 text-gray-500"
          }`}
        >
          {changeRate !== null && changeRate !== 0 && (
            <span aria-hidden="true">{badgeIsUp ? "↗" : "↘"}</span>
          )}
          {changeRate === null
            ? "—"
            : `${badgeIsUp ? "+" : badgeIsDown ? "-" : ""}${Math.abs(changeRate).toFixed(1)}%`}
        </span>
      </div>
    </section>
  );
};

export default PortfolioSummaryCard;
