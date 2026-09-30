type AiChatHeaderProps = {
  isSending: boolean;
  onBack: () => void;
  onNewChat: () => void;
};

const AiChatHeader = ({ isSending, onBack, onNewChat }: AiChatHeaderProps) => {
  return (
    <header className="flex h-17 shrink-0 items-center justify-between border-b border-black/5 bg-white px-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로 가기"
        className="flex h-10 w-10 cursor-pointer items-center justify-start text-[32px] font-light"
      >
        ←
      </button>
      <h1 className="text-lg font-extrabold">AI에게 물어보기</h1>
      <button
        type="button"
        onClick={onNewChat}
        disabled={isSending}
        className="cursor-pointer text-sm font-semibold text-[#f26d2b] disabled:cursor-not-allowed disabled:text-[#b6bac1]"
      >
        새 대화
      </button>
    </header>
  );
};

export default AiChatHeader;
