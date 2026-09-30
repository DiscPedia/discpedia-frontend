import type { PortfolioValuePoint } from "../../apis/portfolio/portfolio";

type PortfolioValueChartProps = {
  values: PortfolioValuePoint[];
};

const formatAxisValue = (value: number) => `₩${Math.round(value / 10_000)}만`;

const PortfolioValueChart = ({ values }: PortfolioValueChartProps) => {
  const width = 310;
  const height = 218;
  const plot = { left: 49, right: 286, top: 22, bottom: 178 };
  const maxValue = Math.max(...values.map((item) => item.value), 1);
  const axisMax = Math.ceil(maxValue / 100_000) * 100_000 + 100_000;
  const axisSteps = [axisMax, axisMax * 0.75, axisMax * 0.5, axisMax * 0.25, 0];
  const graphWidth = plot.right - plot.left;
  const graphHeight = plot.bottom - plot.top;
  const points = values.map((item, index) => {
    const x = values.length === 1 ? (plot.left + plot.right) / 2 : plot.left + (graphWidth * index) / (values.length - 1);
    const y = plot.bottom - (item.value / axisMax) * graphHeight;
    return { ...item, x, y };
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <section>
      <h2 className="flex items-center gap-1.5 text-lg font-extrabold text-[#1f2937]">
        <span aria-hidden="true" className="text-xl font-medium leading-none">〽</span>
        가치 추이
      </h2>
      <div className="mt-3 overflow-hidden rounded-[20px] border border-[#e8e9ed] bg-white px-1.5 py-2 shadow-sm shadow-black/[0.05]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="block h-auto w-full"
          role="img"
          aria-label="월별 포트폴리오 가치 추이"
        >
          {axisSteps.map((tick) => {
            const y = plot.bottom - (tick / axisMax) * graphHeight;
            return (
              <g key={tick}>
                <line x1={plot.left} x2={plot.right} y1={y} y2={y} stroke="#edf0f3" strokeWidth="1" />
                <text x="2" y={y + 4} fill="#98a1b0" fontSize="11">{formatAxisValue(tick)}</text>
              </g>
            );
          })}
          <polyline fill="none" points={line} stroke="#ff6818" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((point) => (
            <g key={point.month}>
              <circle cx={point.x} cy={point.y} r="4" fill="white" stroke="#ff6818" strokeWidth="2.5" />
              <text x={point.x} y="201" textAnchor="middle" fill="#98a1b0" fontSize="11">{point.label}</text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
};

export default PortfolioValueChart;
