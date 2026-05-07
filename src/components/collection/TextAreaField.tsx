const TextAreaField = (props: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const { label, placeholder, value, onChange } = props;
  return (
    <div className="px-4">
      <label className="text-sm font-semibold text-gray-900 block mb-2">
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full min-h-20 rounded-2xl border border-gray-200 px-4 py-3 text-sm resize-none"
      />
    </div>
  );
};

export default TextAreaField;
