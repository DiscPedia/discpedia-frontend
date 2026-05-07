const conditions = ["새제품", "미개봉", "중고"] as const;
export type ConditionType = (typeof conditions)[number];

const ConditionSelector = (props: {
  value: ConditionType;
  onChange: (value: ConditionType) => void;
}) => {
  const { value, onChange } = props;
  return (
    <section className="px-4">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">컨디션 기록</h2>
      <div className="grid grid-cols-3 gap-3">
        {conditions.map((condition) => {
          const isActive = value === condition;
          return (
            <button
              key={condition}
              type="button"
              onClick={() => onChange(condition)}
              className={`h-11 rounded-2xl text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {condition}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ConditionSelector;
