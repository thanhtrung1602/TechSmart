import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaList } from "react-icons/fa";

import logo1 from "~/assets/images/logo2.png";
import Image from "~/components/Image";
import {
  FaArrowRightFromBracket,
  FaArrowRightToBracket,
  FaXmark,
} from "react-icons/fa6";
import { MdOutlineShoppingCart, MdPersonOutline } from "react-icons/md";
import { IoPerson, IoPersonAdd } from "react-icons/io5";
import MenuTooltip from "~/components/Popper/MenuTooltip";
import useGet from "~/hooks/useGet";
import Categories from "~/models/Categories";
import Manufacturer from "~/models/Manufacturer";
import { useDispatch, useSelector } from "react-redux";
import Carts from "~/models/Carts";
import { RootState } from "~/redux/store";
import {
  setActiveMenu,
  previousMenu,
  resetActiveMenu,
} from "~/redux/menuSlice";
import { removeUserProfile } from "~/redux/userProfileSlice";
import Search from "~/components/Search";
import usePost from "~/hooks/usePost";
import toast from "react-hot-toast";
import Button from "~/components/Button";

function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [scrollShadow, setScrollShadow] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const activeMenu = useSelector((state: RootState) => state.menu.activeMenu);
  const [categorySlug, setCategorySlug] = useState<string>("");
  const [showManufacturers, setShowManufacturers] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  const userProfile = useSelector(
    (state: RootState) => state.userProfile.userProfile
  );
  const socketCart = useSelector((state: RootState) => state.socket.cartUpdate);
  const { mutate } = usePost();

  const cartProducts = useSelector(
    (state: RootState) => state.cart.cartProducts
  );

  const { data: categories } = useGet<Categories[]>(
    `/categories/getAllCategories`
  );

  const { data: manufacturers } = useGet<Manufacturer[]>(
    `/manufacturer/getManufacturerByCategory/${categorySlug}`,
    {
      enabled: showManufacturers && !!categorySlug,
    }
  );

  const { data: carts } = useGet<{ count: number; rows: Carts[] }>(
    `/cart/getAllCartByUserId/${socketCart.userId || userProfile?.id}`,
    {
      enabled: !!socketCart.userId || !!userProfile,
    }
  );

  //Responsive
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrollShadow(true);
      } else {
        setScrollShadow(false);
      }
    };

    // addEvent khi scroll
    window.addEventListener("scroll", handleScroll);

    // Clean up fn khi unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const validPaths = useMemo(() => ["/", "/contact", "/blog", "/shop"], []);

  // Reset trạng thái khi đường dẫn không hợp lệ
  useEffect(() => {
    if (!validPaths.includes(location.pathname)) {
      dispatch(resetActiveMenu()); // Reset trạng thái activeMenu
    }
  }, [location.pathname, validPaths, dispatch]);

  // Khôi phục trạng thái từ sessionStorage
  useEffect(() => {
    const savedMenu = sessionStorage.getItem("menuActive");
    if (savedMenu && validPaths.includes(location.pathname)) {
      dispatch(setActiveMenu(savedMenu));
    }
  }, [dispatch, location.pathname, validPaths]);

  // Handler menu chính
  const handleMenu = (id: string) => {
    dispatch(setActiveMenu(id)); // Sử dụng action từ Redux

    if (id === "shop") {
      setCategorySlug(""); // Reset danh mục
      setShowOverlay(false);
    }
  };

  // Handler menu khi di chuột vào menu
  const handleMouseOver = (id: string) => {
    if (id === "shop") {
      setShowOverlay(true); // Hiển thị overlay
    }
    dispatch(setActiveMenu(id)); // Cập nhật trạng thái activeMenu tạm thời
  };

  // Handler menu khi di chuột ra menu
  const handleMouseOut = () => {
    setShowOverlay(false); // Ẩn overlay
    dispatch(previousMenu()); // Quay về menu trước
  };

  // Get class by base class
  const getClassName = (id: string) => {
    if (!validPaths.includes(location.pathname)) {
      return "text-white font-semibold cursor-pointer relative transition-color duration-500 hover:text-[#ecca36]";
    }
    return `text-white font-semibold cursor-pointer relative transition-color duration-500 ${
      activeMenu === id ? "text-[#ffdb29e7] group" : "hover:text-[#ecca36]"
    }`;
  };

  // Get class by derived class
  const getClassNameDerived = () => {
    return `fixed top-[7.25rem] z-40 p-3 md:w-[calc(15%+90px)] bg-white transition-transform duration-300 ease-in-out origin-top ${
      showOverlay && activeMenu === "shop"
        ? "scale-y-100 opacity-100"
        : "scale-y-0 opacity-0"
    } md:before:fixed md:before:w-full md:before:-top-[2.5rem] nd:before:left-0 md:before:h-[50px] md:before:w-1/4 md:before:bg-transparent`;
  };

  //Toggle menu mobile
  const toggleMenu = () => setOpenMenu(!openMenu); // Hàm mở/đóng menu

  //Logout
  const handleLogout = () => {
    mutate(
      { url: "/auth/logout", data: {} },
      {
        onSuccess: (res) => {
          if (res.status) {
            toast.success("Đã đăng xuất");
            dispatch(removeUserProfile());
          }
        },
      }
    );
  };

  //List items action
  const LIST_ITEM = [
    {
      icon: <FaArrowRightToBracket />,
      name: "Đăng nhập",
      to: "/login",
    },
    {
      icon: <IoPersonAdd />,
      name: "Đăng ký",
      to: "/register",
    },
  ];

  //List items account
  const LIST_ITEM_ACCOUNT = [
    {
      icon: <IoPerson />,
      name: userProfile ? userProfile.fullname : "Khách",
      to: "/account",
    },
    {
      icon: <FaArrowRightFromBracket />,
      name: "Đăng xuất",
      onClick: () => {
        handleLogout();
      },
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white mb-6 transition-shadow w-full ${
        scrollShadow ? "shadow-lg" : ""
      }`}
    >
      {/* Thanh header chính */}
      <section className="container mx-auto px-4 md:px-10 xl:px-40">
        <article className="flex items-center justify-between py-4 bg-white">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => handleMenu("home")}
            className="flex items-center"
          >
            <Image src={logo1} alt="Logo" className="h-8 md:h-10" />
            <h2 className="text-[#eb3e32] text-xl font-bold">TechSmart</h2>
          </Link>

          {/* Search chỉ hiện trên màn hình lớn */}
          <div className="hidden md:flex flex-1 justify-center">
            <Search />
          </div>

          {/* Biểu tượng menu và giỏ hàng */}
          <div className="flex items-center gap-x-4 px-4 md:gap-x-6 md:px-0 lg:px-0">
            {/* Giỏ hàng */}
            <Link to="/cart" className="relative">
              <MdOutlineShoppingCart className="text-black text-2xl" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs py-[1px] px-2 rounded-full">
                {userProfile
                  ? carts && (carts.count > 0 ? carts.count : 0)
                  : cartProducts &&
                    (cartProducts.length > 0 ? cartProducts?.length : 0)}
              </span>
            </Link>

            <div className="lg:block md:block hidden">
              {/* Tài khoản */}
              {userProfile ? (
                <MenuTooltip
                  items={LIST_ITEM_ACCOUNT}
                  className="flex flex-col gap-2 bg-white text-sm text-neutral-500 font-semibold rounded shadow p-2 mt-[1.1rem]"
                >
                  <div className="text-black text-2xl cursor-pointer">
                    <MdPersonOutline />
                  </div>
                </MenuTooltip>
              ) : (
                <MenuTooltip
                  items={LIST_ITEM}
                  className="flex flex-col gap-2 bg-white text-sm text-neutral-500 font-semibold rounded shadow p-2 mt-[1.1rem]"
                >
                  <div className="text-black text-2xl cursor-pointer">
                    <MdPersonOutline />
                  </div>
                </MenuTooltip>
              )}
            </div>
          </div>
        </article>
      </section>

      <section className="bg-[#eb3e32]">
        <div className="container mx-auto px-4 md:px-10 xl:px-40">
          <div className="flex justify-between items-center gap-x-3 py-2 text-white">
            <div className="md:border-r-2">
              <div
                className={`md:mr-52 ${getClassName("shop")}`}
                onMouseOver={() => handleMouseOver("shop")}
                onMouseOut={handleMouseOut}
              >
                <div className="flex items-center gap-2 md:w-28">
                  <FaList className="size-6 md:size-4" onClick={toggleMenu} />
                  <span className="hidden md:block">Danh mục</span>
                </div>

                {/* Menu mobile */}
                <div
                  className={`md:hidden fixed top-0 left-0 h-full w-full bg-white z-50 transform transition-transform duration-300 ${
                    openMenu ? "translate-x-0" : "-translate-x-full"
                  }`}
                >
                  <section className="bg-white">
                    <article className="px-4 py-4 md:px-10 xl:px-40 flex items-center justify-between">
                      {/* Logo */}
                      <Link
                        to="/"
                        onClick={() => {
                          toggleMenu();
                          handleMenu("home");
                        }}
                        className="flex items-center"
                      >
                        <Image src={logo1} alt="Logo" className="h-8 md:h-10" />
                        <h2 className="text-[#eb3e32] text-xl font-bold">
                          TechSmart
                        </h2>
                      </Link>
                      {/* Nút đóng menu */}
                      <div className="flex items-center gap-x-4 md:gap-x-6">
                        <FaXmark
                          className="text-black text-2xl"
                          onClick={toggleMenu}
                        />
                      </div>
                    </article>

                    {/* Account */}
                    <aside className="px-4 md:px-10 xl:px-40 border-b-[0.5px] border-[#777676]">
                      {/* Tài khoản */}
                      {userProfile ? (
                        <div className="flex justify-between gap-2 bg-white text-sm text-neutral-500 font-semibold py-2">
                          <Button to={`/account`}>
                            <div className="flex items-center gap-x-2 transition-colors hover:text-main600">
                              <span className="bg-[#eb3e323f] rounded-full p-3">
                                <IoPerson className="size-6 text-[#eb3e32]" />
                              </span>
                              <span className="text-sm">
                                {userProfile.fullname}
                              </span>
                            </div>
                          </Button>
                          <Button onClick={handleLogout}>
                            <div className="flex items-center gap-x-2 p-2 transition-colors hover:bg-[#eb3e323f] border-2 border-[#eb3e32] text-[#eb3e32] rounded-md">
                              <span className="text-sm">
                                <FaArrowRightFromBracket />
                              </span>
                              <span className="text-sm">Đăng xuất</span>
                            </div>
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2 bg-white text-sm text-neutral-500 font-semibold py-2">
                          <Button to={``}>
                            <div className="flex items-center gap-x-2 p-2 transition-colors hover:text-main600 border-2 border-[#eb3e32] rounded-md">
                              <span className="text-sm">
                                <IoPerson />
                              </span>
                              <span className="text-sm">Đăng nhập</span>
                            </div>
                          </Button>
                          <Button to={``}>
                            <div className="flex items-center gap-x-2 p-2 transition-colors hover:text-main600 border-2 border-[#eb3e32] rounded-md">
                              <span className="text-sm">
                                <IoPerson />
                              </span>
                              <span className="text-sm">Đăng ký</span>
                            </div>
                          </Button>
                        </div>
                      )}
                    </aside>

                    {/* Menu */}
                    <ul
                      className={`mt-2 w-full bg-white transition-transform duration-300 ease-in-out origin-top`}
                    >
                      {categories?.map(
                        (category) =>
                          category.visible && (
                            <li
                              key={category.id}
                              className="relative rounded hover:bg-gray-200 text-black"
                              onMouseEnter={() => {
                                setCategorySlug(category.slug);
                                setShowManufacturers(true);
                              }}
                              onMouseLeave={() => {
                                setShowManufacturers(false);
                              }}
                            >
                              <Link
                                to={`/${category.slug}`}
                                className="flex items-center gap-x-2 py-2 px-4"
                                onClick={() => {
                                  toggleMenu();
                                  handleMenu("shop");
                                }}
                              >
                                <Image
                                  src={category.img}
                                  fallbackSrc=""
                                  alt={category.name}
                                  className="size-8 object-cover"
                                />
                                <span className="text-sm font-normal">
                                  {category.name}
                                </span>
                              </Link>
                            </li>
                          )
                      )}
                    </ul>
                  </section>
                </div>

                {/* Dropdown for categories */}
                <ul
                  className={`hidden md:block md:shadow ${getClassNameDerived()}`}
                >
                  {categories?.map(
                    (category) =>
                      category.visible && (
                        <li
                          key={category.id}
                          className="relative rounded hover:bg-gray-200 text-black"
                          onMouseEnter={() => {
                            setCategorySlug(category.slug);
                            setShowManufacturers(true);
                          }}
                          onMouseLeave={() => {
                            setShowManufacturers(false);
                          }}
                        >
                          <Link
                            to={`/${category.slug}`}
                            className="flex items-center gap-x-2 py-2 px-4"
                            onClick={() => handleMenu("shop")}
                          >
                            <Image
                              src={category.img}
                              fallbackSrc=""
                              alt={category.name}
                              className="size-8 object-cover"
                            />
                            <span className="text-sm font-normal">
                              {category.name}
                            </span>
                          </Link>

                          {/* Hiển thị danh sách nhà sản xuất tương ứng với category */}
                          {categorySlug === category.slug &&
                            showManufacturers &&
                            manufacturers && (
                              <ul
                                className={`${
                                  showManufacturers ? "shadow" : ""
                                } fixed top-0 left-full p-3 bg-white border-l-2 h-full md:w-[calc(100%+16.1rem)] lg:w-[240%] flex flex-col flex-wrap before:fixed before:h-full before:top-0 before:-right-2 before:w-5 before:bg-transparent`}
                              >
                                {manufacturers?.map((manufacturer) => (
                                  <li
                                    key={manufacturer.id}
                                    className="hover:bg-gray-200 rounded"
                                  >
                                    <Link
                                      to={`/${category.slug}/${manufacturer.slug}`}
                                      className="flex text-sm py-2 px-5 font-normal"
                                      onClick={() => handleMenu("shop")}
                                    >
                                      <span className="text-sm font-normal">
                                        {manufacturer.name}
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                        </li>
                      )
                  )}
                </ul>
              </div>
            </div>
            <div className="hidden md:flex bg-[#eb3e32] w-2/3">
              <nav className="flex items-center gap-x-8 text-white">
                <ul className="flex gap-x-8">
                  <li className={getClassName("home")}>
                    <Link to="/" onClick={() => handleMenu("home")}>
                      Trang chủ
                    </Link>
                  </li>
                  <li className={getClassName("contact")}>
                    <Link to="/contact" onClick={() => handleMenu("contact")}>
                      Liên hệ
                    </Link>
                  </li>
                  <li className={getClassName("blog")}>
                    <Link to="/blog" onClick={() => handleMenu("blog")}>
                      Blog
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="flex items-center md:hidden ">
              <Search />
            </div>
          </div>
        </div>
      </section>
    </header>
  );
}

export default Header;
