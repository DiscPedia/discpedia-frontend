interface Props {
  label: string;
  onSubmit: () => void;
}

const SubmitBar = ({ label, onSubmit }: Props) => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-160 px-4 pb-4 bg-transparent">
      <button
        type="button"
        onClick={onSubmit}
        className="w-full h-12 rounded-2xl bg-black text-white text-sm font-semibold shadow-lg"
      >
        {label}
      </button>
    </div>
  );
};

export default SubmitBar;
