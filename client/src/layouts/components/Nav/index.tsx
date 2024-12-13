import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Autoplay, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade"; // Import EffectFade styles
import "swiper/css/navigation";

import { Link } from "react-router-dom";
import useGet from "~/hooks/useGet";
import Image from "~/components/Image";
import Categories from "~/models/Categories";
import { useDispatch } from "react-redux";

import { setActiveMenu } from "~/redux/menuSlice";
import Loading from "../Loading";

function Nav() {
  const dispatch = useDispatch();
  const {
    data: categories,
    error,
    isLoading,
  } = useGet<Categories[]>(`/categories/getAllCategories`);

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading categories</div>;
  const handleMenu = (id: string) => {
    dispatch(setActiveMenu(id));
    sessionStorage.setItem("menuActive", id);
  };

  return (
    <div className="relative container mx-auto px-4 md:px-10 xl:px-40 md:pt-10 pt-4">
      {/* Swiper cho cả Mobile và Desktop */}
      <Swiper
        className="relative group"
        spaceBetween={10}
        breakpoints={{
          0: {
            slidesPerView: 3, // 3 cột trên mobile
          },
          768: {
            slidesPerView: 4, // 4 cột trên tablet
          },
          1024: {
            slidesPerView: 6, // 6 cột trên desktop
          },
        }}
        navigation={{
          nextEl: ".button-next-slide",
          prevEl: ".button-prev-slide",
        }}
        modules={[Autoplay, Navigation]}
      >
        {categories?.map((category) => category.visible &&  (
          <SwiperSlide key={category.id} className="min-h-full">
            <Link
              to={`/${category.slug}`}
              className="w-full h-full"
              onClick={() => handleMenu("shop")}
            >
              <div className="h-full bg-white flex items-center justify-center gap-x-1 px-1 md:gap-x-4 md:px-4 py-2 rounded shadow">
                <span className="font-semibold text-xs md:text-sm text-center">
                  {category.name}
                </span>
                <Image
                  src={category.img}
                  alt={category.name}
                  className="size-8 md:size-12"
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Nav;
