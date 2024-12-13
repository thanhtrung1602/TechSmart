import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import usePost from "~/hooks/usePost";
import RegisterData from "~/types/dataRegister";

function Register() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset, // Reset form
  } = useForm<RegisterData>();

  const { mutate } = usePost();

  const onSubmit = (data: RegisterData) => {
    const dataRegister = {
      fullname: data.fullname.trim(),
      phone: data.phone.trim(),
      password: data.password.trim(),
      email: data.email?.trim(),
    };

    mutate(
      {
        url: "/auth/registerEmployee",
        data: dataRegister,
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            toast.success("Đăng ký thành công");
            if (response.data.isVerified === false) {
              toast("Bạn cần vào email để xác nhận email");
            }
            reset(); // Reset form sau khi thành công
          }
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            const backendErrors = error.response?.data.errors;
            if (backendErrors) {
              Object.entries(backendErrors).forEach(([field, message]) => {
                setError(field as keyof RegisterData, { type: "server", message: String(message) });
              });
            }
          } else {
            console.error("Lỗi không xác định:", error);
          }
        }
      }
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <h1 className="text-[32px] font-bold mb-4">Đăng ký quản trị viên</h1>
        <div className="min-h-screen bg-gray-100 p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-8 rounded-lg shadow-lg w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-gray-600">Tên Tài Khoản</label>
                <input
                  type="text"
                  placeholder="Tên Tài Khoản"
                  className="mt-1 w-full px-4 py-2 outline-none focus:shadow-sm  rounded-md bg-gray-100"
                  {...register("fullname", {
                    required: "Vui lòng nhập tên tài khoản",
                    minLength: {
                      value: 6,
                      message: "Tên tài khoản phải có ít nhất 6 ký tự",
                    },
                  })}
                />
                {errors.fullname && <p className="mt-2 text-sm text-red-500">{errors.fullname.message}</p>}
              </div>
              <div>
                <label className="block text-base font-medium text-gray-600">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="mt-1 w-full px-4 py-2 outline-none focus:shadow-sm  rounded-md bg-gray-100"
                  {...register("password", {
                    required: "Vui lòng nhập mật khẩu",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự",
                    },
                  })}
                />
                {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-base font-medium text-gray-600">
                  Gmail
                </label>
                <input
                  type="email"
                  placeholder="Tên email"
                  className="mt-1 w-full px-4 py-2 outline-none focus:shadow-sm  rounded-md bg-gray-100"
                  {...register("email", {
                    required: "Vui lòng nhập email",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Định dạng email không hợp lệ",
                    },
                  })}
                />
                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-base font-medium text-gray-600">Số điện thoại</label>
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  className="mt-1 w-full px-4 py-2 outline-none focus:shadow-sm  rounded-md bg-gray-100"
                  {...register("phone", {
                    required: "Vui lòng nhập số điện thoại",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Số điện thoại phải có đúng 10 chữ số",
                    },
                  })}
                />
                {errors.phone && <p className="mt-2 text-sm text-red-500">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                className="px-6 py-2 bg-[#1D2A48] text-white rounded-md focus:outline-none"
                type="submit"
              >
                Thêm tài khoản
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
