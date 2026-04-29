import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../assets/search.svg";
import { getArtists, type Artist } from "../apis/artist";

const RecommandPage = () => {
  const navigate = useNavigate();

  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await getArtists();
        setArtists(data);
      } catch (error) {
        console.error("아티스트 목록 로딩 실패", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const filteredArtists = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return artists;

    return artists.filter((artist) =>
      `${artist.name} ${artist.subName}`.toLowerCase().includes(q),
    );
  }, [artists, keyword]);

  const toggleArtist = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const handleComplete = () => {
    if (selectedIds.length === 0) return;
    navigate("/home");
  };

  if (isLoading) {
    return (
      <main className="flex h-dvh w-full items-center justify-center bg-[#F5F5F6]">
        <p className="text-sm text-[#8B8B93]">아티스트 불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="flex h-dvh w-full flex-col bg-[#F5F5F6] px-5 py-6">
      <section>
        <h1 className="text-[24px] font-extrabold leading-tight text-[#111111]">
          관심있는 아티스트
        </h1>
        <p className="mt-2 text-[13px] text-[#8B8B93]">
          선택한 아티스트의 신보 소식을 알려드려요.
        </p>

        <div className="relative mt-4">
          <img
            src={searchIcon}
            alt="검색"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
          />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="아티스트 검색"
            className="h-11 w-full rounded-[12px] bg-[#ECECEF] pl-11 pr-4 text-[14px] text-[#2B2B2B] outline-none placeholder:text-[#A7A7AE]"
          />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-3 gap-y-6">
        {filteredArtists.map((artist) => {
          const isSelected = selectedIds.includes(artist.id);

          return (
            <button
              key={artist.id}
              type="button"
              onClick={() => toggleArtist(artist.id)}
              className="flex flex-col items-center"
            >
              <span
                className={`relative flex h-16 w-16 items-center justify-center rounded-full text-[24px] font-extrabold ${
                  isSelected
                    ? "bg-[#050505] text-white"
                    : "bg-[#E7E7EA] text-[#A9A9AF]"
                }`}
              >
                {artist.initial}
                {isSelected && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#2F80FF] text-[12px] text-white">
                    ✓
                  </span>
                )}
              </span>
              <span className="mt-2 text-[12px] font-medium text-[#222222]">
                {artist.name} {artist.subName}
              </span>
            </button>
          );
        })}
      </section>

      <div className="mt-auto pb-1">
        <button
          type="button"
          onClick={handleComplete}
          disabled={selectedIds.length === 0}
          className={`h-12 w-full rounded-[12px] text-[15px] font-semibold ${
            selectedIds.length === 0
              ? "cursor-not-allowed bg-[#CFCFD4] text-white"
              : "bg-[#050505] text-white"
          }`}
        >
          {selectedIds.length}명 선택 완료
        </button>
      </div>
    </main>
  );
};

export default RecommandPage;
