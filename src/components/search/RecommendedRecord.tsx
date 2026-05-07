const RecommendedRecord = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-b from-[#F6D7D7] to-white">
        <div className="flex items-center justify-between text-[10px] font-semibold">
          <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full">
            NEW
          </span>
          <span className="bg-black text-white px-2 py-0.5 rounded-full">
            CD
          </span>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <div className="w-[120px] h-[120px] rounded-2xl bg-white shadow-lg flex items-center justify-center">
            <div className="w-[92px] h-[92px] rounded-xl bg-rose-200" />
          </div>
        </div>
      </div>
      <div className="px-4 pt-4 pb-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[18px] font-semibold text-gray-900">리스트 : 피아노 협주</p>
          <span className="text-xs text-gray-400">2026.03.31</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">리스트</p>
      </div>
    </div>
  );
};

export default RecommendedRecord;
