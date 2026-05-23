import { useEffect, useMemo, useState } from "react";

import { searchAlbums, type AlbumSearchItem } from "../apis/aladin";
import Record from "../components/common/Record";
import { useNewReleases } from "../hooks/useNewReleases";

const toRecordItem = (item: AlbumSearchItem) => ({
  id: item.aladinItemId,
  label: "NEW",
  format: item.mediaType,
  title: item.title,
  subtitle: item.artistName,
  date: item.releaseDate.replaceAll("-", "."),
  coverImageUrl: item.coverImageUrl,
});

const SearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [searchState, setSearchState] = useState<{
    items: AlbumSearchItem[];
    loading: boolean;
    error: string | null;
  }>({
    items: [],
    loading: false,
    error: null,
  });
  const trimmedKeyword = keyword.trim();
  const isSearching = trimmedKeyword.length > 0;
  const {
    items: newReleaseItems,
    loading: newReleaseLoading,
    error: newReleaseError,
  } = useNewReleases(20);

  useEffect(() => {
    if (!trimmedKeyword) {
      return;
    }

    let ignore = false;
    const timer = window.setTimeout(async () => {
      try {
        setSearchState((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));

        const data = await searchAlbums({
          q: trimmedKeyword,
          limit: 10,
          offset: 0,
        });

        if (!ignore) {
          setSearchState({
            items: data.items,
            loading: false,
            error: null,
          });
        }
      } catch {
        if (!ignore) {
          setSearchState({
            items: [],
            loading: false,
            error: "Failed to search albums",
          });
        }
      }
    }, 300);

    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [trimmedKeyword]);

  const records = useMemo(
    () =>
      (isSearching ? searchState.items : newReleaseItems).map((item) =>
        toRecordItem(item),
      ),
    [isSearching, newReleaseItems, searchState.items],
  );
  const loading = isSearching ? searchState.loading : newReleaseLoading;
  const error = isSearching ? searchState.error : newReleaseError;
  const title = isSearching ? "검색 결과" : "새로 나온 음반";

  return (
    <main className="flex-1 w-full overflow-y-auto scrollbar-hide bg-[#F5F5F5]">
      <div className="px-4 pb-10 pt-4 flex flex-col gap-6">
        <section className="w-full">
          <div className="bg-white rounded-full px-4 py-3 flex items-center gap-3 shadow-sm border border-gray-100">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="아티스트, 앨범명, 장르 검색"
              className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
            />
          </div>
        </section>
        <div className="text-2xl font-bold pl-3">{title}</div>
        {loading && (
          <section className="grid grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[250px] rounded-3xl bg-white border border-gray-100 shadow-md animate-pulse"
              />
            ))}
          </section>
        )}
        {!loading && error && (
          <div className="bg-white rounded-2xl p-4 text-sm text-gray-500 border border-gray-100">
            {isSearching
              ? "검색 결과를 불러오지 못했습니다."
              : "새 음반 목록을 불러오지 못했습니다."}
          </div>
        )}
        {!loading && !error && records.length === 0 && (
          <div className="bg-white rounded-2xl p-4 text-sm text-gray-500 border border-gray-100">
            {isSearching ? "검색 결과가 없습니다." : "새로 나온 음반이 없습니다."}
          </div>
        )}
        <section className="grid grid-cols-2 gap-6">
          {!loading &&
            !error &&
            records.map((item) => <Record key={item.id} item={item} />)}
        </section>
      </div>
    </main>
  );
};

export default SearchPage;
