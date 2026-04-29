import { Navigate } from "react-router-dom";

const Login = () => {
  const getUrlParameters = (name: string) => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    return params.get(name);
  };

  const token = getUrlParameters("token");

  if (token) {
    localStorage.setItem("accessToken", token);

    return <Navigate to="/home" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default Login;