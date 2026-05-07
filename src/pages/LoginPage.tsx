import displayIcon from "../assets/display.svg";
import kakaoIcon from "../assets/kakaoBanner.svg";
import googleIcon from "../assets/googleBanner.svg";
import { login } from "../apis/auth/ApiService";

const LoginPage = () => {
  return (
    <main className="flex h-dvh w-full flex-col items-center justify-between bg-[#f3f3f3] px-5 py-10">
      <section className="flex flex-1 flex-col items-center justify-center">
        <img
          src={displayIcon}
          alt="DiscPedia 로고"
          className="h-[64px] w-[64px]"
        />
        <h1 className="mt-3 text-[36px] font-bold leading-none text-black">
          DiscPedia
        </h1>
        <p className="mt-2 text-[14px] text-[#707070]">
          당신만의 음악 컬렉션을 채워보세요
        </p>
      </section>
      <section className="w-full max-w-[360px] space-y-3 pb-6">
        <button
          type="button"
          onClick={() => login("kakao")}
          className="flex h-[48px] w-full items-center justify-center gap-4 rounded-[12px] bg-[#FEE500]"
        >
          <img
            src={kakaoIcon}
            alt="카카오로 시작하기"
            className="h-[12px] w-[12px] max-w-[250px]"
          />
          <p>카카오로 시작하기</p>
        </button>
        <button
          type="button"
          onClick={() => login("google")}
          className="flex h-[48px] w-full items-center justify-center gap-4 rounded-[12px] bg-white border border-[#E6E6E6]"
        >
          <img
            src={googleIcon}
            alt="구글로 시작하기"
            className="h-[12px] w-[12px] max-w-[250px]"
          />
          <p>구글로 시작하기</p>
        </button>
      </section>
    </main>
  );
};

export default LoginPage;
