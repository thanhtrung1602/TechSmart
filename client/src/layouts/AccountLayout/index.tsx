import { Link } from "react-router-dom";
import { ChildrenType } from "~/types/childrenType";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import Image from "~/components/Image";
import { FaUser, FaLocationDot, FaBagShopping, FaKey } from "react-icons/fa6";
import { RootState } from "~/redux/store";
import { useSelector } from "react-redux";

function AccountLayout({ children }: ChildrenType) {
  const userProfile = useSelector(
    (state: RootState) => state.userProfile.userProfile
  );

  const [menuAccount, setMenuAccount] = useState(() => {
    return sessionStorage.getItem("menuAccount") || "account";
  });

  useEffect(() => {
    sessionStorage.setItem("menuAccount", menuAccount);
  }, [menuAccount]);

  useEffect(() => {
    return () => {
      sessionStorage.setItem("menuAccount", "account");
    };
  }, []);

  const handleMenu = (id: string) => {
    if (menuAccount !== id) {
      setMenuAccount(id);
    }
  };

  const getClassName = (id: string) => {
    return `py-2 px-2 my-1 cursor-pointer rounded-lg transition-colors duration-200 ${
      menuAccount === id
        ? "bg-[#eb3e32] text-white"
        : "text-black bg-white hover:bg-[#eb3e32] hover:text-white"
    }`;
  };

  return (
    <>
      <Header />
      <section className="bg-[#f3f4f6] pt-36 px-4 md:px-10 xl:px-40">
        <div className="flex flex-col lg:gap-x-3 lg:flex-row justify-between">
          <div className="lg:sticky top-[92px] max-h-full lg:max-h-[70vh] w-full lg:w-2/6 py-10 px-4 bg-white rounded-lg mb-6 lg:mb-0">
            <div className="w-[120px] md:w-[140px] lg:w-[180px] min-h-10 m-auto text-center flex flex-col items-center mb-10">
              <div className="w-[80px] md:w-[100px] lg:w-[120px] mb-[10px]">
                <Image
                  src="https://th.bing.com/th/id/OIP.SbnxR2-F4GQCbQ8J5yXSoQAAAA?pid=ImgDet&w=177&h=177&c=7&dpr=1.3"
                  alt=""
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base lg:text-lg">
                  {userProfile?.fullname}
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className={getClassName("account")}>
                <Link to={"/account"} onClick={() => handleMenu("account")}>
                  <div className="flex items-center">
                    <FaUser className="text-sm md:text-lg" />
                    <span className="ml-2 text-sm md:text-base">
                      Thông tin tài khoản
                    </span>
                  </div>
                </Link>
              </div>
              <div className={getClassName("addressuser")}>
                <Link
                  to={"/addressuser"}
                  onClick={() => handleMenu("addressuser")}
                >
                  <div className="flex items-center">
                    <FaLocationDot className="text-sm md:text-lg" />
                    <span className="ml-2 text-sm md:text-base">
                      Địa chỉ nhận hàng
                    </span>
                  </div>
                </Link>
              </div>
              <div className={getClassName("orders")}>
                <Link to={"/orders"} onClick={() => handleMenu("orders")}>
                  <div className="flex items-center">
                    <FaBagShopping className="text-sm md:text-lg" />
                    <span className="ml-2 text-sm md:text-base">
                      Đơn đặt hàng
                    </span>
                  </div>
                </Link>
              </div>
              <div className={getClassName("changepassword")}>
                <Link
                  to={"/changepassword"}
                  onClick={() => handleMenu("changepassword")}
                >
                  <div className="flex items-center">
                    <FaKey className="text-sm md:text-lg" />
                    <span className="ml-2 text-sm md:text-base">
                      Đổi mật khẩu
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="size-full p-4 lg:p-6 bg-white rounded-lg">
            {children}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default AccountLayout;
