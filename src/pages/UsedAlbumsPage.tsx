import { useEffect, useMemo, useState } from "react";

import { getUsedAlbums, type UsedAlbum } from "../apis/aladin";
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
  const [items, setItems] = useState<UsedAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadUsedAlbums = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUsedAlbums({ page: 0, size: 50 });

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
  }, []);

  const records = useMemo(() => items.map(toRecordItem), [items]);

  return (
    <main className="flex-1 w-full overflow-y-auto scrollbar-hide bg-[#F5F5F5]">
      <div className="flex flex-col gap-6 px-4 pb-10 pt-4">
        <div className="pl-3 text-2xl font-bold">중고 거래 음반</div>
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
