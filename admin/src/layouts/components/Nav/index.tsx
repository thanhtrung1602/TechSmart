import { Link, useLocation } from "react-router-dom";
import { FcBullish } from "react-icons/fc";
import {
  DASHBOARD_SIDEBAR_LINKS,
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
} from "~/lib/consts/navigation";

export default function Nav() {
  const { pathname } = useLocation();

  const linkClass =
    "flex items-center gap-2 font-light px-5 py-3 rounded-lg text-base";

  return (
    <div className="bg-[#ffffff] w-60 h-screen flex flex-col fixed top-0 left-0 z-50">
      <div className="flex items-center justify-center gap-2 bg-[#ffffff] my-7">
        <FcBullish fontSize={24} />
        <span className="text-black text-lg font-semibold">TechSmart</span>
      </div>
      <div className="flex-1 flex-col gap-1 px-4 mb-3">
        {DASHBOARD_SIDEBAR_LINKS?.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`${
              pathname === item.path
                ? "bg-[#1B253C] text-white"
                : "text-[#202224]"
            } ${linkClass}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-1 p-4 pt-3">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS?.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`${
              pathname === item.path
                ? "bg-[#1B253C] text-white"
                : "text-[#202224]"
            } ${linkClass}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
