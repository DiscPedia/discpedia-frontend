import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getUsedAlbums,
  type NewRelease,
  type UsedAlbum,
} from "../apis/aladin";
import { useNewReleases } from "../hooks/useNewReleases";
import { getHighQualityCoverUrl } from "../util/imageUtil";

const formatDate = (value: string) => value.replaceAll("-", ".");

const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

type NewReleaseCardProps = {
  item: NewRelease;
  onClick: () => void;
};

const NewReleaseCard = ({ item, onClick }: NewReleaseCardProps) => {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onClick();
        }
      }}
      className="min-w-[150px] w-[150px] bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer"
    >
      <div className="flex items-center justify-between gap-2 text-[10px] font-semibold">
        <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
          NEW
        </span>
        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          {item.mediaType}
        </span>
      </div>
      <div className="w-full aspect-square rounded-xl mt-3 bg-gray-100 overflow-hidden">
        {item.coverImageUrl ? (
          <img
            src={getHighQualityCoverUrl(item.coverImageUrl)}
            alt={item.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gray-100" />
        )}
      </div>
      <div className="mt-3">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {item.title}
        </p>
        <p className="text-xs text-gray-500 truncate">{item.artistName}</p>
        <p className="text-[10px] text-gray-400 mt-1">
          {formatDate(item.releaseDate)}
        </p>
        <p className="text-sm font-semibold text-[#4C6FFF] mt-1">
          {formatWon(item.priceSales)}
        </p>
      </div>
    </article>
  );
};

type NewReleaseSectionProps = {
  items: NewRelease[];
  loading: boolean;
  error: string | null;
  onItemClick: (aladinItemId: number) => void;
};

const NewReleaseSection = ({
  items,
  loading,
  error,
  onItemClick,
}: NewReleaseSectionProps) => {
  return (
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

      {loading && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="min-w-[150px] w-[150px] h-[210px] bg-white rounded-2xl p-3 shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-10 rounded-full bg-gray-100" />
                <div className="h-4 w-8 rounded-full bg-gray-100" />
              </div>
              <div className="w-full aspect-square rounded-xl mt-3 bg-gray-100" />
              <div className="h-4 w-full rounded bg-gray-100 mt-3" />
              <div className="h-3 w-16 rounded bg-gray-100 mt-2" />
              <div className="h-4 w-20 rounded bg-gray-100 mt-3" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-white rounded-2xl p-4 text-sm text-gray-500 border border-gray-100">
          새 음반 목록을 불러오지 못했습니다.
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="bg-white rounded-2xl p-4 text-sm text-gray-500 border border-gray-100">
          새로 나온 음반이 없습니다.
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {items.map((item) => (
            <NewReleaseCard
              key={item.newReleaseId}
              item={item}
              onClick={() => onItemClick(item.aladinItemId)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

type UsedAlbumCardProps = {
  item: UsedAlbum;
  onClick: () => void;
};

const UsedAlbumCard = ({ item, onClick }: UsedAlbumCardProps) => {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onClick();
        }
      }}
      className="min-w-[180px] w-[180px] bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer"
    >
      <div className="flex items-center justify-between gap-2 text-[10px] font-semibold">
        <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
          중고
        </span>
        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          {item.mediaType}
        </span>
      </div>
      <div className="w-full aspect-square rounded-xl mt-3 bg-gray-100 overflow-hidden">
        {item.coverImageUrl ? (
          <img
            src={getHighQualityCoverUrl(item.coverImageUrl)}
            alt={item.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gray-100" />
        )}
      </div>
      <div className="mt-3">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {item.title}
        </p>
        <p className="text-xs text-gray-500 truncate">{item.artistName}</p>
        <p className="text-base font-semibold text-[#4C6FFF] mt-2">
          {formatWon(item.usedPrice)}
        </p>
      </div>
    </article>
  );
};

type UsedAlbumSectionProps = {
  items: UsedAlbum[];
  loading: boolean;
  error: string | null;
  onItemClick: (aladinItemId: number) => void;
};

const UsedAlbumSection = ({
  items,
  loading,
  error,
  onItemClick,
}: UsedAlbumSectionProps) => {
  return (
    <section className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">💿</span>
          <h2 className="text-lg font-semibold text-gray-900">
            중고 거래 음반
          </h2>
        </div>
        <button type="button" className="text-sm text-gray-400">
          더보기
        </button>
      </div>

      {loading && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="min-w-[180px] w-[180px] h-[235px] bg-white rounded-2xl p-3 shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-10 rounded-full bg-gray-100" />
                <div className="h-4 w-8 rounded-full bg-gray-100" />
              </div>
              <div className="w-full aspect-square rounded-xl mt-3 bg-gray-100" />
              <div className="h-4 w-full rounded bg-gray-100 mt-3" />
              <div className="h-3 w-20 rounded bg-gray-100 mt-2" />
              <div className="h-5 w-24 rounded bg-gray-100 mt-3" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-white rounded-2xl p-4 text-sm text-gray-500 border border-gray-100">
          중고 음반 목록을 불러오지 못했습니다.
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="bg-white rounded-2xl p-4 text-sm text-gray-500 border border-gray-100">
          중고 거래 음반이 없습니다.
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {items.map((item) => (
            <UsedAlbumCard
              key={item.aladinItemId}
              item={item}
              onClick={() => onItemClick(item.aladinItemId)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const {
    items: newReleases,
    loading: newReleasesLoading,
    error: newReleasesError,
  } = useNewReleases(20);
  const [usedAlbums, setUsedAlbums] = useState<UsedAlbum[]>([]);
  const [usedAlbumsLoading, setUsedAlbumsLoading] = useState(true);
  const [usedAlbumsError, setUsedAlbumsError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadUsedAlbums = async () => {
      try {
        setUsedAlbumsLoading(true);
        setUsedAlbumsError(null);

        const data = await getUsedAlbums({ page: 0, size: 20 });

        if (!ignore) {
          setUsedAlbums(data.items);
        }
      } catch {
        if (!ignore) {
          setUsedAlbumsError("Failed to load used albums");
        }
      } finally {
        if (!ignore) {
          setUsedAlbumsLoading(false);
        }
      }
    };

    void loadUsedAlbums();

    return () => {
      ignore = true;
    };
  }, []);

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
    <main className="flex-1 w-full overflow-y-auto scrollbar-hide bg-[#F5F5F5]">
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

        <NewReleaseSection
          items={newReleases}
          loading={newReleasesLoading}
          error={newReleasesError}
          onItemClick={(aladinItemId) => navigate(`/detail/${aladinItemId}`)}
        />

        <UsedAlbumSection
          items={usedAlbums}
          loading={usedAlbumsLoading}
          error={usedAlbumsError}
          onItemClick={(aladinItemId) => navigate(`/detail/${aladinItemId}`)}
        />

        <section className="w-full flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            관심 아티스트 소식
          </h2>
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
                  <p className="text-sm font-semibold text-gray-900">
                    {item.name}
                  </p>
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
