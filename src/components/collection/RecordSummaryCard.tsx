import { getHighQualityCoverUrl } from "../../util/imageUtil";

interface Props {
  title: string;
  subtitle: string;
  coverImageUrl?: string;
}

const RecordSummaryCard = ({ title, subtitle, coverImageUrl }: Props) => {
  return (
    <section className="px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden">
          {coverImageUrl ? (
            <img
              src={getHighQualityCoverUrl(coverImageUrl)}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-white" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 leading-snug">
            {title}
          </p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
    </section>
  );
};

export default RecordSummaryCard;
