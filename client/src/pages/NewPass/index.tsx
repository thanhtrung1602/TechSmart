import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import usePost from "~/hooks/usePost";
import NewPassData from "~/types/dataNewPass";

function NewPass() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewPassData>();
  const { mutate: mutateNewPass } = usePost();
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const newPassword = watch("newPassword");

  const onSubmit = (data: NewPassData) => {
    setIsLoading(true);
    mutateNewPass(
      {
        url: "/auth/reset-password",
        data: { email, newPassword: data.newPassword },
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            toast.success("Mật khẩu đã được cập nhật thành công");
            localStorage.removeItem("userEmail");
            navigate("/login");
            setIsLoading(false);
          }
        },
        onError: () => {
          toast.error("Có lỗi khi cập nhật mật khẩu");
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-gray-200 via-white to-gray-200 h-auto py-12 container">
      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 w-[28rem] sm:p-8">
        <h1 className="pb-6 text-black text-3xl font-bold text-center">
          Mật khẩu mới
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Nhập mật khẩu mới */}
          <div className="pb-4 relative">
            <input
              {...register("newPassword", {
                required: "Mật khẩu mới là bắt buộc",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              className="bg-gray-100 text-black w-full rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-gray-200"
              disabled={isLoading}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-5 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="pb-6 relative">
            <input
              {...register("confirmPassword", {
                required: "Vui lòng xác nhận mật khẩu",
                validate: (value) =>
                  value === newPassword || "Hai mật khẩu không khớp",
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              className="bg-gray-100 text-black w-full rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-gray-200"
              disabled={isLoading}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-5 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Nút gửi */}
          <div className="py-6 flex items-center justify-between">
            <Link
              to={"/login"}
              className="font-semibold text-main500 hover:text-red-600"
            >
              Trở lại trang đăng nhập
            </Link>
          </div>
          <button
            type="submit"
            className={`w-full py-2 text-white rounded-md ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            } transition-colors duration-300`}
            disabled={isLoading}
          >
            {isLoading ? "Đang gửi..." : "Gửi"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewPass;
