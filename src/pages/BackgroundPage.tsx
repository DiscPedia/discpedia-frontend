import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BottomNav from "../components/common/BottomNav";
import Header from "../components/common/Header";

const pathMap: Record<number, string> = {
  0: "/home",
  1: "/search",
  2: "/collection",
  3: "/myPage",
}; //

const getActiveMenu = (pathname: string) => {
    if (pathname.startsWith("/home")) return 0;
    if (pathname.startsWith("/search")) return 1;
    if (pathname.startsWith("/collection")) return 2;
    if (pathname.startsWith("/myPage")) return 3;
    return 0;
  };

const BackgroundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeMenu = getActiveMenu(location.pathname);

  const handleMenuClick = (menuId: number) => {
    const nextPath = pathMap[menuId];
    if (nextPath && nextPath !== location.pathname) {
      navigate(nextPath);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-between">
      <Header />
      <Outlet />
      <BottomNav activeMenu={activeMenu} handleMenuClick={handleMenuClick} />
    </div>
  );
};

export default BackgroundPage;
