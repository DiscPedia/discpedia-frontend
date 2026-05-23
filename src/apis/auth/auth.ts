import { call } from "./ApiService";
import type { ApiResponse } from "../commontype";
export type OAuthProvider = "kakao" | "google";

export type OAuthAuthorizeResponse = {
  provider: string;
  authorizationUrl: string;
  state: string;
};
export type AccessToken = {
  token: string;
  tokenType: string;
  expiresIn: number;
};
export type OAuthLoginResponse = {
  accessToken: AccessToken;
  userId: string;
  nickname: string;
  provider: string;
  onboardingCompleted: boolean;
};

const OAUTH_STATE_KEY = "oauth_state";

export async function startOAuthLogin(provider: OAuthProvider) {
  const res = (await call(
    `/api/v1/auth/oauth/${provider}/authorize`,
    "GET",
    undefined,
    { skipAuth: true }
  )) as ApiResponse<OAuthAuthorizeResponse>;
  sessionStorage.setItem(OAUTH_STATE_KEY, res.data.state);
  window.location.href = res.data.authorizationUrl;
} //로그인 버튼 클릭 시 state를 세션에 저장하고 authorizationUrl로 이동

/** OAuth 콜백: code + state로 JWT 발급 */
export async function completeOAuthLogin(
    provider: OAuthProvider,
    code: string,
    state: string,
  ) {
    const savedState = sessionStorage.getItem(OAUTH_STATE_KEY);
    if (savedState && savedState !== state) {
      throw new Error("OAuth state mismatch");
    }
    const res = (await call(`/api/v1/auth/oauth/${provider}/login`, "POST", {
      code,
      state,
    }, { skipAuth: true })) as ApiResponse<OAuthLoginResponse>;
    localStorage.setItem("accessToken", res.data.accessToken.token);
    sessionStorage.removeItem(OAUTH_STATE_KEY);
    return res.data;
  }