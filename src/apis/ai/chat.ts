import { API_BASE_URL } from "../auth/api-config";

export type AiAlbumRecommendation = {
  aladinItemId?: number;
  title: string;
  artistName: string;
  reason?: string;
  mediaType?: string;
  price?: number;
  coverImageUrl?: string;
};

export type AiChatResponse = {
  conversationId?: string;
  content: string;
  recommendations: AiAlbumRecommendation[];
};

type SendAiChatOptions = {
  conversationId?: string;
  signal?: AbortSignal;
  onDelta?: (content: string) => void;
};

const configuredEndpoint = import.meta.env.VITE_AI_CHAT_ENDPOINT as
  | string
  | undefined;
const AI_CHAT_ENDPOINT = configuredEndpoint || "/api/v1/ai/chat";

const toRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;

const getString = (source: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) {
    if (typeof source[key] === "string") return source[key] as string;
  }
  return undefined;
};

const getNumber = (source: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) {
    if (typeof source[key] === "number") return source[key] as number;
  }
  return undefined;
};

const normalizeRecommendation = (
  value: unknown,
): AiAlbumRecommendation | null => {
  const item = toRecord(value);
  if (!item) return null;

  const title = getString(item, "title", "albumTitle", "album_title");
  if (!title) return null;

  return {
    aladinItemId: getNumber(
      item,
      "aladinItemId",
      "aladin_item_id",
      "albumId",
      "album_id",
    ),
    title,
    artistName:
      getString(item, "artistName", "artist_name", "artist") ??
      "아티스트 정보 없음",
    reason: getString(item, "reason", "recommendationReason", "description"),
    mediaType: getString(item, "mediaType", "media_type", "format"),
    price: getNumber(item, "price", "priceSales", "usedPrice"),
    coverImageUrl: getString(
      item,
      "coverImageUrl",
      "cover_image_url",
      "cover",
      "imageUrl",
    ),
  };
};

const normalizeResponse = (value: unknown): AiChatResponse => {
  const root = toRecord(value) ?? {};
  const data = toRecord(root.data) ?? root;
  const nestedMessage = toRecord(data.message);
  const recommendationSource =
    data.recommendations ?? data.albums ?? data.items ?? [];

  const content =
    getString(data, "answer", "reply", "content", "assistantMessage") ??
    (nestedMessage ? getString(nestedMessage, "content", "text") : undefined) ??
    "";

  return {
    conversationId: getString(
      data,
      "conversationId",
      "conversation_id",
      "sessionId",
      "session_id",
    ),
    content,
    recommendations: Array.isArray(recommendationSource)
      ? recommendationSource
          .map(normalizeRecommendation)
          .filter((item): item is AiAlbumRecommendation => item !== null)
      : [],
  };
};

const getRequestUrl = () =>
  /^https?:\/\//.test(AI_CHAT_ENDPOINT)
    ? AI_CHAT_ENDPOINT
    : `${API_BASE_URL}${AI_CHAT_ENDPOINT.startsWith("/") ? "" : "/"}${AI_CHAT_ENDPOINT}`;

const readErrorMessage = async (response: Response) => {
  try {
    const body = (await response.json()) as unknown;
    const record = toRecord(body);
    return record ? getString(record, "message", "error") : undefined;
  } catch {
    return undefined;
  }
};

const readEventStream = async (
  response: Response,
  onDelta?: (content: string) => void,
): Promise<AiChatResponse> => {
  if (!response.body) throw new Error("AI 응답 스트림을 읽을 수 없습니다.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";
  let conversationId: string | undefined;
  let recommendations: AiAlbumRecommendation[] = [];

  const consumeEvent = (event: string) => {
    const data = event
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");

    if (!data || data === "[DONE]") return;

    try {
      const parsed = JSON.parse(data) as unknown;
      const normalized = normalizeResponse(parsed);
      const record = toRecord(parsed);
      const delta =
        (record && getString(record, "delta", "token", "text")) ||
        normalized.content;

      if (delta) {
        content += delta;
        onDelta?.(content);
      }
      conversationId = normalized.conversationId ?? conversationId;
      if (normalized.recommendations.length > 0) {
        recommendations = normalized.recommendations;
      }
    } catch {
      content += data;
      onDelta?.(content);
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done }).replaceAll("\r\n", "\n");

    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";
    events.forEach(consumeEvent);

    if (done) break;
  }

  if (buffer.trim()) consumeEvent(buffer);

  return { conversationId, content, recommendations };
};

export const sendAiChatMessage = async (
  message: string,
  options: SendAiChatOptions = {},
): Promise<AiChatResponse> => {
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(getRequestUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({
      message,
      ...(options.conversationId
        ? { conversationId: options.conversationId }
        : {}),
    }),
    signal: options.signal,
  });

  if (!response.ok) {
    const serverMessage = await readErrorMessage(response);
    throw new Error(
      serverMessage || `AI 요청에 실패했습니다. (${response.status})`,
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("text/event-stream")) {
    return readEventStream(response, options.onDelta);
  }

  const result = normalizeResponse((await response.json()) as unknown);
  if (!result.content) {
    throw new Error("AI 응답 내용이 비어 있습니다.");
  }
  options.onDelta?.(result.content);
  return result;
};
