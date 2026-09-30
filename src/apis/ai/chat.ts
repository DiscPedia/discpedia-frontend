import type { ApiResponse } from "../commontype";
import { call } from "../auth/ApiService";

export type AiAlbumRecommendation = {
  aladinItemId: number;
  title: string;
  artistName: string;
  reason?: string;
  mediaType?: string;
  price?: number;
  coverImageUrl?: string;
};

export type AiChatResponse = {
  conversationId: string;
  content: string;
  recommendations: AiAlbumRecommendation[];
};

// TODO: 백엔드 Swagger 명세가 나오면 실제 경로와 필드명을 맞춥니다.
const AI_CHAT_API = "/api/v1/ai/chat";

export const sendAiChatMessage = async (
  message: string,
  conversationId?: string,
): Promise<AiChatResponse> => {
  const response = (await call(AI_CHAT_API, "POST", {
    message,
    ...(conversationId ? { conversationId } : {}),
  })) as ApiResponse<AiChatResponse>;

  return response.data;
};
