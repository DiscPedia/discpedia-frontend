import type { RecordItem } from '../../types/record';

const Record = ({item} : {item:RecordItem}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
        <article
          key={item.id}
          className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden"
        >
          <div className={`p-4 bg-linear-to-b from-[#F6D7D7] to-white`}>
            <div className="flex items-center justify-between text-[10px] font-semibold">
              <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full">
                {item.label}
              </span>
              <span className="bg-black text-white px-2 py-0.5 rounded-full">
                {item.format}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <div className="w-30 h-30 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                <div className={`w-23 h-23 rounded-xl`} />
              </div>
            </div>
          </div>
          <div className="px-4 pt-4 pb-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[18px] font-semibold text-gray-900">{item.title}</p>
              <span className="text-xs text-gray-400">{item.date}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
          </div>
        </article>
    </div>
  );
};

export default Record;
