import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAlbumDetail, type AlbumDetail } from "../apis/aladin";
import AlbumHero from "../components/detail/AlbumHero";
import BottomCTA from "../components/detail/BottomCTA";
import DetailHeader from "../components/detail/DetailHeader";
import PriceInfo from "../components/detail/PriceInfo";
import ProductInfo from "../components/detail/ProductInfo";
import ReviewList from "../components/detail/ReviewList";
import ReviewSummary from "../components/detail/ReviewSummary";
import SpecList from "../components/detail/SpecList";

const formatDate = (value: string) => value.replaceAll("-", ".");

const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

const toReviewDistribution = (
  ratingDistribution: Record<string, number> = {},
) => {
  const total = Object.values(ratingDistribution).reduce(
    (sum, count) => sum + count,
    0,
  );

  return [5, 4, 3, 2, 1].map((score) => {
    const count = ratingDistribution[String(score)] ?? 0;
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;

    return { score, percent };
  });
};

const DetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const aladinItemId = Number(id);
  const invalidAlbumId = !Number.isFinite(aladinItemId);
  const [album, setAlbum] = useState<AlbumDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (invalidAlbumId) {
      return;
    }

    let ignore = false;

    const loadAlbum = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAlbumDetail(aladinItemId);

        if (!ignore) {
          setAlbum(data);
        }
      } catch {
        if (!ignore) {
          setError("Failed to load album detail");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadAlbum();

    return () => {
      ignore = true;
    };
  }, [aladinItemId, invalidAlbumId]);

  const specItems = useMemo(() => {
    if (!album) return [];

    return [
      album.description,
      album.publisher ? `출판사: ${album.publisher}` : undefined,
      album.categoryName ? `카테고리: ${album.categoryName}` : undefined,
      album.isbn13 ? `ISBN13: ${album.isbn13}` : undefined,
      album.stockStatus ? `재고 상태: ${album.stockStatus}` : undefined,
    ].filter((item): item is string => Boolean(item));
  }, [album]);

  const reviews = [
    {
      id: 1,
      name: "음악매니아",
      score: 5,
      content: "응원이 너무 좋네요, 역시 명반입니다. 꼭 들어보세요!",
      date: "2026.04.05",
    },
    {
      id: 2,
      name: "바이닐러버",
      score: 4,
      content: "패키징이 아쉽지만 음악은 완벽합니다.",
      date: "2026.04.02",
    },
    {
      id: 3,
      name: "뉴비",
      score: 4.5,
      content: "처음 입문하기 좋은 앨범인 것 같아요. 추천합니다.",
      date: "2026.03.28",
    },
  ];

  const handleAddCollection = () => {
    if (!album) return;

    navigate(`/collection/add/${album.aladinItemId}`, {
      state: {
        record: {
          id: album.aladinItemId,
          label: "NEW",
          format: album.mediaType,
          title: album.title,
          subtitle: album.artistName,
          date: formatDate(album.releaseDate),
          coverImageUrl: album.coverImageUrl,
        },
      },
    });
  };

  const handleWriteReview = () => {
    if (!album) return;

    navigate(`/review/write/${album.aladinItemId}`, {
      state: {
        album,
      },
    });
  };

  if (invalidAlbumId || error) {
    return (
      <main className="flex-1 w-full bg-[#F5F5F5]">
        <DetailHeader onBack={() => navigate(-1)} />
        <div className="px-5 pt-20 text-center text-sm text-gray-500">
          음반 상세 정보를 불러오지 못했습니다.
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex-1 w-full bg-[#F5F5F5] pb-24">
        <div className="relative">
          <section className="relative w-full h-70 bg-linear-to-b from-[#DCD0F1] to-[#F4F1FA] flex items-center justify-center">
            <div className="w-37.5 h-37.5 rounded-2xl bg-white/60 shadow-xl animate-pulse" />
          </section>
          <DetailHeader onBack={() => navigate(-1)} />
        </div>
        <section className="bg-white rounded-t-3xl px-5 pt-5 pb-5 -mt-6 relative z-10">
          <div className="h-4 w-32 rounded bg-gray-100 animate-pulse" />
          <div className="h-6 w-56 rounded bg-gray-100 animate-pulse mt-4" />
          <div className="h-4 w-28 rounded bg-gray-100 animate-pulse mt-3" />
        </section>
      </main>
    );
  }

  if (!album) {
    return (
      <main className="flex-1 w-full bg-[#F5F5F5]">
        <DetailHeader onBack={() => navigate(-1)} />
        <div className="px-5 pt-20 text-center text-sm text-gray-500">
          음반 상세 정보를 불러오지 못했습니다.
        </div>
      </main>
    );
  }

  const reviewSummary = album.reviewSummary;
  const rating = reviewSummary?.averageRating ?? 0;
  const ratingCount = reviewSummary?.ratingCount ?? 0;
  const reviewDistribution = toReviewDistribution(
    reviewSummary?.ratingDistribution,
  );

  return (
    <main className="flex-1 w-full bg-[#F5F5F5] pb-24">
      <div className="relative">
        <AlbumHero coverAlt={album.title} coverImageUrl={album.coverImageUrl} />
        <DetailHeader onBack={() => navigate(-1)} />
      </div>

      <ProductInfo
        status={album.stockStatus || "NEW"}
        format={album.mediaType}
        genre={album.categoryName}
        title={album.title}
        artist={album.artistName}
      />
      <PriceInfo
        releaseDate={formatDate(album.releaseDate)}
        originalPrice={formatWon(album.priceStandard)}
        price={formatWon(album.priceSales)}
      />
      <SpecList items={specItems} />
      <ReviewSummary
        rating={rating}
        totalReviews={ratingCount}
        distribution={reviewDistribution}
        onWriteReview={handleWriteReview}
      />
      <ReviewList items={reviews} />
      <BottomCTA label="내 컬렉션에 추가하기" onClick={handleAddCollection} />
    </main>
  );
};

export default DetailPage;
