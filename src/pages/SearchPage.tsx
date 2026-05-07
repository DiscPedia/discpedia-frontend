import Record from "../components/common/Record";

const SearchPage = () => {
  const newReleases = [
    {
      id: 1,
      label: "NEW",
      format: "CD",
      title: "리스트: 피아노 협주곡",
      subtitle: "리스트",
      date: "2025.03.31",
    },
    {
      id: 2,
      label: "NEW",
      format: "CD",
      title: "모차르트: 피아노 협주곡",
      subtitle: "모차르트",
      date: "2025.04.01",
    },
    {
      id: 3,
      label: "NEW",
      format: "CD",
      title: "브람스: 교향곡",
      subtitle: "브람스",
      date: "2025.04.05",
    },
  ];

  return (
    <main className="flex-1 w-full overflow-y-auto bg-[#F5F5F5]">
      <div className="px-4 pb-10 pt-4 flex flex-col gap-6">
        <section className="w-full">
          <div className="bg-white rounded-full px-4 py-3 flex items-center gap-3 shadow-sm border border-gray-100">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
            <input
              type="text"
              placeholder="아티스트, 앨범명, 장르 검색"
              className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
            />
          </div>
        </section>
        <div className="text-2xl font-bold pl-3">추천 음반</div>
        <section className="grid grid-cols-2 gap-6">
          {newReleases.map((item) => (
            <Record key={item.id} item={item} />
          ))}
        </section>
      </div>
    </main>
  );
};

export default SearchPage;
