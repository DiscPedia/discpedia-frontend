import { useEffect, useMemo, useState } from "react";

import {
  getCollectionItems,
  getCollectionSummary,
  type CollectionItem,
} from "../apis/collection/collection";

type FilterTab = "ALL" | "LP" | "CD" | "WISHLIST";

const formatWon = (value: number) => `₩${value.toLocaleString("ko-KR")}`;

const CollectionPage = () => {
  const [summaryValue, setSummaryValue] = useState(0);
  const [counts, setCounts] = useState({ lp: 0, cd: 0, wishlist: 0 });
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        const summary = await getCollectionSummary();
        if (!cancelled) {
          setSummaryValue(summary.totalValue);
          setCounts({
            lp: summary.counts.lp,
            cd: summary.counts.cd,
            wishlist: summary.counts.wishlist,
          });
        }
      } catch {
        if (!cancelled) {
          setErrorMessage("컬렉션 요약 정보를 불러오지 못했습니다.");
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadList = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        const params =
          activeTab === "LP"
            ? {
                mediaType: "LP" as const,
                status: "OWNED" as const,
                page: 0,
                size: 50,
              }
            : activeTab === "CD"
              ? {
                  mediaType: "CD" as const,
                  status: "OWNED" as const,
                  page: 0,
                  size: 50,
                }
              : activeTab === "WISHLIST"
                ? { status: "WISHLIST" as const, page: 0, size: 50 }
                : { page: 0, size: 50 };
        const pageData = await getCollectionItems(params);
        if (!cancelled) setItems(pageData.items);
      } catch {
        if (!cancelled) {
          setErrorMessage("컬렉션 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void loadList();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const topCountCards = useMemo(
    () => [
      { key: "LP", label: "LP", value: counts.lp, bg: "bg-[#DCE9F7]" },
      { key: "CD", label: "CD", value: counts.cd, bg: "bg-[#DDEFE6]" },
      {
        key: "WISHLIST",
        label: "위시리스트",
        value: counts.wishlist,
        bg: "bg-[#EFE8C8]",
      },
    ],
    [counts],
  );
  return (
    <div className="relative w-full flex-1 overflow-y-auto bg-[#f5f5f5] px-4 pb-24 pt-3">
      <section className="rounded-2xl bg-[#EBEDF0] p-4">
        <p className="text-sm font-semibold text-gray-700">내 컬렉션 총 가치</p>
        <p className="mt-1 text-4xl font-black tracking-tight text-gray-900">
          {formatWon(summaryValue)}
        </p>
      </section>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {topCountCards.map((card) => (
          <div
            key={card.key}
            className={`rounded-2xl border border-gray-200 py-3 text-center ${card.bg}`}
          >
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            <p className="mt-1 text-[11px] text-gray-600">{card.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        {[
          { key: "ALL", label: "전체" },
          { key: "LP", label: "LP" },
          { key: "CD", label: "CD" },
          { key: "WISHLIST", label: "위시리스트" },
        ].map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as FilterTab)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? "bg-[#FF6A00] text-white"
                  : "bg-[#D9DDE3] text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <section className="mt-3 space-y-3 grid grid-cols-2 gap-2">
        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
            컬렉션을 불러오는 중...
          </div>
        )}
        {!loading && errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-600">
            {errorMessage}
          </div>
        )}
        {!loading && !errorMessage && items.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
            표시할 컬렉션이 없습니다.
          </div>
        )}
        {!loading &&
          !errorMessage &&
          items.map((item) => (
            <article
              key={item.collectionItemId}
              className="flex align-center rounded-2xl border border-gray-200 bg-white p-3 shadow-sm shadow-gray-200/50"
            >
              <div className="flex flex-col gap-3">
                <img
                  src={item.album.coverImageUrl}
                  alt={item.album.title}
                  className="h-[92px] w-[92px] rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                    {item.album.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {item.album.artistName}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400">
                    {item.album.releaseDate}
                  </p>
                  {item.status === "WISHLIST" ? (
                    <span className="mt-2 inline-block rounded-full bg-[#EFE8C8] px-2 py-0.5 text-[11px] font-semibold text-[#7A5D00]">
                      위시리스트
                    </span>
                  ) : (
                    <p className="mt-2 text-xs text-gray-700">
                      추정가{" "}
                      {formatWon(
                        item.currentEstimatedPrice ?? item.album.listPrice,
                      )}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
      </section>
    </div>
  );
};

export default CollectionPage;
