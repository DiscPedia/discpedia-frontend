interface Props {
  items: string[];
}

const SpecList = ({ items }: Props) => {
  return (
    <section className="bg-white px-5 pb-5">
      <div className="bg-gray-50 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
            i
          </span>
          <span>앨범 사양</span>
        </div>
        <ul className="mt-3 space-y-2 text-xs text-gray-600">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SpecList;
