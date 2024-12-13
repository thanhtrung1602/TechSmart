import { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import usePost from "~/hooks/usePost";
import { useForm } from "react-hook-form";
import RegisterData from "~/types/dataRegister";
import { AxiosError } from "axios";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterData>();
  const { mutate: signup } = usePost();
  const navigate = useNavigate();

  const onSubmit = (data: RegisterData) => {
    const dataRegister = {
      email: data.email,
      password: data.password,
      phone: data.phone,
    }
    signup(
      { url: "/auth/register", data: dataRegister },
      {
        onSuccess: (data) => {
          if (data.status === 200) {
            toast.success("Đăng ký thành công");
            if (data.data.isVerified === false) {
              toast("Bạn cần vào email để xác nhận email");
              navigate("/login");
            }
          }
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            const backendErrors = error.response?.data.errors;
            if (backendErrors) {
              Object.entries(backendErrors).forEach(([field, message]) => {
                setError(field as keyof RegisterData, {
                  type: "server",
                  message: String(message),
                });
              });
            }
          } else {
            console.error("Lỗi không xác định:", error);
          }
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-gray-200 via-white to-gray-200 h-auto py-12 container">
      <div className="bg-white shadow-lg rounded-lg p-4 w-[28rem] sm:p-8">
        <h1 className="pb-6 text-black text-3xl font-bold text-center">
          Đăng ký
        </h1>

        <p className="pb-8 text-black text-center">
          Bạn đã có tài khoản?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-main500 hover:text-red-600"
          >
            Đăng nhập
          </Link>
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="pb-6">
            <input
              type="text"
              {...register("email", { required: "Vui lòng nhập email" })}
              placeholder="email"
              className="bg-gray-100 text-black w-full rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-gray-200"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="pb-6">
            <input
              type="text"
              {...register("phone", {
                required: "Vui lòng nhập số điện thoại",
              })}
              placeholder="Số điện thoại"
              className="bg-gray-100 text-black w-full rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-gray-200"
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div className="relative pb-6">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Vui lòng nhập mật khẩu" })}
              placeholder="Mật khẩu"
              className="bg-gray-100 text-black w-full rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-gray-200"
            />
            {showPassword ? (
              <FaEye
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-5 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              />
            ) : (
              <FaEyeSlash
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-5 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              />
            )}
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-2 text-white rounded-md bg-red-500 hover:bg-red-600 transition-colors duration-300"
            >
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
