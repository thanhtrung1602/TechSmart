import { useLocation } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { useState, useEffect } from "react";

function NavCart() {
  const location = useLocation();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
    updateCompletedSteps(location.pathname);
  }, [location.pathname]);

  const updateCompletedSteps = (path: string) => {
    const steps = ["/cart", "/checkout", "/ordercomplete"];
    const index = steps.indexOf(path);
    if (index !== -1) {
      setCompletedSteps(steps.slice(0, index + 1));
    }
  };

  const getLinkClass = (path: string) => {
    const baseClass = "flex pb-2 border-b-2";
    return completedSteps.includes(path) || currentPath === path
      ? `${baseClass} border-[#22C55E]`
      : baseClass;
  };

  const getCircleClass = (path: string) => {
    if (completedSteps.includes(path)) {
      return "w-[30px] h-[30px] mr-[10px] p-2 rounded-[50%] flex items-center justify-center bg-[#22C55E] text-white";
    }
    return "w-[30px] h-[30px] mr-[10px] p-2 rounded-[50%] flex items-center justify-center bg-[#B1B5C3] text-black";
  };

  const getStepIcon = (path: string, step: number) => {
    // Show step number if currently on that step, otherwise show checkmark if completed
    if (currentPath === path) {
      return <p>{step}</p>; // Show step number when on the current page
    } else if (completedSteps.includes(path)) {
      return <FaCheck className="size-10" />; // Show checkmark if completed
    }
    return <p>{step}</p>; // Otherwise, show step number
  };

  return (
    <div className="flex justify-around">
      <div className={getLinkClass("/cart")}>
        <div className={getCircleClass("/cart")}>{getStepIcon("/cart", 1)}</div>
        <p
          className={
            completedSteps.includes("/cart") || currentPath === "/cart"
              ? "flex items-center justify-center text-black"
              : "flex items-center justify-center text-gray-500"
          }
        >
          Giỏ hàng
        </p>
      </div>
      <div className={getLinkClass("/checkout")}>
        <div className={getCircleClass("/checkout")}>
          {getStepIcon("/checkout", 2)}
        </div>
        <p
          className={
            completedSteps.includes("/checkout") || currentPath === "/checkout"
              ? "flex items-center justify-center text-black"
              : "flex items-center justify-center text-gray-500"
          }
        >
          Xác nhận đơn hàng
        </p>
      </div>
      <div className={getLinkClass("/ordercomplete")}>
        <div className={getCircleClass("/ordercomplete")}>
          {getStepIcon("/ordercomplete", 3)}
        </div>
        <p
          className={
            completedSteps.includes("/ordercomplete") ||
            currentPath === "/ordercomplete"
              ? "flex items-center justify-center text-black"
              : "flex items-center justify-center text-gray-500"
          }
        >
          Đơn hàng
        </p>
      </div>
    </div>
  );
}

export default NavCart;
