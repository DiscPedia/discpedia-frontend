import type { FormEvent, KeyboardEvent } from "react";

type AiChatInputProps = {
  value: string;
  isSending: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
};

const AiChatInput = ({
  value,
  isSending,
  onChange,
  onSend,
}: AiChatInputProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSend();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isSending) onSend();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 items-end gap-2 border-t border-black/5 bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3"
    >
      <label htmlFor="ai-chat-input" className="sr-only">
        AI에게 보낼 메시지
      </label>
      <textarea
        id="ai-chat-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="원하는 음반을 말해보세요"
        className="max-h-28 min-h-12 flex-1 resize-none rounded-[24px] bg-[#f3f4f6] px-4 py-3 text-sm leading-6 placeholder:text-[#a7aebb]"
      />
      <button
        type="submit"
        disabled={!value.trim() || isSending}
        aria-label="메시지 보내기"
        className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black text-xl text-white disabled:cursor-not-allowed disabled:bg-[#c9cdd4]"
      >
        ↑
      </button>
    </form>
  );
};

export default AiChatInput;
