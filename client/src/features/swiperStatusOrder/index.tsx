import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { FreeMode, Mousewheel, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade"; // Import EffectFade styles
import "swiper/css/navigation";
import { StatusOrder } from "~/pages/Account/Orders";

function SwiperStatusOrder({
    statusOrders,
    selectedStatus,
    handleButtonClick,
}: {
    statusOrders: StatusOrder[];
    selectedStatus: string;
    handleButtonClick: (status: string, id: number) => void;
}) {
    return (
        <div className="relative container mx-auto w-full">
            {/* Swiper cho cả Mobile và Desktop */}
            <Swiper
                className="relative group"
                spaceBetween={5}
                breakpoints={{
                    0: {
                        slidesPerView: 2, // Hiển thị 2 cột trên thiết bị nhỏ (điện thoại)
                    },
                    480: {
                        slidesPerView: 3, // Hiển thị 3 cột với điện thoại lớn hơn
                    },
                    768: {
                        slidesPerView: 3, // Hiển thị 4 cột trên tablet
                    },
                    1024: {
                        slidesPerView: 6, // Hiển thị 6 cột trên desktop
                    },
                }}
                freeMode={true}
                mousewheel={true}
                modules={[Navigation, Mousewheel, FreeMode]}
            >
                {/* Thêm nút "Tất cả" vào trong Swiper */}
                <SwiperSlide>
                    <button
                        onClick={() => handleButtonClick("Tất cả", 0)}
                        className={`w-full p-2 text-sm md:text-base lg:px-6 md:py-3 rounded-md border ${selectedStatus === "Tất cả"
                            ? "bg-[#eb3e32] text-white"
                            : "hover:bg-[#eb3e32] hover:text-white duration-200 ease-in-out"
                            }`}
                    >
                        Tất cả
                    </button>
                </SwiperSlide>
                {/* Lặp qua statusOrders */}
                {statusOrders?.map((s) => (
                    <SwiperSlide key={s.id}>
                        <button
                            onClick={() => handleButtonClick(s.status, s.id)}
                            className={`w-full p-2 text-sm md:text-base lg:px-6 md:py-3 rounded-md border ${selectedStatus === s.status
                                ? "bg-[#eb3e32] text-white"
                                : "hover:bg-[#eb3e32] hover:text-white duration-200 ease-in-out"
                                }`}
                        >
                            {s.status}
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default SwiperStatusOrder;
