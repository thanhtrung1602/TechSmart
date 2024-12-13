import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import usePost from "~/hooks/usePost";
import CheckOTPData from "~/types/dataCheckOTP";

function CheckOTP() {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<CheckOTPData>();
  const { mutate: mutateCheckOTP } = usePost();
  const [isLoading, setIsLoading] = useState(false);

  const email = localStorage.getItem("userEmail");

  if (!email) {
    navigate("/login");
  }

  const onSubmit = (data: CheckOTPData) => {
    setIsLoading(true);
    mutateCheckOTP(
      {
        url: "/auth/verifyotp",
        data: { email, otp: data.otp },
      },
      {
        // 12. Xử lý khi gửi thành công
        onSuccess: (response) => {
          console.log("OTP đã được gửi thành công", response.data);
          toast.success("OTP  đã được Gửi thành công");
          navigate("/newpass");
          setIsLoading(false);

        },
        // 13. Xử lý khi có lỗi khi gửi dữ liệu
        onError: (error) => {
          console.error("Lỗi khi gửi OTP:", error);
          toast.error("OTP sai hoặc đã hết hạn");
          setIsLoading(false);

        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-gray-200 via-white to-gray-200 h-auto py-12 container">
      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 w-[28rem] sm:p-8">
        <h1 className="pb-6 text-black text-3xl font-bold text-center">
          Xác nhận mã OTP
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)} // Xử lý khi gửi form
        >
          <div className="pb-6  ">
            <input
              {...register("otp", { required: "otp bắt buộc" })}
              type="text"
              placeholder="Nhập OTP"
              className="bg-gray-100 text-black w-full rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-gray-200"
            />
          </div>
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center gap-x-2"></div>
            <Link
              to={"/login"}
              className="font-semibold text-main500 hover:text-red-600"
            >
              Trở lại trang đăng nhập
            </Link>
          </div>
          <button
            type="submit"
            className={`w-full py-2 text-white rounded-md ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              } transition-colors duration-300`}
            disabled={isLoading} // Vô hiệu hóa khi loading
          >
            {isLoading ? "Đang gửi..." : "Gửi"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckOTP;
