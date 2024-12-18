import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import usePost from "~/hooks/usePost";
import DataStaff from "~/types/dataStaff";

function AddStaff() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataStaff>();
  const { mutate: mutateStaff } = usePost();

  const onSubmit = (data: DataStaff) => {
    // Kiểm tra salary có phải là số hợp lệ không
    const salaryValue = data.salary ? Number(data.salary) : null;

    mutateStaff(
      {
        url: "/staff/createStaff",
        data: {
          fullName: data.fullName,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          phone: data.phone,
          position: data.position,
          hire_date: data.hire_date,
          email: data.email,
          salary: salaryValue,
        },
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            toast.success("Nhân viên đã được thêm thành công");
            navigate("/staff", { replace: true });
            setTimeout(() => navigate(0), 500); // Refresh lại trang sau 500ms
          }
        },
        onError: (error) => {
          console.error("Error adding staff:", error);
          toast.error("Có lỗi xảy ra khi thêm nhân viên");
        },
      }
    );
  };

  return (
    <div>
      <div className="min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Thêm nhân viên</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-h-[600px] border rounded-lg p-6 bg-white relative"
        >
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-[13px] text-white font-medium rounded-full w-5 h-5 flex items-center justify-center border border-black bg-[#1B253C]">
              1
            </span>
            <h2 className="text-lg font-semibold">Nhân viên</h2>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Họ và tên</label>
              <input
                type="text"
                placeholder="Họ và tên..."
                {...register("fullName", { required: true })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.fullName && (
                <p className="text-red-500">Thông tin bắt buộc</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Ngày sinh</label>
              <input
                type="date"
                placeholder="Ngày sinh..."
                {...register("date_of_birth", { required: true })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.date_of_birth && (
                <p className="text-red-500">Thông tin bắt buộc</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="tel"
                placeholder="Số điện thoại..."
                maxLength={11}
                {...register("phone", { required: true })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.phone && (
                <p className="text-red-500">Thông tin bắt buộc</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Giới tính</label>
              <select
                {...register("gender", { required: true })}
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
                <p className="text-red-500">Thông tin bắt buộc</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Chức vụ</label>
              <input
                type="text"
                placeholder="Chức vụ..."
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
                placeholder="Ngày vào làm..."
                {...register("hire_date", { required: true })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.hire_date && (
                <p className="text-red-500">Thông tin bắt buộc</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="Email..."
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
                placeholder="Lương cơ bản..."
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
            className="bg-[#1D2A48] text-white font-semibold py-2 px-7 rounded-lg absolute right-4 my-3"
          >
            Thêm
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStaff;
