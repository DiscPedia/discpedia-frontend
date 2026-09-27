type PortfolioSummaryCardProps = {
  totalValue: number;
  monthlyChangeAmount: number;
  monthlyChangeRate: number;
};

const formatWon = (value: number) => `₩${Math.abs(value).toLocaleString("ko-KR")}`;

const PortfolioSummaryCard = ({
  totalValue,
  monthlyChangeAmount,
  monthlyChangeRate,
}: PortfolioSummaryCardProps) => {
  const isUp = monthlyChangeAmount >= 0;

  return (
    <section className="rounded-[22px] bg-gradient-to-br from-white via-white to-[#fff7ea] px-5 py-5 shadow-[0_4px_15px_rgba(31,41,55,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#6b7280]">총 자산 가치</p>
          <p className="mt-1.5 text-[34px] font-extrabold leading-none tracking-[-0.06em] text-[#172033] sm:text-[38px]">
            {formatWon(totalValue)}
          </p>
          <p className="mt-2 text-xs font-medium text-[#98a1b0]">
            전월 대비 {isUp ? "+" : "-"}{formatWon(monthlyChangeAmount)} {isUp ? "상승" : "하락"}
          </p>
        </div>
        <span
          className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
            isUp ? "bg-[#effcf4] text-[#16a34a]" : "bg-[#fff1f2] text-[#e11d48]"
          }`}
        >
          <span aria-hidden="true">{isUp ? "↗" : "↘"}</span>
          {isUp ? "+" : "-"}{Math.abs(monthlyChangeRate).toFixed(1)}%
        </span>
      </div>
    </section>
  );
};

export default PortfolioSummaryCard;
