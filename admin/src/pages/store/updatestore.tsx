import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useGet from "~/hooks/useGet";
import useProvince from "~/hooks/useProvince";
import usePut from "~/hooks/usePut";
import Loading from "~/layouts/components/Loading";
import District from "~/models/District";
import Province from "~/models/Province";
import InterStore from "~/models/Store";
import Ward from "~/models/Ward";

interface FormData {
  street: string;
  ward: string;
  district: {
    code: string;
    name: string;
  };
  province: {
    code: string;
    name: string;
  };
  phone: number;
  codeStore: string;
}

function UpdateStore() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const { mutate: mutateStore } = usePut();
  const { id } = useParams(); // Lấy id dưới dạng chuỗi từ URL
  const [isLoading, setLoading] = useState(false);
  const [province, setProvince] = useState<
    { id: string | undefined; name: string | undefined } | undefined
  >(undefined);
  const [district, setDistrict] = useState<
    { id: string | undefined; name: string | undefined } | undefined
  >(undefined);
  const [ward, setWard] = useState<string | undefined>("");

  const { data: provinces } = useProvince<Province[]>("/province/");
  const { data: districts } = useProvince<District[]>(
    `/province/district/${province?.id}`
  );
  const { data: wards } = useProvince<Ward[]>(`/province/ward/${district?.id}`);

  const storeId = Number(id);
  const navigate = useNavigate();

  const { data: store, error } = useGet<InterStore>(`/store/findOne/${storeId}`);
  console.log(store);

  useEffect(() => {
    if (store) {
      setValue("street", store.street);
      setValue("ward", store.ward);
      setValue("district", store.district);
      setValue("province", store.province);
      setValue("phone", store.phone);
      setValue("codeStore", store.codeStore);

      setProvince({ id: store.province.id, name: store.province.name });
      setDistrict({ id: store.district.id, name: store.district.name });
      setWard(store.ward);
    }
    if (error) {
      console.error("Error fetching store:", error);
    }
  }, [store, error, setValue]);

  const onSubmit = (data: FieldValues) => {
    setLoading(true);
    try {
      mutateStore(
        {
          url: `/store/updateStore/${id}`, // Sử dụng ID từ URL
          data: {
            street: data.street,
            ward,
            district: district,
            province: province,
            phone: data.phone,
            codeStore: data.codeStore,
          }, // Truyền FormData object
        },
        {
          onSuccess: async (response) => {
            console.log("store updated successfully", response.data);
            toast.success(" cập nhật thành công");
            navigate("/store");
            window.location.reload();
          },
          onError: (error) => {
            console.error("Error updating manufacture:", error);
            toast.error("Có lỗi xảy ra khi cập nhật ");
          },
        }
      );
    } catch (error) {
      console.error("Error updating store:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const findProvince = provinces?.find((p) => {
      return p.province_id.toString() === e.target.value;
    });
    setProvince({
      id: findProvince?.province_id,
      name: findProvince?.province_name,
    });
    setDistrict(undefined);
    setWard(undefined);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const findDistrict = districts?.find((d) => {
      return d.district_id.toString() === e.target.value;
    });
    setDistrict({
      id: findDistrict?.district_id,
      name: findDistrict?.district_name,
    });
    setWard(undefined);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWard(e.target.value);
  };

  return (
    <div>
      <div className="min-h-screen">
        {isLoading && <Loading />}
        <h1 className="text-2xl font-bold mb-6">Thêm cửa hàng</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-h-[600px] border rounded-lg p-6 bg-white relative"
        >
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-[13px] text-white font-medium rounded-full w-5 h-5 flex items-center justify-center border border-black bg-[#1B253C]">
              1
            </span>
            <h2 className="text-lg font-semibold">Cửa hàng</h2>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Tỉnh/Thành phố</label>
              <select
                value={province?.id}
                className="w-full p-2 border border-gray-300 rounded bg-white"
                onChange={handleProvinceChange}
              >
                <option value="">Tỉnh/Thành phố</option>
                {provinces &&
                  provinces?.length > 0 &&
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

            <div>
              <label className="block text-gray-700 mb-2">Quận/huyện</label>
              <select
                value={district?.id}
                className="w-full p-2 border border-gray-300 rounded bg-white"
                onChange={handleDistrictChange}
              >
                <option value="">Quận/huyện</option>
                {districts &&
                  districts?.length > 0 &&
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
                <p className="text-red-500">Quận/huyện là bắt buộc</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Phường/xã</label>
              <select
                value={ward}
                className="w-full p-2 border border-gray-300 rounded bg-white"
                onChange={handleWardChange}
              >
                <option value="">Phường/xã</option>
                {wards &&
                  wards?.length > 0 &&
                  wards?.map((ward) => (
                    <option key={ward.ward_id} value={ward.ward_name}>
                      {ward.ward_name}
                    </option>
                  ))}
              </select>
              {errors.ward && (
                <p className="text-red-500">Phường/xã là bắt buộc</p>
              )}
            </div>

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

            <div>
              <label className="block text-gray-700 mb-2">Mã cửa hàng</label>
              <input
                type="text"
                placeholder="Mã cửa hàng..."
                {...register("codeStore", { required: true })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.phone && (
                <p className="text-red-500">Mã cửa hàng là bắt buộc</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#1D2A48] text-white font-semibold py-2 px-7 rounded-lg absolute right-4 my-3"
          >
            Cập nhật
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateStore;
