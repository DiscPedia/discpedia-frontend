import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import searchIcon from "../assets/search.svg";
import {
  searchArtists,
  getFavoriteArtists,
  updateFavoriteArtists,
  type Artist,
} from "../apis/recommand/artist";

const RecommandPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isOnboarding =
    (location.state as { onboarding?: boolean } | null)?.onboarding ?? true;

  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 최초 진입: 목록 + 기존 관심 아티스트
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [artistList, favorites] = await Promise.all([
          searchArtists({ size: 100 }),
          getFavoriteArtists(),
        ]);

        if (cancelled) return;

        setArtists(artistList);
        setSelectedIds(favorites.map((f) => f.artistId));
      } catch (error) {
        console.error("아티스트 목록 로딩 실패", error);
        if (!cancelled) {
          setErrorMessage("아티스트를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  // 검색어 변경 시 서버 검색 (디바운스)
  useEffect(() => {
    if (isLoading) return;

    const q = keyword.trim();
    const timer = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        setErrorMessage("");

        const data = await searchArtists({
          q: q || undefined,
          size: 100,
        });

        setArtists(data);
      } catch (error) {
        console.error("아티스트 검색 실패", error);
        setErrorMessage("검색에 실패했습니다.");
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [keyword, isLoading]);

  const displayArtists = useMemo(() => artists, [artists]);

  const toggleArtist = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const handleComplete = async () => {
    if (selectedIds.length === 0 || isSaving) return;

    try {
      setIsSaving(true);
      setErrorMessage("");

      await updateFavoriteArtists(selectedIds, {
        completeOnboarding: isOnboarding,
      });

      navigate("/home", { replace: true });
    } catch (error) {
      console.error("관심 아티스트 저장 실패", error);
      setErrorMessage("저장에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
  };
  console.log(artists)
  if (isLoading) {
    return (
      <main className="flex h-dvh w-full items-center justify-center bg-[#F5F5F6]">
        <p className="text-sm text-[#8B8B93]">아티스트 불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="flex h-dvh w-full flex-col bg-[#F5F5F6] px-5 py-6">
      <section className="shrink-0">
        <h1 className="text-[24px] font-extrabold leading-tight text-[#111111]">
          관심있는 아티스트
        </h1>
        <p className="mt-2 text-[13px] text-[#8B8B93]">
          선택한 아티스트의 신보 소식을 알려드려요.
        </p>

        <div className="relative mt-4">
          <img
            src={searchIcon}
            alt=""
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
          />
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="아티스트 검색"
            className="h-11 w-full rounded-[12px] bg-[#ECECEF] pl-11 pr-4 text-[14px] text-[#2B2B2B] outline-none placeholder:text-[#A7A7AE]"
          />
        </div>

        {isSearching && (
          <p className="mt-2 text-xs text-[#8B8B93]">검색 중...</p>
        )}
      </section>

      <section className="mt-6 min-h-0 flex-1 overflow-y-auto">
        {displayArtists.length === 0 ? (
          <p className="text-center text-sm text-[#8B8B93]">
            검색 결과가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-y-6 pb-4">
            {displayArtists.map((artist) => {
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
                  <span className="mt-2 line-clamp-2 text-center text-[12px] font-medium text-[#222222]">
                    {artist.name}
                    {artist.subName ? ` ${artist.subName}` : ""}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <div className="shrink-0 pb-1 pt-2">
        {errorMessage && (
          <p className="mb-2 text-center text-sm text-red-500">{errorMessage}</p>
        )}
        <button
          type="button"
          onClick={handleComplete}
          disabled={selectedIds.length === 0 || isSaving}
          className={`h-12 w-full rounded-[12px] text-[15px] font-semibold ${
            selectedIds.length === 0 || isSaving
              ? "cursor-not-allowed bg-[#CFCFD4] text-white"
              : "bg-[#050505] text-white"
          }`}
        >
          {isSaving
            ? "저장 중..."
            : `${selectedIds.length}명 선택 완료`}
        </button>
      </div>
    </main>
  );
};

export default RecommandPage;