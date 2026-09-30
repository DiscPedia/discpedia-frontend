import type { AiAlbumRecommendation } from "../../apis/ai/chat";
import { getHighQualityCoverUrl } from "../../util/imageUtil";

type AiRecommendationListProps = {
  items: AiAlbumRecommendation[];
  onAlbumClick: (aladinItemId: number) => void;
};

const formatPrice = (price?: number) =>
  typeof price === "number" ? `${price.toLocaleString("ko-KR")}원` : null;

const AiRecommendationList = ({
  items,
  onAlbumClick,
}: AiRecommendationListProps) => {
  return (
    <div className="mt-4 flex flex-col gap-2.5">
      {items.map((album, index) => {
        const price = formatPrice(album.price);

        return (
          <button
            type="button"
            key={`${album.aladinItemId}-${index}`}
            onClick={() => onAlbumClick(album.aladinItemId)}
            className="flex w-full items-center gap-3 rounded-2xl bg-[#f6f7f9] p-3 text-left"
          >
            <div className="h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#83ded7,#1f3550)]">
              {album.coverImageUrl && (
                <img
                  src={getHighQualityCoverUrl(album.coverImageUrl)}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#161b25]">
                {album.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-[#707784]">
                {album.artistName}
              </p>
              {album.reason && (
                <p className="mt-1 line-clamp-2 text-xs leading-4 text-[#707784]">
                  {album.reason}
                </p>
              )}
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#4667e8]">
                {price && <span>{price}</span>}
                {price && album.mediaType && <span>·</span>}
                {album.mediaType && <span>{album.mediaType}</span>}
              </div>
            </div>
            <span className="text-lg text-[#ff6d28]" aria-hidden="true">
              ›
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default AiRecommendationList;
