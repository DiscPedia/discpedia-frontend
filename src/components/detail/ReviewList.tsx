interface ReviewItem {
  id: number;
  name: string;
  score: number;
  content: string;
  date: string;
  likes: number;
}

interface Props {
  items: ReviewItem[];
}

const ReviewList = ({ items }: Props) => {
  return (
    <section className="bg-white px-5 pb-24">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-900">최신순</span>
        <span className="text-xs text-gray-400">별점순</span>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="border border-gray-100 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                  {item.name[0]}
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {item.name}
                </span>
              </div>
              <div className="text-xs text-yellow-500">★ {item.score}</div>
            </div>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              {item.content}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <span>{item.date}</span>
              <span>👍 {item.likes}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ReviewList;
