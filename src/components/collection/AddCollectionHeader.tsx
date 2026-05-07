interface Props {
  title: string;
  onBack: () => void;
}

const AddCollectionHeader = ({ title, onBack }: Props) => {
  return (
    <header className="flex items-center gap-3 px-4 pt-4">
      <button
        type="button"
        onClick={onBack}
        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
      >
        <span className="text-lg">←</span>
      </button>
      <h1 className="text-base font-semibold text-gray-900 flex-1 text-center">
        {title}
      </h1>
      <div className="w-9" />
    </header>
  );
};

export default AddCollectionHeader;
