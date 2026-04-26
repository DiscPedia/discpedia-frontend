import homeIcon from "../../assets/home.svg";
import searchIcon from "../../assets/search.svg";
import collectionIcon from "../../assets/collection.svg";
import myIcon from "../../assets/my.svg";

interface Props {
  activeMenu: number;
  handleMenuClick: (menuId: number) => void;
}

const BottomNav = ({ activeMenu, handleMenuClick }: Props) => {
  const menuDataState = [
    { id: 0, label: "홈", icon: homeIcon },
    { id: 1, label: "탐색", icon: searchIcon },
    { id: 2, label: "컬렉션", icon: collectionIcon },
    { id: 3, label: "My", icon: myIcon },
  ];

  return (
    <div className="w-full h-16 bg-white flex items-center justify-between">
      {menuDataState.map((menu) => {
        const isActive = activeMenu === menu.id;
        return (
          <button
            key={menu.id}
            type="button"
            onClick={() => handleMenuClick(menu.id)}
            className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive ? "text-black" : "text-gray-400"
            }`}
          >
            <img
              src={menu.icon}
              alt={menu.label}
              className={`w-5 h-5 transition-opacity ${
                isActive ? "opacity-100" : "opacity-50"
              }`}
            />
            <span
              className={`text-[10px] leading-none ${
                isActive ? "font-semibold" : "font-normal"
              }`}
            >
              {menu.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
