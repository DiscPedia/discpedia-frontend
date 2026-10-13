type PortfolioValuationNoticeProps = {
  asOf: string;
  fallbackCount: number;
};

const formatAsOf = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const PortfolioValuationNotice = ({
  asOf,
  fallbackCount,
}: PortfolioValuationNoticeProps) => (
  <aside className="rounded-2xl border border-[#f4e7d5] bg-[#fffaf2] px-4 py-3 text-xs leading-5 text-[#725b3d]">
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
      <span>평가 기준 {formatAsOf(asOf)}</span>
      <strong className="font-bold text-[#9a5c1c]">
        추정가 적용 {fallbackCount.toLocaleString("ko-KR")}장
      </strong>
    </div>
    <p className="mt-1 text-[#927a5b]">
      시세는 매일 23:30(KST)에 갱신됩니다.
      {fallbackCount > 0 &&
        " 시세가 없는 음반은 구매가와 저장된 판매가 중 큰 금액을 반영합니다."}
    </p>
  </aside>
);

export default PortfolioValuationNotice;
