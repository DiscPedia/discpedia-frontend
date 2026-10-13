import type { PortfolioGenre } from "../../apis/portfolio/portfolio";

type PortfolioGenreChartProps = {
  genres: PortfolioGenre[];
  albumCount: number;
};

const genreLabels: Record<string, string> = {
  INDIE_ROCK: "록",
  K_POP: "K-POP",
  JAZZ: "재즈",
  CLASSIC: "클래식",
  POP: "팝",
  HIPHOP_RNB: "힙합/R&B",
  ELECTRONIC: "일렉트로닉",
  OST: "OST",
  NEW_AGE: "뉴에이지",
  WORLD: "월드",
  ETC: "기타",
};

const chartColors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#64748B",
  "#14B8A6",
  "#A855F7",
];

const getGenreLabel = (genre: string) =>
  genreLabels[genre] ?? genre.replaceAll("_", " ");

const PortfolioGenreChart = ({ genres, albumCount }: PortfolioGenreChartProps) => {
  if (genres.length === 0) {
    return (
      <section>
        <h2 className="flex items-center gap-1.5 text-lg font-extrabold text-[#1f2937]">
          <span aria-hidden="true" className="text-[19px] leading-none">◔</span>
          장르별 분포
        </h2>
        <div className="mt-3 flex min-h-48 items-center justify-center rounded-[20px] border border-[#e8e9ed] bg-white px-6 text-center text-sm leading-6 text-[#98a1b0] shadow-sm shadow-black/[0.05]">
          분류된 장르 정보가 없어요.
        </div>
      </section>
    );
  }

  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const chartSegments = genres.map((genre, index) => {
    const progress = genres
      .slice(0, index)
      .reduce((total, item) => total + item.percentage / 100, 0);

    return {
      genre,
      color: chartColors[index % chartColors.length],
      length: (genre.percentage / 100) * circumference,
      offset: -progress * circumference,
    };
  });

  return (
    <section>
      <h2 className="flex items-center gap-1.5 text-lg font-extrabold text-[#1f2937]">
        <span aria-hidden="true" className="text-[19px] leading-none">◔</span>
        장르별 분포
      </h2>
      <div className="mt-3 rounded-[20px] border border-[#e8e9ed] bg-white px-4 py-5 shadow-sm shadow-black/[0.05]">
        <div className="relative mx-auto h-[150px] w-[150px]">
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" role="img" aria-label="장르별 보유 음반 분포">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#f0f1f3"
              strokeWidth="18"
            />
            {chartSegments.map(({ genre, color, length, offset }) => {
              const gap = 5;
              return (
                <circle
                  key={genre.genre}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={color}
                  strokeWidth="18"
                  strokeDasharray={`${Math.max(length - gap, 0)} ${circumference}`}
                  strokeDashoffset={offset}
                >
                  <title>{`${getGenreLabel(genre.genre)} ${genre.count}장 (${genre.percentage.toFixed(1)}%)`}</title>
                </circle>
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <strong className="text-2xl font-extrabold leading-none text-[#273244]">{albumCount}</strong>
            <span className="mt-1 text-[10px] font-bold tracking-wide text-[#9aa3b2]">ALBUMS</span>
          </div>
        </div>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-2">
          {genres.map((genre, index) => (
            <li key={genre.genre} className="flex items-center gap-1.5 text-xs font-semibold text-[#586174]">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: chartColors[index % chartColors.length] }}
              />
              {getGenreLabel(genre.genre)} {genre.count}장 · {genre.percentage.toFixed(1)}%
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PortfolioGenreChart;
