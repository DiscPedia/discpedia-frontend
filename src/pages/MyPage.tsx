import defaultProfile from "../assets/defaultProfile.svg";
import collectionIcon from "../assets/collection.svg";
import likeIcon from "../assets/like.svg";
import reviewIcon from "../assets/review.svg";
import rightChevronIcon from "../assets/rightChev.svg";

const MyPage = () => {
  return (
    <div className="w-full flex-1 overflow-y-auto bg-[#f5f5f5] px-4 pb-6 pt-2">
      {/* 프로필 카드 */}
      <section className="mb-3 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-200/50">
        <img
          src={defaultProfile}
          alt=""
          className="h-14 w-14 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900">준서초이</p>
          <p className="text-sm text-gray-500">내 프로필을 확인하세요</p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-800 shadow-sm shadow-gray-200/50"
        >
          로그아웃
        </button>
      </section>
      {/* 통계 */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        {[
          { icon: collectionIcon, n: 25, label: "컬렉션" },
          { icon: likeIcon, n: 5, label: "위시리스트" },
          { icon: reviewIcon, n: 12, label: "작성 리뷰" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white py-4 shadow-sm shadow-gray-200/50"
          >
            <img src={item.icon} alt="" className="mb-2 h-8 w-8" />
            <p className="text-lg font-bold text-gray-900">{item.n}</p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
      {/* 메뉴 */}
      <nav className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm shadow-gray-200/50">
        {["내 리뷰 모아보기", "관심 아티스트 관리", "포트폴리오 변동 내역"].map(
          (title, i, arr) => (
            <button
              key={title}
              type="button"
              className={`flex w-full items-center justify-between px-4 py-4 text-left text-gray-900 ${
                i < arr.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span>{title}</span>
              <img
                src={rightChevronIcon}
                alt=""
                className="h-4 w-4 opacity-40"
              />
            </button>
          ),
        )}
      </nav>
    </div>
  );
};

export default MyPage;
