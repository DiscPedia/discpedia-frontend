import type { PortfolioGenre } from "../../apis/portfolio/portfolio";

type PortfolioGenreChartProps = {
  genres: PortfolioGenre[];
  albumCount: number;
};

const PortfolioGenreChart = ({ genres, albumCount }: PortfolioGenreChartProps) => {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const chartSegments = genres.map((genre, index) => {
    const progress = genres
      .slice(0, index)
      .reduce((total, item) => total + item.ratio / 100, 0);

    return {
      genre,
      length: (genre.ratio / 100) * circumference,
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
            {chartSegments.map(({ genre, length, offset }) => {
              const gap = 5;
              return (
                <circle
                  key={genre.genre}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={genre.color}
                  strokeWidth="18"
                  strokeDasharray={`${Math.max(length - gap, 0)} ${circumference}`}
                  strokeDashoffset={offset}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <strong className="text-2xl font-extrabold leading-none text-[#273244]">{albumCount}</strong>
            <span className="mt-1 text-[10px] font-bold tracking-wide text-[#9aa3b2]">ALBUMS</span>
          </div>
        </div>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-2">
          {genres.map((genre) => (
            <li key={genre.genre} className="flex items-center gap-1.5 text-xs font-semibold text-[#586174]">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: genre.color }} />
              {genre.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PortfolioGenreChart;
