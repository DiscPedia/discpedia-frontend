import type { AladinGenre } from "../../apis/aladin";
import type { MediaType } from "../../apis/collection/collection";

const mediaTypeOptions: MediaType[] = ["LP", "CD"];
const genreOptions: { label: string; value: AladinGenre }[] = [
  { label: "인디/록", value: "INDIE_ROCK" },
  { label: "K-POP", value: "K_POP" },
  { label: "재즈", value: "JAZZ" },
  { label: "클래식", value: "CLASSIC" },
  { label: "팝", value: "POP" },
  { label: "힙합/R&B", value: "HIPHOP_RNB" },
  { label: "일렉트로닉", value: "ELECTRONIC" },
  { label: "OST", value: "OST" },
  { label: "뉴에이지", value: "NEW_AGE" },
  { label: "월드", value: "WORLD" },
  { label: "기타", value: "ETC" },
];

type Props = {
  mediaType?: MediaType;
  genre?: AladinGenre;
  onMediaTypeChange: (value?: MediaType) => void;
  onGenreChange: (value?: AladinGenre) => void;
};

const chipClassName = (active: boolean) =>
  `h-10 shrink-0 cursor-pointer rounded-full border px-5 text-sm font-medium transition-colors ${
    active
      ? "border-[#4C6FFF] bg-[#EEF3FF] text-[#2B5FFF]"
      : "border-gray-200 bg-white text-gray-700"
  }`;

const filterRowClassName =
  "flex w-full min-w-0 touch-pan-x gap-3 overflow-x-auto overscroll-x-contain scroll-smooth scrollbar-hide pb-1";

const AlbumFilterBar = ({
  mediaType,
  genre,
  onMediaTypeChange,
  onGenreChange,
}: Props) => {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">추천 필터</h2>
        <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
          <span aria-hidden="true">▽</span>
          <span>필터</span>
        </div>
      </div>
      <div className={filterRowClassName}>
        {mediaTypeOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() =>
              onMediaTypeChange(mediaType === option ? undefined : option)
            }
            className={chipClassName(mediaType === option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className={filterRowClassName}>
        {genreOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              onGenreChange(genre === option.value ? undefined : option.value)
            }
            className={chipClassName(genre === option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default AlbumFilterBar;
