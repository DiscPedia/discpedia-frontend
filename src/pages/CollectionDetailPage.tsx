import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import shareIcon from "../assets/share.svg";
import trashIcon from "../assets/redTrashCan.svg";
import pencilIcon from "../assets/pencil.svg";
import dollarIcon from "../assets/dollar.svg";
import calendarIcon from "../assets/calendar.svg";
import storeIcon from "../assets/store.svg";
import conditionIcon from "../assets/condition.svg";
import backIcon from "../assets/backArrow.svg";

import {
  getCollectionItemDetail,
  type CollectionItemDetail,
} from "../apis/collection/collectionDetail";

const formatWon = (value?: number) =>
  typeof value === "number" ? `₩${value.toLocaleString("ko-KR")}` : "-";

const formatRate = (rate?: number, amount?: number) => {
  if (typeof rate !== "number" || typeof amount !== "number") return null;
  const up = amount >= 0;
  return `${up ? "+" : ""}${rate}% (${formatWon(amount)})`;
};

const CollectionDetailPage = () => {
  const navigate = useNavigate();
  const { collectionItemId } = useParams();
  const [item, setItem] = useState<CollectionItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!collectionItemId) {
        setErrorMessage("유효하지 않은 컬렉션 아이디입니다.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setErrorMessage("");
        const data = await getCollectionItemDetail(Number(collectionItemId));
        if (!cancelled) setItem(data);
      } catch {
        if (!cancelled) setErrorMessage("컬렉션 상세를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [collectionItemId]);

  const priceDiff = useMemo(
    () => formatRate(item?.priceChangeRate, item?.priceChangeAmount),
    [item?.priceChangeAmount, item?.priceChangeRate],
  );

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f5f5f5]">
      <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-gray-700"
        >
          <img src={backIcon} alt="뒤로가기" className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-md p-2 hover:bg-gray-100">
            <img src={shareIcon} alt="공유" className="h-5 w-5" />
          </button>
          <button type="button" className="rounded-md p-2 hover:bg-gray-100">
            <img src={pencilIcon} alt="수정" className="h-5 w-5" />
          </button>
          <button type="button" className="rounded-md p-2 hover:bg-gray-100">
            <img src={trashIcon} alt="삭제" className="h-5 w-5" />
          </button>
        </div>
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-3 pb-[calc(96px+env(safe-area-inset-bottom))]">
        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
            불러오는 중...
          </div>
        )}
        {!loading && errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-600">
            {errorMessage}
          </div>
        )}
        {!loading && !errorMessage && item && (
          <div className="space-y-3">
            <section className="rounded-2xl border border-gray-200 bg-white p-3">
              <img
                src={item.album.coverImageUrl}
                alt={item.album.title}
                className="w-full h-auto rounded-xl object-contain"
              />
              <p className="mt-3 text-sm text-gray-500">
                {item.album.artistName}
              </p>
              <h1 className="mt-1 text-lg font-bold text-gray-900">
                {item.album.title}
              </h1>
            </section>
            <section className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500">현재 추정 시세</p>
              <p className="mt-1 text-3xl font-extrabold text-[#2B5FFF]">
                {formatWon(item.currentEstimatedPrice ?? item.album.listPrice)}
              </p>
              {priceDiff && (
                <p className="mt-1 text-xs font-semibold text-[#0A9B47]">
                  {priceDiff}
                </p>
              )}
            </section>
            <section className="rounded-2xl border border-gray-200 bg-white p-4">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">
                구매/상태 정보
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-500">
                    <img src={dollarIcon} alt="" className="h-4 w-4" /> 구매가격
                  </span>
                  <span className="font-medium">
                    {formatWon(item.purchasePrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-500">
                    <img src={calendarIcon} alt="" className="h-4 w-4" />{" "}
                    구매날짜
                  </span>
                  <span className="font-medium">
                    {item.purchaseDate ?? "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-500">
                    <img src={storeIcon} alt="" className="h-4 w-4" /> 구매처
                  </span>
                  <span className="font-medium">
                    {item.purchaseStore ?? "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-500">
                    <img src={conditionIcon} alt="" className="h-4 w-4" />{" "}
                    컨디션
                  </span>
                  <span className="font-medium">{item.condition ?? "-"}</span>
                </div>
              </div>
            </section>
            <section className="rounded-2xl border border-gray-200 bg-white p-4">
              <h2 className="mb-2 text-sm font-semibold text-gray-900">
                내 메모
              </h2>
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-700">
                {item.memo?.trim() || "메모가 없습니다."}
              </p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};
export default CollectionDetailPage;
