import { useNavigate } from "react-router-dom";
import Logo from "../../assets/common/Logo.svg";
import AlarmIcon from "../../assets/alarm.svg";
import SettingIcon from "../../assets/setting.svg";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-16 w-full items-center justify-between bg-white px-2">
      <img src={Logo} alt="DiscPedia Logo" />
      <div className="flex h-full w-full items-center justify-between">
        <div className="flex items-center pl-4">
          <button
            type="button"
            onClick={() => navigate("/home", { replace: true })}
          >
            <h1 className="font-['Raleway'] text-[38px] leading-none tracking-tight">
              <span className="text-[#FFD700] font-light">Disc</span>
              <span className="text-[#111111] font-light">Pedia</span>
            </h1>
          </button>
        </div>
        <div className="flex items-center gap-2 pr-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl hover:bg-gray-100"
            aria-label="notification"
          >
            {"\u{1F514}"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/myPage")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl hover:bg-gray-100"
            aria-label="settings"
          >
            {"\u2699\uFE0F"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
