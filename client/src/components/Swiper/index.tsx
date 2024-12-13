import { ReactNode } from "react";
//Swiper
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Autoplay, Navigation } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface SwiperCarouselProps<T> {
  items: T[] | undefined; //Mảng dữ liệu
  children: (item: T, index: number) => ReactNode; //Lặp qua mảng
  slidesPerView?: number; //Bao nhiêu phân tử trong mảng được hiện
  spaceBetween?: number; //Khoảng cách
  centeredSlides?: boolean; //Căn giữa slide đang được hiển thị trong viewport
  className?: string;
  autoplay?: boolean;
  navigation?: boolean; //Được phép scroll ngang để kéo slide hay không
  pagination?: boolean; //Thanh phân trang
  breakpoints?: {
    [key: number]: {
      slidesPerView: number;
    };
  };
}

function SwiperCarousel<T>({
  items,
  children,
  slidesPerView,
  spaceBetween,
  centeredSlides = false,
  className = "",
  autoplay = false,
  navigation = false,
  pagination = false,
  breakpoints = {},
}: SwiperCarouselProps<T>) {
  return (
    <>
      <Swiper
        className={className}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        centeredSlides={centeredSlides}
        pagination={pagination ? { clickable: true } : undefined}
        navigation={
          navigation
            ? {
                nextEl: ".button-next-slide",
                prevEl: ".button-prev-slide",
              }
            : undefined
        }
        autoplay={
          autoplay ? { delay: 3000, disableOnInteraction: false } : undefined
        }
        breakpoints={breakpoints}
        modules={[Autoplay, Navigation]}
      >
        {items &&
          items?.map((item, index) => (
            <SwiperSlide key={index}>{children(item, index)}</SwiperSlide>
          ))}
        {navigation ? (
          <>
            <div className="absolute z-10 top-1/2 -translate-y-1/2 group-hover:left-2 -left-[23rem] button-prev-slide text-white size-10 bg-[#cbcbcb] grid place-content-center duration-300 rounded-full select-none cursor-pointer hover:scale-110 hover:bg-[#939494]">
              <FaArrowLeft />
            </div>
            <div className="absolute z-10 top-1/2 -translate-y-1/2 group-hover:right-2 -right-[23rem] button-next-slide text-white size-10 bg-[#cbcbcb] grid place-content-center duration-300 rounded-full select-none cursor-pointer hover:scale-110 hover:bg-[#939494]">
              <FaArrowRight />
            </div>
          </>
        ) : undefined}
      </Swiper>
    </>
  );
}

export default SwiperCarousel;
