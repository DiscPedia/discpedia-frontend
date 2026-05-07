const InputField = (props: {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const { label, placeholder, type = "text", value, onChange } = props;
  return (
    <div className="px-4">
      <label className="text-sm font-semibold text-gray-900 block mb-2">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full h-12 rounded-2xl border border-gray-200 px-4 text-sm"
      />
    </div>
  );
};

export default InputField;
