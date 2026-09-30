import backArrow from "../../assets/backArrow.svg";

type PortfolioHeaderProps = {
  onBack: () => void;
};

const PortfolioHeader = ({ onBack }: PortfolioHeaderProps) => {
  return (
    <header className="relative flex h-14 shrink-0 items-center border-b border-[#e5e7eb] bg-white px-4 shadow-sm shadow-black/[0.03]">
      <button
        type="button"
        onClick={onBack}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg p-1.5 transition-colors hover:bg-gray-100"
        aria-label="마이페이지로 돌아가기"
      >
        <img src={backArrow} alt="" className="h-5 w-5" />
      </button>
      <h1 className="w-full text-center text-base font-bold text-[#151b28]">
        포트폴리오 리포트
      </h1>
    </header>
  );
};

export default PortfolioHeader;
