import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { sendAiChatMessage } from "../apis/ai/chat";
import AiChatHeader from "../components/ai/AiChatHeader";
import AiChatInput from "../components/ai/AiChatInput";
import AiChatMessages, {
  type AiChatMessage,
} from "../components/ai/AiChatMessages";

const welcomeMessage: AiChatMessage = {
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

const AiChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMessage =
    (
      location.state as { initialMessage?: string } | null
    )?.initialMessage?.trim() ?? "";

  const [messages, setMessages] = useState<AiChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string>();
  const [isSending, setIsSending] = useState(false);
  const initialMessageSent = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (rawMessage: string) => {
    const content = rawMessage.trim();
    if (!content || isSending) return;

    const assistantId = createMessageId();
    setMessages((current) => [
      ...current,
      { id: createMessageId(), role: "user", content },
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

  const startNewConversation = () => {
    if (isSending) return;
    setConversationId(undefined);
    setMessages([welcomeMessage]);
    setInput("");
  };

  return (
    <main className="flex h-dvh w-full flex-col bg-[#f5f5f6] text-[#151923]">
      <AiChatHeader
        isSending={isSending}
        onBack={() => navigate(-1)}
        onNewChat={startNewConversation}
      />
      <AiChatMessages
        messages={messages}
        suggestedPrompts={suggestedPrompts}
        bottomRef={bottomRef}
        onPromptSelect={(prompt) => void sendMessage(prompt)}
        onAlbumClick={(aladinItemId) => navigate(`/detail/${aladinItemId}`)}
      />
      <AiChatInput
        value={input}
        isSending={isSending}
        onChange={setInput}
        onSend={() => void sendMessage(input)}
      />
    </main>
  );
};

export default AiChatPage;
