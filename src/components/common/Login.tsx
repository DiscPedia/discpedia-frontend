import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  completeOAuthLogin,
  type OAuthProvider,
} from "../../apis/auth/auth";

function getProviderFromPath(pathname: string): OAuthProvider | null {
  if (pathname.endsWith("/kakao")) return "kakao";
  if (pathname.endsWith("/google")) return "google";
  return null;
}

/** StrictMode remount에도 유지 (컴포넌트 밖 ref) */
const oauthHandledRef = { current: false };

/** 앱(React Native) 딥링크. 백엔드가 Origin으로 정한 웹 콜백을 앱으로 중계한다. */
const APP_CALLBACK_SCHEME = "discpedia://login/oauth2/code";

/**
 * 앱에서 시작한 로그인인지 판별한다.
 * 웹에서 시작하면 startOAuthLogin이 sessionStorage에 state를 넣는데,
 * 앱이 띄운 브라우저에는 그 값이 없다.
 */
const isAppLoginFlow = () => sessionStorage.getItem("oauth_state") === null;

/** 앱이 열리면 이 페이지는 숨겨진다. 안 열리면 웹에서 그대로 로그인한다. */
const waitForAppSwitch = (ms: number) =>
  new Promise<boolean>((resolve) => {
    window.setTimeout(() => resolve(document.visibilityState === "hidden"), ms);
  });

const Login = () => {
  const location = useLocation();
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (oauthHandledRef.current) {
      return;
    }
    oauthHandledRef.current = true;

    async function run() {
      const params = new URLSearchParams(location.search);

      const legacyToken =
        params.get("token") ||
        params.get("accessToken") ||
        params.get("jwt");

      if (legacyToken) {
        localStorage.setItem("accessToken", legacyToken);
        if (mountedRef.current) setDone(true);
        return;
      }

      const provider = getProviderFromPath(location.pathname);
      const code = params.get("code");
      const state = params.get("state");

      if (!provider || !code || !state) {
        oauthHandledRef.current = false;
        if (mountedRef.current) setFailed(true);
        return;
      }

      if (isAppLoginFlow()) {
        window.location.href = `${APP_CALLBACK_SCHEME}/${provider}?code=${encodeURIComponent(
          code,
        )}&state=${encodeURIComponent(state)}`;

        if (await waitForAppSwitch(1500)) {
          return;
        }
      }

      try {
        await completeOAuthLogin(provider, code, state);
        if (mountedRef.current) setDone(true);
      } catch (e) {
        console.error(e);
        localStorage.removeItem("accessToken");
        oauthHandledRef.current = false;
        if (mountedRef.current) setFailed(true);
      }
    }

    void run();

    return () => {
      mountedRef.current = false;
    };
  }, [location]);

  if (failed) return <Navigate to="/login" replace />;
  if (done) return <Navigate to="/recommand" replace />;

  return (
    <main className="flex h-dvh items-center justify-center text-sm text-[#707070]">
      로그인 처리 중...
    </main>
  );
};

export default Login;