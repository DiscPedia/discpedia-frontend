import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-16 bg-white flex items-center justify-between px-2">
      <div className="w-full h-full flex items-center justify-between">
        <div className="flex items-center pl-4">
          <button
            type="button"
            onClick={() => navigate("/home", { replace: true })}
          >
            <h1 className="font-['Cormorant_Garamond'] text-[38px] font-bold leading-none">
              <span className="text-[#D57200] italic">Disc </span>
              <span className="text-[#111111] not-italic">Pedia</span>
            </h1>
          </button> 
        </div>
        <div className="flex items-center gap-2 pr-2">
          <p>알림</p>
          <p>설정</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
