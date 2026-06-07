import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getUsedAlbums,
  type AladinGenre,
  type UsedAlbum,
} from "../apis/aladin";
import type { MediaType } from "../apis/collection/collection";
import AlbumFilterBar from "../components/common/AlbumFilterBar";
import Record from "../components/common/Record";

const toRecordItem = (item: UsedAlbum) => ({
  id: item.aladinItemId,
  label: "USED",
  format: item.mediaType,
  title: item.title,
  subtitle: item.artistName,
  date: `${item.usedPrice.toLocaleString("ko-KR")}원`,
  coverImageUrl: item.coverImageUrl,
});

const UsedAlbumsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<UsedAlbum[]>([]);
  const [mediaType, setMediaType] = useState<MediaType | undefined>();
  const [genre, setGenre] = useState<AladinGenre | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadUsedAlbums = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUsedAlbums({
          page: 0,
          size: 50,
          mediaType,
          genre,
        });

        if (!ignore) {
          setItems(data.items);
        }
      } catch {
        if (!ignore) {
          setError("Failed to load used albums");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadUsedAlbums();

    return () => {
      ignore = true;
    };
  }, [genre, mediaType]);

  const records = useMemo(() => items.map(toRecordItem), [items]);

  return (
    <main className="flex-1 w-full overflow-y-auto scrollbar-hide bg-[#F5F5F5]">
      <div className="flex flex-col gap-6 px-4 pb-10 pt-4">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-lg shadow-sm"
            aria-label="뒤로가기"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold">중고 거래 음반</h1>
        </header>
        <AlbumFilterBar
          mediaType={mediaType}
          genre={genre}
          onMediaTypeChange={setMediaType}
          onGenreChange={setGenre}
        />
        {loading && (
          <section className="grid grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[250px] animate-pulse rounded-3xl border border-gray-100 bg-white shadow-md"
              />
            ))}
          </section>
        )}
        {!loading && error && (
          <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-500">
            중고 거래 음반 목록을 불러오지 못했습니다.
          </div>
        )}
        {!loading && !error && records.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-500">
            중고 거래 음반이 없습니다.
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

export default UsedAlbumsPage;
