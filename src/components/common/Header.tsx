import { useNavigate } from "react-router-dom";
import Logo from "../../assets/common/Logo.svg";
import AlarmIcon from "../../assets/alarm.svg";
import SettingIcon from "../../assets/setting.svg";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-16 bg-white flex items-center justify-between px-2">
      <img src={Logo} alt="DiscPedia Logo" />
      <div className="w-full h-full flex items-center justify-between">
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
          <img src={AlarmIcon} alt="알림" />
          <img src={SettingIcon} alt="설정" />
        </div>
      </div>
    </div>
  );
};

export default Header;
