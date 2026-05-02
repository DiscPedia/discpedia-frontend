let backendhost;

const hostname = window && window.location && window.location.hostname;
if (hostname === "localhost") {
    backendhost = "http://localhost:8080";
}
else{
    backendhost ="";//실제 배포된 주소 사용
}

export const API_BASE_URL = `${backendhost}`;

//환경이 로컬이라면 백엔드 서버도 로컬에 있다가정 8080주소 사용
// const backendhost =
//   import.meta.env.VITE_API_BASE_URL ||
//   (window.location.hostname === "localhost"
//     ? "http://localhost:8080"
//     : "");

// export const API_BASE_URL = backendhost;