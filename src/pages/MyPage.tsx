import { useState, useEffect, useMemo } from "react";
import defaultProfile from "../assets/defaultProfile.svg";
import collectionIcon from "../assets/collection.svg";
import likeIcon from "../assets/like.svg";
import reviewIcon from "../assets/review.svg";
import rightChevronIcon from "../assets/rightChev.svg";
import { useNavigate } from "react-router-dom";
import { logout } from "../apis/auth/auth";

import {
  getMe,
  getMyPageStats,
  type Me,
  type MyPageStats,
} from "../apis/mypage/mypage";

const MyPage = () => {
  const [me, setMe] = useState<Me | null>(null);
  const [stats, setStats] = useState<MyPageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const displayName =
    me?.nickname?.trim() ||
    me?.userName?.trim() ||
    me?.username?.trim() ||
    me?.name?.trim() ||
    "사용자";

  const handleLogout = async () => {
    const ok = window.confirm("로그아웃 하시겠습니까?");
    if (!ok) return;
    await logout();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        const [meData, statsData] = await Promise.all([
          getMe(),
          getMyPageStats(),
        ]);
        if (!cancelled) {
          setMe(meData);
          setStats(statsData);
        }
      } catch {
        if (!cancelled) {
          setErrorMessage("마이페이지 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const statItems = useMemo(
    () => [
      {
        icon: collectionIcon,
        n: stats?.collectionCount ?? 0,
        label: "컬렉션",
        path: "/collection",
      },
      {
        icon: likeIcon,
        n: stats?.wishlistCount ?? 0,
        label: "위시리스트",
        path: "/collection?tab=WISHLIST",
      },
      {
        icon: reviewIcon,
        n: stats?.reviewCount ?? 0,
        label: "작성 리뷰",
        path: "/myReview",
      },
    ],
    [stats],
  );

  if (loading) {
    return (
      <div className="w-full flex-1 overflow-y-auto scrollbar-hide bg-[#f5f5f5] px-4 pb-6 pt-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500 shadow-sm shadow-gray-200/50">
          마이페이지 정보를 불러오는 중...
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="w-full flex-1 overflow-y-auto scrollbar-hide bg-[#f5f5f5] px-4 pb-6 pt-2">
        <div className="rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-600 shadow-sm shadow-gray-200/50">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 overflow-y-auto scrollbar-hide bg-[#f5f5f5] px-4 pb-6 pt-2">
      {/* 프로필 카드 */}
      <section className="mb-3 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-200/50">
        <img
          src={defaultProfile}
          alt="프로필"
          className="h-14 w-14 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900">{displayName}</p>
          <p className="text-sm text-gray-500">{me?.email ?? ""}</p>
          {me?.provider ? (
            <p className="text-xs text-gray-400">로그인: {me.provider}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-800 shadow-sm shadow-gray-200/50"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </section>
      {/* 통계 */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        {statItems.map((item) => (
          <button
            type="button"
            key={item.label}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white py-4 shadow-sm shadow-gray-200/50"
          >
            <img src={item.icon} alt="" className="mb-2 h-8 w-8" />
            <p className="text-lg font-bold text-gray-900">{item.n}</p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </button>
        ))}
      </div>
      {/* 메뉴 */}
      <nav className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm shadow-gray-200/50">
        {[
          { title: "내 리뷰 모아보기", path: "/myReview" },
          { title: "관심 아티스트 관리", path: "/recommand" },
          { title: "포트폴리오 변동 내역", path: "/portfolio" },
        ].map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.path)}
            type="button"
            className="flex w-full items-center justify-between px-4 py-4 text-left text-gray-900 border-b border-gray-100"
          >
            <span>{item.title}</span>
            <img src={rightChevronIcon} alt="" className="h-4 w-4 opacity-40" />
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MyPage;
