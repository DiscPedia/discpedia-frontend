interface Props {
  releaseDate: string;
  originalPrice: string;
  price: string;
}

const PriceInfo = ({ releaseDate, originalPrice, price }: Props) => {
  return (
    <section className="bg-white px-5 pb-5">
      <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4">
        <div>
          <p className="text-xs text-gray-400">발매일</p>
          <p className="text-sm font-semibold text-gray-900 mt-1">{releaseDate}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">정가</p>
          <div className="flex items-center justify-end gap-2 mt-1">
            <span className="text-xs text-gray-300 line-through">
              {originalPrice}
            </span>
            <span className="text-lg font-semibold text-gray-900">{price}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceInfo;
