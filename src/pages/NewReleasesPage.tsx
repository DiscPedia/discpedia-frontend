import { useMemo } from "react";

import type { NewRelease } from "../apis/aladin";
import Record from "../components/common/Record";
import { useNewReleases } from "../hooks/useNewReleases";

const toRecordItem = (item: NewRelease) => ({
  id: item.aladinItemId,
  label: "NEW",
  format: item.mediaType,
  title: item.title,
  subtitle: item.artistName,
  date: item.releaseDate.replaceAll("-", "."),
  coverImageUrl: item.coverImageUrl,
});

const NewReleasesPage = () => {
  const { items, loading, error } = useNewReleases(50);
  const records = useMemo(() => items.map(toRecordItem), [items]);

  return (
    <main className="flex-1 w-full overflow-y-auto scrollbar-hide bg-[#F5F5F5]">
      <div className="flex flex-col gap-6 px-4 pb-10 pt-4">
        <div className="pl-3 text-2xl font-bold">새로 나온 음반</div>
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
            새로 나온 음반 목록을 불러오지 못했습니다.
          </div>
        )}
        {!loading && !error && records.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-500">
            새로 나온 음반이 없습니다.
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

export default NewReleasesPage;
