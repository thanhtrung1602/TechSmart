import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import usePost from "~/hooks/usePost";
import useProvince from "~/hooks/useProvince";
import District from "~/models/District";
import Province from "~/models/Province";
import Ward from "~/models/Ward";
import DataAddress from "~/types/dataStore";

function AddStore() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataAddress>();

  // 3. Khởi tạo hook usePost để gửi dữ liệu API
  const { mutate: mutateStore } = usePost();

  // 4. Khởi tạo state cho các giá trị province, district, ward
  const [province, setProvince] = useState<
    | {
        code: string | undefined;
        name: string | undefined;
      }
    | undefined
  >(undefined);

  const [district, setDistrict] = useState<
    | {
        code: string | undefined;
        name: string | undefined;
      }
    | undefined
  >(undefined);

  const [ward, setWard] = useState<string | undefined>("");

  // 5. Lấy dữ liệu tỉnh từ API
  const { data: provinces } = useProvince<Province[]>("/province/");

  // 6. Lấy dữ liệu quận khi tỉnh đã được chọn
  const { data: districts } = useProvince<District[]>(
    `/province/district/${province?.code}`,
    {
      enabled: !!province?.code, // Chỉ gọi API khi có tỉnh đã chọn
    }
  );

  // 7. Lấy dữ liệu phường khi quận đã được chọn
  const { data: wards } = useProvince<Ward[]>(
    `/province/ward/${district?.code}`,
    {
      enabled: !!district?.code, // Chỉ gọi API khi có quận đã chọn
    }
  );

  // 8. Hàm xử lý thay đổi tỉnh
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const findProvince = provinces?.find((p) => {
      return p.province_id.toString() === e.target.value;
    });
    setProvince({
      code: findProvince?.province_id,
      name: findProvince?.province_name,
    });
    setDistrict(undefined); // Reset quận khi thay đổi tỉnh
    setWard(undefined); // Reset phường khi thay đổi tỉnh
  };

  // 9. Hàm xử lý thay đổi quận
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const findDistrict = districts?.find((d) => {
      return d.district_id.toString() === e.target.value;
    });
    setDistrict({
      code: findDistrict?.district_id,
      name: findDistrict?.district_name,
    });
    setWard(undefined); // Reset phường khi thay đổi quận
  };

  // 10. Hàm xử lý thay đổi phường
  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWard(e.target.value);
  };

  // 11. Hàm xử lý gửi biểu mẫu
  const onSubmit = (data: DataAddress) => {
    mutateStore(
      {
        url: "/store/createStore",
        data: {
          province: province,
          district: district,
          ward: ward,
          street: data.street,
          phone: data.phone,
          codeStore: data.codeStore,
        },
      },
      {
        // 12. Xử lý khi gửi thành công
        onSuccess: (response) => {
          if (response.status === 200) {
            toast.success("Sản phẩm đã được thêm thành công");
            navigate("/store");
            window.location.reload();
          }
        },
        // 13. Xử lý khi có lỗi khi gửi dữ liệu
        onError: (error) => {
          console.error("Error adding store:", error);
          toast.error("Có lỗi xảy ra khi thêm sản phẩm");
        },
      }
    );
  };

  return (
    <div>
      <div className="min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Thêm sản phẩm</h1>
        {/* 14. Form thêm cửa hàng */}
        <form
          onSubmit={handleSubmit(onSubmit)} // Xử lý khi gửi form
          className="min-h-[600px] border rounded-lg p-6 bg-white relative"
        >
          {/* 15. Phần hiển thị tên form */}
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-[13px] text-white font-medium rounded-full w-5 h-5 flex items-center justify-center border border-black bg-[#1B253C]">
              1
            </span>
            <h2 className="text-lg font-semibold">Sản phẩm</h2>
          </div>

          {/* 16. Phần nhập dữ liệu với các dropdown cho Province, District, Ward */}
          <div className="grid grid-cols-4 gap-6">
            {/* 17. Dropdown chọn Tỉnh/Thành phố */}
            <div>
              <label className="block text-gray-700 mb-2">Tỉnh/Thành phố</label>
              <select
                className="w-full p-2 border border-gray-300 rounded bg-white"
                onChange={handleProvinceChange}
              >
                <option>Tỉnh/Thành phố</option>
                {provinces &&
                  provinces?.map((province) => (
                    <option
                      key={province.province_id}
                      value={province.province_id}
                    >
                      {province.province_name}
                    </option>
                  ))}
              </select>
              {errors.province && (
                <p className="text-red-500">Tỉnh/Thành phố là bắt buộc</p>
              )}
            </div>

            {/* 18. Dropdown chọn Quận/Huyện */}
            <div>
              <label className="block text-gray-700 mb-2">Quận/Huyện</label>
              <select
                className="w-full p-2 border border-gray-300 rounded bg-white"
                onChange={handleDistrictChange}
                disabled={!province}
              >
                <option>Quận/Huyện</option>
                {districts &&
                  districts?.map((district) => (
                    <option
                      key={district.district_id}
                      value={district.district_id}
                    >
                      {district.district_name}
                    </option>
                  ))}
              </select>
              {errors.district && (
                <p className="text-red-500">Quận/Huyện là bắt buộc</p>
              )}
            </div>

            {/* 19. Dropdown chọn Phường/Xã */}
            <div>
              <label className="block text-gray-700 mb-2">Phường/Xã</label>
              <select
                className="w-full p-2 border border-gray-300 rounded bg-white"
                onChange={handleWardChange}
                disabled={!district}
              >
                <option>Phường/Xã</option>
                {wards &&
                  wards?.map((ward) => (
                    <option key={ward.ward_id} value={ward.ward_name}>
                      {ward.ward_name}
                    </option>
                  ))}
              </select>
              {errors.ward && (
                <p className="text-red-500">Phường/Xã là bắt buộc</p>
              )}
            </div>

            {/* 20. Trường nhập liệu cho Street */}
            <div>
              <label className="block text-gray-700 mb-2">Đường</label>
              <input
                type="text"
                placeholder="Đường..."
                {...register("street", { required: true })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.street && (
                <p className="text-red-500">Đường là bắt buộc</p>
              )}
            </div>

            {/* 21. Trường nhập liệu cho Phone */}
            <div>
              <label className="block text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="text"
                placeholder="Số điện thoại..."
                {...register("phone", { required: true })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.phone && (
                <p className="text-red-500">Số điện thoại là bắt buộc</p>
              )}
            </div>

            {/* 22. Trường nhập liệu cho CodeStore */}
            <div>
              <label className="block text-gray-700 mb-2">Mã cửa hàng</label>
              <input
                type="text"
                placeholder="Mã cửa hàng..."
                {...register("codeStore", { required: true })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.codeStore && (
                <p className="text-red-500">Mã cửa hàng là bắt buộc</p>
              )}
            </div>
          </div>

          {/* 23. Nút Thêm cửa hàng */}
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

export default AddStore;
