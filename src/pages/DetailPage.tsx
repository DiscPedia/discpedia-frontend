import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAlbumDetail, type AlbumDetail } from "../apis/aladin";
import {
  createCollection,
  deleteWishlist,
  getCollectionItems,
} from "../apis/collection/collection";
import {
  getAlbumReviews,
  deleteReview,
  likeReview,
  unlikeReview,
  type ReviewItem,
  type ReviewSort,
} from "../apis/review";
import AlbumHero from "../components/detail/AlbumHero";
import BottomCTA from "../components/detail/BottomCTA";
import DetailHeader from "../components/detail/DetailHeader";
import PriceInfo from "../components/detail/PriceInfo";
import ProductInfo from "../components/detail/ProductInfo";
import ReviewList from "../components/detail/ReviewList";
import ReviewSummary from "../components/detail/ReviewSummary";
import SpecList from "../components/detail/SpecList";
import { getMe } from "../apis/mypage/mypage";

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
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistAlbumId, setWishlistAlbumId] = useState<number | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [reviewSort, setReviewSort] = useState<ReviewSort>("LATEST");

  useEffect(() => {
    if (invalidAlbumId) {
      return;
    }

    let ignore = false;

    const loadAlbum = async () => {
      try {
        setLoading(true);
        setError(null);

        const [albumData, wishlistData, meData] = await Promise.all([
          getAlbumDetail(aladinItemId),
          getCollectionItems({
            status: "WISHLIST",
            page: 0,
            size: 100,
          }),
          getMe(),
        ]);

        if (!ignore) {
          const wishlistItem = wishlistData.items.find(
            (item) => item.album.albumId === albumData.aladinItemId,
          );
          setAlbum(albumData);
          setIsWishlisted(Boolean(wishlistItem));
          setWishlistAlbumId(wishlistItem?.album.albumId ?? null);
          setCurrentUserId(meData.subject);
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

  useEffect(() => {
    if (invalidAlbumId) {
      return;
    }

    let ignore = false;

    const loadReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewsError(null);

        const reviewData = await getAlbumReviews(aladinItemId, {
          sort: reviewSort,
          page: 0,
          size: 20,
        });

        if (!ignore) {
          setReviews(reviewData.items);
        }
      } catch {
        if (!ignore) {
          setReviewsError("Failed to load reviews");
        }
      } finally {
        if (!ignore) {
          setReviewsLoading(false);
        }
      }
    };

    void loadReviews();

    return () => {
      ignore = true;
    };
  }, [aladinItemId, invalidAlbumId, reviewSort]);

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

  const handleOpenProductUrl = () => {
    if (!album?.productUrl) return;

    window.open(album.productUrl, "_blank", "noopener,noreferrer");
  };

  const handleToggleWishlist = async () => {
    if (!album || wishlistLoading) return;

    const ok = window.confirm(
      isWishlisted
        ? "위시리스트에서 삭제하시겠습니까?"
        : "위시리스트에 등록하시겠습니까?",
    );
    if (!ok) return;

    const previousIsWishlisted = isWishlisted;
    const previousWishlistAlbumId = wishlistAlbumId;

    try {
      setWishlistLoading(true);
      setIsWishlisted(!isWishlisted);

      if (isWishlisted) {
        await deleteWishlist(wishlistAlbumId ?? album.aladinItemId);
        setWishlistAlbumId(null);
      } else {
        await createCollection({
          aladinItemId: album.aladinItemId,
          status: "WISHLIST",
          condition: "NEW",
          purchasePrice: album.priceSales,
        });
        setWishlistAlbumId(album.aladinItemId);
      }
    } catch {
      setIsWishlisted(previousIsWishlisted);
      setWishlistAlbumId(previousWishlistAlbumId);
      window.alert(
        previousIsWishlisted
          ? "위시리스트 삭제에 실패했습니다."
          : "위시리스트 등록에 실패했습니다.",
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleToggleLike = async (review: ReviewItem) => {
    setReviews((prev) =>
      prev.map((item) =>
        item.reviewId === review.reviewId
          ? {
              ...item,
              likedByMe: !item.likedByMe,
              likeCount: item.likedByMe
                ? Math.max(0, item.likeCount - 1)
                : item.likeCount + 1,
            }
          : item,
      ),
    );

    try {
      const data = review.likedByMe
        ? await unlikeReview(review.reviewId)
        : await likeReview(review.reviewId);

      setReviews((prev) =>
        prev.map((item) =>
          item.reviewId === data.reviewId
            ? {
                ...item,
                likeCount: data.likeCount,
                likedByMe: data.likedByMe,
              }
            : item,
        ),
      );
    } catch {
      setReviews((prev) =>
        prev.map((item) => (item.reviewId === review.reviewId ? review : item)),
      );
      window.alert("좋아요 처리에 실패했습니다.");
    }
  };

  const handleEditReview = (review: ReviewItem) => {
    if (!album) return;

    navigate(`/review/edit/${review.reviewId}`, {
      state: {
        album,
        review,
        returnTo: `/detail/${album.aladinItemId}`,
      },
    });
  };

  const handleDeleteReview = async (review: ReviewItem) => {
    if (!album) return;

    const ok = window.confirm("리뷰를 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteReview(review.reviewId);
      setReviews((prev) =>
        prev.filter((item) => item.reviewId !== review.reviewId),
      );
      navigate(`/detail/${album.aladinItemId}`, { replace: true });
    } catch {
      window.alert("리뷰 삭제에 실패했습니다.");
    }
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
        <DetailHeader
          onBack={() => navigate(-1)}
          onLike={handleToggleWishlist}
          onShare={handleOpenProductUrl}
          liked={isWishlisted}
        />
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
      <ReviewList
        items={reviews}
        sort={reviewSort}
        currentUserId={currentUserId}
        loading={reviewsLoading}
        error={reviewsError}
        onSortChange={setReviewSort}
        onToggleLike={handleToggleLike}
        onEdit={handleEditReview}
        onDelete={handleDeleteReview}
      />
      <BottomCTA label="내 컬렉션에 추가하기" onClick={handleAddCollection} />
    </main>
  );
};

export default DetailPage;
