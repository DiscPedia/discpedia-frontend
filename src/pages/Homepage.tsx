const HomePage = () => {
  const newReleases = [
    {
      id: 1,
      label: "NEW",
      format: "CD",
      title: "리스트: 피아노 협주곡",
      subtitle: "리스트",
      date: "2025.03.31",
      accent: "bg-rose-100",
    },
    {
      id: 2,
      label: "NEW",
      format: "CD",
      title: "모차르트: 피아노 협주곡",
      subtitle: "모차르트",
      date: "2025.04.01",
      accent: "bg-blue-100",
    },
    {
      id: 3,
      label: "NEW",
      format: "CD",
      title: "브람스: 교향곡",
      subtitle: "브람스",
      date: "2025.04.05",
      accent: "bg-green-100",
    },
  ];

  const usedAlbums = [
    {
      id: 1,
      badge: "중고매물 6건",
      format: "CD",
      title: "EP 3집 자몽살구클럽",
      artist: "한로로",
      price: "19,000원",
      accent: "bg-indigo-100",
    },
    {
      id: 2,
      badge: "중고매물 2건",
      format: "CD",
      title: "2집 POWER ANDRE 9!",
      artist: "실리카겔",
      price: "45,000원",
      accent: "bg-blue-100",
    },
    {
      id: 3,
      badge: "중고매물 4건",
      format: "CD",
      title: "정규 4집 제자",
      artist: "잔나비",
      price: "39,000원",
      accent: "bg-emerald-100",
    },
  ];

  const hotContents = [
    {
      id: 1,
      name: "이리떽",
      title: "악뮤 (AKMU) · 정규 4집 개화",
      excerpt: "좋음, 좋음, 좋음! 꼭 한번 들어보세요.",
      likes: 1993,
      comments: 20,
      rating: 5,
    },
    {
      id: 2,
      name: "키키",
      title: "리클 · 싱글 앨범",
      excerpt: "앨범 전체가 가볍게 듣기 좋아요.",
      likes: 37,
      comments: 9,
      rating: 4,
    },
  ];

  const artistNews = [
    {
      id: 1,
      name: "한로로-자문실구름 클럽",
      subtitle: "정규 1집 발매 예정",
      tags: ["LP", "발매 예정", "관심 아티스트"],
    },
    {
      id: 2,
      name: "실리카겔 · SGTAPE-02",
      subtitle: "LP 바이닐",
      tags: ["LP", "관심 아티스트"],
    },
  ];

  return (
    <main className="flex-1 w-full overflow-y-auto bg-[#F5F5F5]">
      <div className="px-4 pb-8 pt-4 flex flex-col gap-6">
        <section className="w-full">
          <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border border-orange-100 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <span className="text-xl">🔥</span>
            </div>
            <div className="text-sm text-gray-700 leading-snug">
              <p className="font-semibold">한로로 - 이상비행 LP 리프레스</p>
              <p className="text-gray-500">예약판매 오늘 14:00 시작!</p>
            </div>
          </div>
        </section>

        <section className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-white bg-[#FFB347] px-2 py-0.5 rounded-full">
                NEW
              </span>
              <h2 className="text-lg font-semibold text-gray-900">새로 나온 음반</h2>
            </div>
            <button type="button" className="text-sm text-gray-400">
              전체보기
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {newReleases.map((item) => (
              <article
                key={item.id}
                className="min-w-[150px] bg-white rounded-2xl p-3 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between text-[10px] font-semibold">
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    {item.label}
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {item.format}
                  </span>
                </div>
                <div
                  className={`w-full h-24 rounded-xl mt-3 ${item.accent} flex items-center justify-center`}
                >
                  <div className="w-12 h-12 rounded-lg bg-white shadow-inner" />
                </div>
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{item.date}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🏠</span>
              <h2 className="text-lg font-semibold text-gray-900">중고 거래 음반</h2>
            </div>
            <button type="button" className="text-sm text-gray-400">
              더보기
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {usedAlbums.map((item) => (
              <article
                key={item.id}
                className="min-w-[180px] bg-white rounded-2xl p-3 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between text-[10px] font-semibold">
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {item.format}
                  </span>
                </div>
                <div
                  className={`w-full h-28 rounded-xl mt-3 ${item.accent} flex items-center justify-center`}
                >
                  <div className="w-14 h-14 rounded-lg bg-white shadow-inner" />
                </div>
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.artist}</p>
                  <p className="text-base font-semibold text-[#4C6FFF] mt-2">
                    {item.price}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">지금 뜨는 콘텐츠</h2>
            <button type="button" className="text-sm text-gray-400">
              더보기
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {hotContents.map((item) => (
              <article
                key={item.id}
                className="min-w-[260px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100" />
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <span className="text-[10px] text-white bg-red-400 px-1.5 py-0.5 rounded-full">
                      W
                    </span>
                  </div>
                  <div className="text-yellow-400 text-xs">
                    {"★".repeat(item.rating)}
                  </div>
                </div>
                <div className="mt-3 flex gap-3">
                  <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-inner" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{item.excerpt}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                  <span>👍 {item.likes}</span>
                  <span>💬 {item.comments}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="w-full flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-900">관심 아티스트 소식</h2>
          <div className="flex flex-col gap-3">
            {artistNews.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-black" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
