interface Props {
  status: string;
  format: string;
  genre: string;
  title: string;
  artist: string;
}

const ProductInfo = ({ status, format, genre, title, artist }: Props) => {
  return (
    <section className="bg-white rounded-t-3xl px-5 pt-5 pb-4 -mt-6 relative z-10">
      <div className="flex items-center gap-2 text-[10px] font-semibold">
        <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full">
          {status}
        </span>
        <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
          {format}
        </span>
        <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
          {genre}
        </span>
      </div>
      <h1 className="text-xl font-semibold text-gray-900 mt-3">{title}</h1>
      <p className="text-sm text-gray-500 mt-1">{artist}</p>
    </section>
  );
};

export default ProductInfo;
