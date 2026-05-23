import { useNavigate } from "react-router-dom";
type RecordItem = {
  id: number;
  label: string;
  format: string;
  title: string;
  subtitle: string;
  date: string;
  coverImageUrl?: string;
};

const Record = ({ item }: { item: RecordItem }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4">
      <button
        type="button"
        onClick={() =>
          navigate(`/detail/${item.id}`, { state: { record: item } })
        }
        className="text-left"
      >
        <article className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
          <div className="relative aspect-square bg-gray-100">
            {item.coverImageUrl ? (
              <img
                src={item.coverImageUrl}
                alt={item.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full bg-gray-100" />
            )}
            <div className="absolute left-4 right-4 top-4 flex items-center justify-between text-[10px] font-semibold">
              <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full">
                {item.label}
              </span>
              <span className="bg-black text-white px-2 py-0.5 rounded-full">
                {item.format}
              </span>
            </div>
          </div>
          <div className="px-4 pt-4 pb-5">
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 flex-1 truncate text-[18px] font-semibold text-gray-900">
                {item.title}
              </p>
              <span className="text-xs text-gray-400">{item.date}</span>
            </div>
            <p className="truncate text-sm text-gray-500 mt-1">
              {item.subtitle}
            </p>
          </div>
        </article>
      </button>
    </div>
  );
};

export default Record;
