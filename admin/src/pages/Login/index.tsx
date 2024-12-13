import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import usePost from "~/hooks/usePost";
import LoginData from "~/types/dataLogin";
import { useDispatch } from "react-redux";
import { setAdminProfile } from "~/redux/adminProfileSlice";

function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginData>();
  const { mutate } = usePost();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = (data: LoginData) => {
    mutate(
      {
        url: "/auth/login",
        data,
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            // Kiểm tra role của user
            if (response.data.users.role !== "admin") {
              toast.error("Bạn không có quyền quản trị viên!");
            } else {
              toast.success("Đăng nhập thành công!");
              dispatch(setAdminProfile(response.data.users));
              navigate("/");
            }
          }
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            const backendErrors = error.response?.data.errors;
            if (backendErrors) {
              // Loop through each error from the backend
              Object.entries(backendErrors).forEach(([field, message]) => {
                setError(field as keyof LoginData, {
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
    <div className="flex justify-center items-center min-h-screen bg-[#4880ff]">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md relative">
        <h2 className="text-3xl font-bold text-center text-[#202224] mb-4">
          Đăng nhập
        </h2>
        {/* Form đăng nhập */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Số điện thoại */}
          <div>
            <label className="block text-base font-semibold text-[#202224] opacity-80 mb-2">
              Số điện thoại
            </label>
            <input
              type="contact"
              placeholder="Nhập số điện thoại"
              {...register("contact", { required: "Số điện thoại và email là bắt buộc" })}
              className="w-full px-4 py-3 bg-[#f1f4f9] rounded-lg outline-none focus:shadow-sm focus:shadow-indigo-300 text-lg placeholder-[#a6a6a6]"
            />
            {errors.contact && (
              <p className="mt-2 text-sm text-red-500">{errors.contact.message}</p>
            )}
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-base font-semibold text-[#202224] opacity-80 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              {...register("password", { required: "Mật khẩu là bắt buộc" })}
              className="w-full px-4 py-3 bg-[#f1f4f9] rounded-lg outline-none focus:shadow-sm focus:shadow-indigo-300 text-lg"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
            <div className="flex justify-between mt-2">
              <span className="text-[#202224] text-sm font-semibold opacity-60">
                Quên mật khẩu?
              </span>
              <label className="flex items-center text-[#202224] text-sm font-semibold opacity-60">
                <input type="checkbox" className="mr-2" />
                Ghi nhớ mật khẩu
              </label>
            </div>
          </div>

          {/* Nút đăng nhập */}
          <button
            className="w-full py-3 bg-[#4880ff] rounded-lg text-white text-xl font-bold"
            type="submit"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
