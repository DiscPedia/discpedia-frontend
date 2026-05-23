import { useEffect, useState } from "react";
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

const Login = () => {
  const location = useLocation();
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const params = new URLSearchParams(location.search);

      // 예전 방식(쿼리에 token이 바로 오는 경우) 호환
      const legacyToken =
        params.get("token") ||
        params.get("accessToken") ||
        params.get("jwt");

      if (legacyToken) {
        localStorage.setItem("accessToken", legacyToken);
        if (!cancelled) setDone(true);
        return;
      }

      const provider = getProviderFromPath(location.pathname);
      const code = params.get("code");
      const state = params.get("state");

      if (!provider || !code || !state) {
        if (!cancelled) setFailed(true);
        return;
      }

      try {
        await completeOAuthLogin(provider, code, state);
        if (!cancelled) setDone(true);
      } catch (e) {
        console.error(e);
        if (!cancelled) setFailed(true);
      }
    }

    run();
    return () => {
      cancelled = true;
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