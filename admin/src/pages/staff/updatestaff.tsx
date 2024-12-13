import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useGet from "~/hooks/useGet";
import usePut from "~/hooks/usePut";
import InterStaff from "~/models/Staff";

interface FormData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  position: string;
  phone: string;
  hire_date: string;
  email: string;
  salary: string;
}

function UpdateStaff() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onBlur",
  });
  const { mutate: mutateStaff } = usePut();
  const { id } = useParams(); // Lấy id dưới dạng chuỗi từ URL
  const staffId = Number(id);
  const navigate = useNavigate();

  const { data: staff, error } = useGet<InterStaff>(`/staff/findOne/${staffId}`);

  useEffect(() => {
    if (staff) {
      setValue("fullName", staff.fullName);
      setValue("dateOfBirth", staff.date_of_birth ?? ""); //đảm bảo không truyền giá trị null.
      setValue("gender", staff.gender);
      setValue("phone", staff.phone);
      setValue("position", staff.position);
      setValue("hire_date", staff.hire_date ?? "");
      setValue("email", staff.email);
      setValue("salary", staff.salary);
    }
    if (error) {
      console.error("Error fetching staff:", error);
    }
  }, [staff, error, setValue]);

  const onSubmit = (data: FieldValues) => {
    const salaryValue = data.salary ? parseFloat(data.salary) : null;
    mutateStaff(
      {
        url: `/staff/updateStaff/${id}`,
        data: {
          fullName: data.fullName,
          date_of_birth: data.dateOfBirth,
          gender: data.gender,
          phone: data.phone,
          position: data.position,
          hire_date: data.hireDate,
          email: data.email,
          salary: salaryValue,
        },
      },
      {
        onSuccess: async () => {
          toast.success("Cập nhật nhân viên thành công!");
          navigate("/staff", { replace: true });
          setTimeout(() => {
            window.location.reload();
          }, 100);
        },
        onError: (err) => {
          console.error("Error updating staff:", err);
          toast.error("Có lỗi xảy ra khi cập nhật ");
        },
      }
    );
  };

  if (!staff && !error) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return (
      <p className="text-red-500">Có lỗi xảy ra khi lấy thông tin nhân viên.</p>
    );
  }

  return (
    <div>
      <div className="min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Cập nhật nhân viên</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-h-[600px] border rounded-lg p-6 bg-white relative"
        >
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-[13px] text-white font-medium rounded-full w-5 h-5 flex items-center justify-center border border-black bg-[#1B253C]">
              1
            </span>
            <h2 className="text-lg font-semibold">Thông tin nhân viên</h2>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {/* Họ và tên */}
            <div>
              <label className="block text-gray-700 mb-2">Họ và tên</label>
              <input
                type="text"
                placeholder="Họ và tên..."
                {...register("fullName", {
                  required: "Họ và tên là thông tin bắt buộc.",
                })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.fullName && (
                <p className="text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="block text-gray-700 mb-2">Ngày sinh</label>
              <input
                type="date"
                {...register("dateOfBirth", {
                  required: "Ngày sinh là thông tin bắt buộc.",
                })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500">{errors.dateOfBirth.message}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="tel"
                maxLength={11}
                placeholder="Số điện thoại..."
                {...register("phone", {
                  required: "Số điện thoại là thông tin bắt buộc.",
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ.",
                  },
                })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-gray-700 mb-2">Giới tính</label>
              <select
                {...register("gender", {
                  required: "Giới tính là thông tin bắt buộc.",
                })}
                className={`w-full p-2 border rounded bg-white ${
                  errors.gender ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              {errors.gender && (
                <p className="text-red-500">{errors.gender.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Chức vụ</label>
              <input
                type="text"
                placeholder="chức vụ..."
                {...register("position", { required: true })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.position && (
                <p className="text-red-500">Thông tin bắt buộc</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Ngày vào làm</label>
              <input
                type="date"
                {...register("hire_date", {
                  required: "Ngày vào làm là thông tin bắt buộc.",
                })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.hire_date && (
                <p className="text-red-500">{errors.hire_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="email..."
                {...register("email", { required: true })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.email && (
                <p className="text-red-500">Thông tin bắt buộc</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Lương cơ bản</label>
              <input
                type="text"
                placeholder="lương cơ bản..."
                {...register("salary", { required: true })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.salary && (
                <p className="text-red-500">Thông tin bắt buộc</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#1D2A48] text-white font-semibold py-2 px-7 rounded-lg absolute right-4 my-3 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateStaff;
