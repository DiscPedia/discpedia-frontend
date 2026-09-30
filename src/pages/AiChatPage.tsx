import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { sendAiChatMessage, type AiAlbumRecommendation } from "../apis/ai/chat";
import Logo from "../assets/common/Logo.svg";
import { getHighQualityCoverUrl } from "../util/imageUtil";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: AiAlbumRecommendation[];
  isError?: boolean;
};

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "안녕하세요! 찾고 있는 음반의 분위기, 예산, LP·CD 같은 조건을 알려주시면 취향에 맞게 추천해드릴게요.",
};

const suggestedPrompts = [
  "비 오는 날 듣기 좋은 국내 인디 LP",
  "5만원 이하 입문용 재즈 앨범",
  "내 컬렉션과 겹치지 않는 음반",
];

const createMessageId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

const formatPrice = (price?: number) =>
  typeof price === "number" ? `${price.toLocaleString("ko-KR")}원` : null;

type RecommendationListProps = {
  items: AiAlbumRecommendation[];
  onAlbumClick: (aladinItemId: number) => void;
};

const RecommendationList = ({
  items,
  onAlbumClick,
}: RecommendationListProps) => (
  <div className="mt-4 flex flex-col gap-2.5">
    {items.map((album, index) => {
      const price = formatPrice(album.price);
      const canOpenDetail = typeof album.aladinItemId === "number";

      return (
        <button
          type="button"
          key={`${album.aladinItemId ?? album.title}-${index}`}
          onClick={() => {
            if (typeof album.aladinItemId === "number") {
              onAlbumClick(album.aladinItemId);
            }
          }}
          disabled={!canOpenDetail}
          className="flex w-full items-center gap-3 rounded-2xl bg-[#f6f7f9] p-3 text-left disabled:cursor-default"
        >
          <div className="h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#83ded7,#1f3550)]">
            {album.coverImageUrl && (
              <img
                src={getHighQualityCoverUrl(album.coverImageUrl)}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#161b25]">
              {album.title}
            </p>
            <p className="mt-0.5 truncate text-xs text-[#707784]">
              {album.artistName}
            </p>
            {album.reason && (
              <p className="mt-1 line-clamp-2 text-xs leading-4 text-[#707784]">
                {album.reason}
              </p>
            )}
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#4667e8]">
              {price && <span>{price}</span>}
              {price && album.mediaType && <span>·</span>}
              {album.mediaType && <span>{album.mediaType}</span>}
            </div>
          </div>
          {canOpenDetail && (
            <span className="text-lg text-[#ff6d28]" aria-hidden="true">
              ›
            </span>
          )}
        </button>
      );
    })}
  </div>
);

const AiChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMessage =
    (
      location.state as { initialMessage?: string } | null
    )?.initialMessage?.trim() ?? "";
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string>();
  const [isSending, setIsSending] = useState(false);
  const initialMessageSent = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (rawMessage: string) => {
    const content = rawMessage.trim();
    if (!content || isSending) return;

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content,
    };
    const assistantId = createMessageId();

    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setIsSending(true);

    try {
      const response = await sendAiChatMessage(content, conversationId);

      setConversationId(response.conversationId);
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content: response.content,
                recommendations: response.recommendations,
              }
            : message,
        ),
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "AI와 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.";
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? { ...message, content: errorMessage, isError: true }
            : message,
        ),
      );
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!initialMessage || initialMessageSent.current) return;
    initialMessageSent.current = true;
    void sendMessage(initialMessage);
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const startNewConversation = () => {
    if (isSending) return;
    setConversationId(undefined);
    setMessages([welcomeMessage]);
    setInput("");
  };

  return (
    <main className="flex h-dvh w-full flex-col bg-[#f5f5f6] text-[#151923]">
      <header className="flex h-17 shrink-0 items-center justify-between border-b border-black/5 bg-white px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="flex h-10 w-10 cursor-pointer items-center justify-start text-[32px] font-light"
        >
          ←
        </button>
        <h1 className="text-lg font-extrabold">AI에게 물어보기</h1>
        <button
          type="button"
          onClick={startNewConversation}
          disabled={isSending}
          className="cursor-pointer text-sm font-semibold text-[#f26d2b] disabled:cursor-not-allowed disabled:text-[#b6bac1]"
        >
          새 대화
        </button>
      </header>

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
                    <RecommendationList
                      items={message.recommendations}
                      onAlbumClick={(aladinItemId) =>
                        navigate(`/detail/${aladinItemId}`)
                      }
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
                onClick={() => void sendMessage(prompt)}
                className="cursor-pointer rounded-full border border-[#dde0e5] bg-white px-3 py-2 text-xs text-[#4b5563] shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </section>

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 items-end gap-2 border-t border-black/5 bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3"
      >
        <label htmlFor="ai-chat-input" className="sr-only">
          AI에게 보낼 메시지
        </label>
        <textarea
          id="ai-chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              if (!isSending) void sendMessage(input);
            }
          }}
          rows={1}
          placeholder="원하는 분위기나 조건을 말해보세요"
          className="max-h-28 min-h-12 flex-1 resize-none rounded-[24px] bg-[#f3f4f6] px-4 py-3 text-sm leading-6 placeholder:text-[#a7aebb]"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          aria-label="메시지 보내기"
          className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black text-xl text-white disabled:cursor-not-allowed disabled:bg-[#c9cdd4]"
        >
          ↑
        </button>
      </form>
    </main>
  );
};

export default AiChatPage;
