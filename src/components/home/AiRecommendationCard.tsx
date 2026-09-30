import { useState, type FormEvent } from "react";

import type { NewRelease } from "../../apis/aladin";
import { getHighQualityCoverUrl } from "../../util/imageUtil";

type AiRecommendationCardProps = {
  albums: NewRelease[];
  onOpen: (initialMessage?: string) => void;
};

const fallbackAlbums = [
  { title: "비적응", artistName: "새소년" },
  { title: "0.1 flaws and all.", artistName: "wave to earth" },
  { title: "TEAM BABY", artistName: "검정치마" },
];

const coverGradients = [
  "from-[#52d5c8] to-[#153b66]",
  "from-[#a38cff] to-[#351064]",
  "from-[#ffdd3f] to-[#8c7100]",
];

const AiRecommendationCard = ({
  albums,
  onOpen,
}: AiRecommendationCardProps) => {
  const [message, setMessage] = useState("");
  const previews = Array.from({ length: 3 }, (_, index) => {
    const album = albums[index];
    const fallback = fallbackAlbums[index];

    return {
      id: album?.aladinItemId ?? `fallback-${index}`,
      title: album?.title ?? fallback.title,
      artistName: album?.artistName ?? fallback.artistName,
      coverImageUrl: album?.coverImageUrl,
    };
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    onOpen(trimmedMessage || undefined);
  };

  return (
    <section className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#fff9d9_0%,#fff0e4_100%)] p-5 shadow-sm ring-1 ring-black/[0.02]">
      <button
        type="button"
        onClick={() => onOpen()}
        className="block w-full cursor-pointer text-left"
        aria-label="AI 음반 추천 채팅 열기"
      >
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-lg bg-black px-2.5 py-1.5 font-bold text-[#ffdc39]">
            AI 추천
          </span>
          <span className="font-medium text-[#b45320]">
            매주 월요일 업데이트
          </span>
        </div>

        <h2 className="mt-5 text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-[#111827]">
          요즘 인디 록에 푹 빠지셨네요
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#625f5b]">
          내 컬렉션과 리뷰를 바탕으로 취향에 맞는 음반을 찾아드려요.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {previews.map((album, index) => (
            <article key={album.id} className="min-w-0">
              <div
                className={`aspect-square overflow-hidden rounded-xl bg-gradient-to-br ${coverGradients[index]}`}
              >
                {album.coverImageUrl && (
                  <img
                    src={getHighQualityCoverUrl(album.coverImageUrl)}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <p className="mt-2 truncate text-xs font-bold text-[#151923]">
                {album.title}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-[#737985]">
                {album.artistName}
              </p>
            </article>
          ))}
        </div>
      </button>

      <form
        onSubmit={handleSubmit}
        className="mt-5 flex h-13 items-center rounded-full bg-white p-1.5 pl-4 shadow-sm"
      >
        <label htmlFor="ai-recommendation-prompt" className="sr-only">
          AI에게 음반 추천 요청하기
        </label>
        <input
          id="ai-recommendation-prompt"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="어떤 음반 찾으세요? AI에게 물어보기"
          className="min-w-0 flex-1 bg-transparent text-sm text-[#171b24] placeholder:text-[#a8aeba]"
        />
        <button
          type="submit"
          aria-label="AI에게 질문 보내기"
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black text-xl text-white"
        >
          →
        </button>
      </form>
    </section>
  );
};

export default AiRecommendationCard;
