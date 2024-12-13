import { Swiper, SwiperSlide } from "swiper/react";

// Import required modules
import { Autoplay, Navigation } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import Image from "~/components/Image";

// Đối tượng chứa các slide cho từng danh mục
const slidesData = {
  2: [
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_1_d7eeefac93.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_3b1656df6e.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_75f65ce906.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_7d5728bd6e.png",
    },
    // Thêm các slide khác cho điện thoại
  ],
  3: [
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_74ebf8333c.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_2_c3103125c0.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_3baa24785d.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_47e58637cd.png",
    },
    // Thêm các slide khác cho tablet
  ],
  4: [
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_da_sua_efb6c1eac3.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_ff386195e9.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_c9bd05dfdf.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_595dfea77b.png",
    },
    // Thêm các slide khác cho laptop
  ],
  5: [
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_65356cdfd2.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_b2045dc127.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_8c962089f1.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/Desktop_H1_1_81e841965d.png",
    },
    // Thêm các slide khác cho tai nghe
  ],
  6: [
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_5244f6c0c6.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_8099347781.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_9df4d1950e.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_2460dfd898.png",
    },
    // Thêm các slide khác cho đồng hồ
  ],
  7: [
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_1440x242_118a82ef44.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_8be4982790.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_e677ab4b61.png",
    },
    {
      url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/H1_3921603233.png",
    },
    // Thêm các slide khác cho màn hình
  ],
};

export type CategoryType = 2 | 3 | 4 | 5 | 6 | 7; // Các giá trị hợp lệ

interface BannerCategoryProps {
  category: CategoryType; // Sử dụng SlideKeys để đảm bảo loại hợp lệ
}

export default function BannerCategory({ category }: BannerCategoryProps) {
  // Lấy slide tương ứng với danh mục
  const slides = slidesData[category];

  return (
    <div>
      <Swiper
        className="relative group"
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={{
          nextEl: ".button-next-slide",
          prevEl: ".button-prev-slide",
        }}
        modules={[Autoplay, Navigation]}
      >
        {slides?.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className={`relative flex items-center select-none rounded-lg overflow-hidden`}
            >
              <Image src={slide.url} alt="" className="object-cover" />
            </div>
          </SwiperSlide>
        ))}
        <div className="absolute z-10 top-1/2 -translate-y-1/2 group-hover:left-2 -left-[23rem] button-prev-slide text-white size-10 bg-[#cbcbcb] grid place-content-center duration-300 rounded-full select-none cursor-pointer hover:scale-110 hover:bg-[#939494]">
          <FaArrowLeft />
        </div>
        <div className="absolute z-10 top-1/2 -translate-y-1/2 group-hover:right-2 -right-[23rem] button-next-slide text-white size-10 bg-[#cbcbcb] grid place-content-center duration-300 rounded-full select-none cursor-pointer hover:scale-110 hover:bg-[#939494]">
          <FaArrowRight />
        </div>
      </Swiper>
    </div>
  );
}
