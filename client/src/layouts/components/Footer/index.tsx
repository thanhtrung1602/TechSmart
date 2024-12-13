import {
  CiDeliveryTruck,
  CiMoneyBill,
  CiLock,
  CiPhone,
  CiInstagram,
  CiFacebook,
  CiYoutube,
} from "react-icons/ci";
import americanexpress from "~/assets/images/americanexpress.png";
import mastercard from "~/assets/images/mastercard.png";
import paypal from "~/assets/images/paypal.png";
import visa from "~/assets/images/visa.png";
import pay from "~/assets/images/pay.png";
import stripe from "~/assets/images/stripe.png";
import Image from "~/components/Image";

function Footer() {
  return (
    <footer>
      <div className="w-full px-6 py-5 md:px-10 xl:px-40 flex md:flex-row flex-col justify-center gap-y-4 md:gap-x-7 bg-[#f3f4f6]">
        <div className="flex items-center gap-x-2 w-full md:inline-block md:px-4 md:py-8 lg:px-8 lg:py-12 md:w-[262px]">
          <CiDeliveryTruck className="size-8 md:size-12" />
          <div>
            <p className="text-base md:text-lg lg:text-xl font-medium w-full">
              Miễn phí giao hàng
            </p>
            <span className="text-xs md:text-sm">Cho đơn trên 4.000.000đ</span>
          </div>
        </div>
        <div className="flex items-center gap-x-2 w-full md:inline-block md:px-4 md:py-8 lg:px-8 lg:py-12 md:w-[262px]">
          <CiMoneyBill className="size-8 md:size-12" />
          <div>
            <p className="text-base md:text-lg lg:text-xl font-medium w-full">
              Trả hàng
            </p>
            <span className="text-xs md:text-sm">Đổi trả trong 30 ngày</span>
          </div>
        </div>
        <div className="flex items-center gap-x-2 w-full md:inline-block md:px-4 md:py-8 lg:px-8 lg:py-12 md:w-[262px]">
          <CiLock className="size-8 md:size-12" />
          <div>
            <p className="text-base md:text-lg lg:text-xl font-medium w-full">
              Thanh toán an toàn
            </p>
            <span className="text-xs md:text-sm">Bảo đảm bởi Stripe</span>
          </div>
        </div>
        <div className="flex items-center gap-x-2 w-full md:inline-block md:px-4 md:py-8 lg:px-8 lg:py-12 md:w-[262px]">
          <CiPhone className="size-8 md:size-12" />
          <div>
            <p className="text-base md:text-lg lg:text-xl font-medium w-full">
              Hỗ trợ 24/7
            </p>
            <span className="text-xs md:text-sm">Số điện thoại và email</span>
          </div>
        </div>
      </div>
      <div className="bg-[#090D14] px-4 pt-5 md:px-10 xl:px-40 md:pt-12 lg:pt-20 md:pb-8">
        <div className="flex md:flex-row flex-col justify-between">
          <div className="w-full md:w-64 lg:w-[544px] text-white flex flex-col items-center md:items-start gap-y-4 md:gap-y-8 border-b-[1px] pb-3 md:pb-0 md:border-none">
            <h2 className="text-lg md:text-2xl font-semibold">TechSmart</h2>
            <p className="text-base md:text-xl">
              Không chỉ là đồ điện tử
              <br /> Nó là một cách sống.
            </p>
            <div className="flex items-center gap-x-6">
              <CiInstagram className="size-6" />
              <CiFacebook className="size-6" />
              <CiYoutube className="size-6" />
            </div>
          </div>
          <div className="w-full grid grid-cols-2 md:grid-cols-3 md:justify-between pt-3 md:pt-0 md:w-2/3">
            <div className="flex flex-col gap-y-3 md:gap-y-6 text-white w-40">
              <h2 className="text-base md:text-xl">Các trang</h2>
              <div className="flex flex-col gap-y-4 text-xs md:text-base">
                <span>Trang chủ</span>
                <span>Cửa hàng</span>
                <span>Liên hệ</span>
                <span>Bài viết</span>
              </div>
            </div>
            <div className="flex flex-col gap-y-3 md:gap-y-6 text-white w-40">
              <h2 className="text-base md:text-xl">Chính sách</h2>
              <div className="flex flex-col gap-y-4 text-xs md:text-base">
                <span>Chính sách vận chuyển</span>
                <span>Trả hàng & hoàn tiền</span>
                <span>Hỗ trợ</span>
                <span>Hỏi đáp</span>
              </div>
            </div>
            <div className="flex flex-col gap-y-3 mt-3 md:mt-0 md:gap-y-6 text-white w-40">
              <h2 className="text-base md:text-xl">Trụ sở</h2>
              <div className="flex flex-col gap-y-4 text-xs md:text-base">
                <span>Quận 12</span>
                <span>Hồ Chí Mimh</span>
                <span>Việt Nam</span>
                <span>0903153512</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-x-2 mt-3 md:hidden">
          <Image src={visa} alt="" />
          <Image src={americanexpress} alt="" />
          <Image src={mastercard} alt="" />
          <Image src={stripe} alt="" />
          <Image src={paypal} alt="" />
          <Image src={pay} alt="" />
        </div>
        <div className="pt-10 md:pt-16 flex justify-between text-white">
          <div className="md:flex">
            <p className="pr-0 md:pr-4">
              Bản quyền © 2023 3legant. Bảo lưu mọi quyền.
            </p>
            <p className="px-0 md:px-4 md:border-l-[0.5px] text-[#6C7275]">
              Chính Sách Bảo Mật
            </p>
            <p className="text-[#6C7275]">Điều Khoản & Điều Kiện</p>
          </div>
          <div className="hidden md:flex gap-x-2">
            <Image src={visa} alt="" />
            <Image src={americanexpress} alt="" />
            <Image src={mastercard} alt="" />
            <Image src={stripe} alt="" />
            <Image src={paypal} alt="" />
            <Image src={pay} alt="" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
