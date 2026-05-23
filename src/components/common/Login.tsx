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