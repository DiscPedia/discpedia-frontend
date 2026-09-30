import type { RefObject } from "react";

import type { AiAlbumRecommendation } from "../../apis/ai/chat";
import Logo from "../../assets/common/Logo.svg";
import AiRecommendationList from "./AiRecommendationList";

export type AiChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: AiAlbumRecommendation[];
  isError?: boolean;
};

type AiChatMessagesProps = {
  messages: AiChatMessage[];
  suggestedPrompts: string[];
  bottomRef: RefObject<HTMLDivElement | null>;
  onPromptSelect: (prompt: string) => void;
  onAlbumClick: (aladinItemId: number) => void;
};

const AiChatMessages = ({
  messages,
  suggestedPrompts,
  bottomRef,
  onPromptSelect,
  onAlbumClick,
}: AiChatMessagesProps) => {
  return (
    <section
      className="min-h-0 flex-1 overflow-y-auto px-4 py-5"
      aria-label="AI 추천 대화"
    >
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`flex items-start gap-2.5 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="flex h-10 w-[72px] shrink-0 items-center justify-center rounded-full bg-white px-2 shadow-sm">
                <img src={Logo} alt="DiscPedia" className="h-auto w-full" />
              </div>
            )}
            <div
              className={`max-w-[calc(100%-82px)] rounded-[22px] px-4 py-3 text-sm leading-6 shadow-sm ${
                message.role === "user"
                  ? "rounded-tr-md bg-[#f3732a] text-white"
                  : message.isError
                    ? "rounded-tl-md bg-[#fff1ec] text-[#b7431d]"
                    : "rounded-tl-md bg-white text-[#1f2632]"
              }`}
            >
              {message.content ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <p className="animate-pulse text-[#9ba1aa]">
                  추천을 찾고 있어요…
                </p>
              )}
              {message.recommendations &&
                message.recommendations.length > 0 && (
                  <AiRecommendationList
                    items={message.recommendations}
                    onAlbumClick={onAlbumClick}
                  />
                )}
            </div>
          </article>
        ))}
      </div>

      {messages.length === 1 && (
        <div className="mt-4 flex flex-wrap justify-end gap-2 pl-12">
          {suggestedPrompts.map((prompt) => (
            <button
              type="button"
              key={prompt}
              onClick={() => onPromptSelect(prompt)}
              className="cursor-pointer rounded-full border border-[#dde0e5] bg-white px-3 py-2 text-xs text-[#4b5563] shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
      <div ref={bottomRef} />
    </section>
  );
};

export default AiChatMessages;
