import bannerHome1 from "~/assets/images/bannerHome1.png";
import bannerHome2 from "~/assets/images/bannerHome2.png";
import bannerHome3 from "~/assets/images/bannerHome3.png";
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade"; // Import EffectFade styles
import "swiper/css/navigation";
import Image from "~/components/Image";
import { useState } from "react";

const slider = [
  {
    color: "bg-gradient-to-r from-black via-red-500 to-black",
    url: bannerHome1,
  },
  {
    color: "bg-gradient-to-r from-red-300 via-red-700 to-red-300",
    url: bannerHome2,
  },
  {
    color: "bg-white",
    url: bannerHome3,
  },
];

export default function Banner() {
  const [activeIndex, setActiveIndex] = useState(0); // To track the active slide

  return (
    <div>
      <Swiper
        className="relative group"
        effect={"fade"}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        fadeEffect={{
          crossFade: true, // Smooth fade transition
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // Track current slide
        navigation={{
          nextEl: ".button-next-slide",
          prevEl: ".button-prev-slide",
        }}
        modules={[EffectFade, Autoplay, Navigation]}
      >
        {slider?.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className={`relative h-100px flex justify-around items-center text-white ${slide.color
                } select-none px-4 md:px-10 xl:px-40 py-12 
                            transition-opacity duration-1000 ${index === activeIndex
                  ? "opacity-100"
                  : "opacity-0"
                }`}
            >
              <Image src={slide.url} alt="" className="" />
            </div>
          </SwiperSlide>
        ))}
        <div className="size-10 md:size-20 absolute z-10 top-1/2 -translate-y-1/2 -left-10 group-hover:-left-4 md:group-hover:-left-11 md:-left-[23rem] button-prev-slide text-black bg-[#e5e5e583] hover:bg-[#a7a6a683] grid place-content-center duration-300 rounded-full cursor-pointer">
          <FaArrowLeft className="size-3 md:size-5 absolute top-1/2 -translate-y-1/2 right-3" />
        </div>
        <div className="size-10 md:size-20 absolute z-10 top-1/2 -translate-y-1/2 -right-10 group-hover:-right-4 md:group-hover:-right-11 md:-right-[23rem] button-next-slide text-black bg-[#e5e5e583] hover:bg-[#a7a6a683] grid place-content-center duration-300 rounded-full cursor-pointer">
          <FaArrowRight className="size-3 md:size-5 absolute top-1/2 -translate-y-1/2 left-3" />
        </div>
      </Swiper>
    </div>
  );
}
