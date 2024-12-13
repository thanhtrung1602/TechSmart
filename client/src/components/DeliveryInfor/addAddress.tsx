import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useProvince from "~/hooks/useProvince";
import Province from "~/models/Province";
import District from "~/models/District";
import Ward from "~/models/Ward";
import { RootState } from "~/redux/store";
import { setAddAddressData, setAddressData } from "~/redux/addressSlice";
import Address from "~/models/Address";
import useGet from "~/hooks/useGet";

type objCommon = {
  code: string | number | undefined;
  name: string | undefined;
};

export default function AddAddress() {
  const userProfile = useSelector(
    (state: RootState) => state.userProfile.userProfile
  );
  const dispatch = useDispatch();
  const { addAddressData } = useSelector((state: RootState) => state.address);
  const { data: address } = useGet<Address[]>(
    `address/getAddressesByUser/${userProfile?.id}`
  );
  const [province, setProvince] = useState<objCommon>({
    code: 0,
    name: "",
  });
  const [district, setDistrict] = useState<objCommon>({
    code: 0,
    name: "",
  });
  const [ward, setWard] = useState<string | null>(null);
  const [street, setStreet] = useState<string | undefined>("");
  const [name, setName] = useState<string | undefined>("");
  const [phone, setPhone] = useState<string>("");

  useEffect(() => {
    setName(userProfile?.fullname);
    setPhone(String(userProfile?.phone));
  }, [userProfile]);

  // gọi địa chỉ
  const { data: provinces } = useProvince<Province[]>("/province/");

  const { data: districts } = useProvince<District[]>(
    `/province/district/${province?.code}`,
    {
      enabled: !!province?.code,
    }
  );

  const { data: wards } = useProvince<Ward[]>(
    `/province/ward/${district?.code}`,
    {
      enabled: !!district?.code,
    }
  );

  useEffect(() => {
    if (address?.length === 0) {
      dispatch(setAddAddressData(true));
    }
    if (addAddressData || address?.length === 0) {
      const data = {
        province: {
          code: province.code,
          name: province.name,
        },
        name: name,
        phone: phone,
        ward: ward,
        district: {
          code: district.code,
          name: district.name,
        },
        street: street,
        userId: userProfile?.id,
      };
      dispatch(setAddressData(data));
    }
  }, [
    addAddressData,
    dispatch,
    province,
    district,
    street,
    userProfile,
    name,
    ward,
    phone,
    address,
  ]);

  return (
    <div className="p-6 rounded-lg">
      <div className="space-y-4">
        {/* Name and Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-500 text-xs mb-2">
              TÊN NGƯỜI NHẬN
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm placeholder-gray-400"
              placeholder="Nhập họ và tên"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs mb-2">
              SĐT NGƯỜI NHẬN
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm placeholder-gray-400"
              placeholder="Nhập số điện thoại"
            />
          </div>
        </div>

        {/* Province, District, Ward */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tỉnh/Thành Phố
            </label>
            <select
              value={province.code || ""}
              className="block w-full mt-1 p-2 rounded-md bg-white border border-gray-400 hover:border-black focus:border-black"
              onChange={(e) => {
                const findProvince = provinces?.find((p) => {
                  return p.province_id.toString() === e.target.value;
                });
                setProvince({
                  code: findProvince?.province_id,
                  name: findProvince?.province_name,
                });
              }}
            >
              <option value="" disabled selected hidden>
                {"Chọn Tỉnh/Thành Phố"}
              </option>
              {provinces?.map((province) => (
                <option key={province.province_id} value={province.province_id}>
                  {province.province_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quận/Huyện
            </label>
            <select
              value={district.code || ""}
              className="block w-full mt-1 p-2 rounded-md bg-white border border-gray-400 hover:border-black focus:border-black"
              disabled={province.code === 0}
              onChange={(e) => {
                const findDistrict = districts?.find(
                  (d) => d.district_id.toString() === e.target.value
                );
                setDistrict({
                  code: findDistrict?.district_id,
                  name: findDistrict?.district_name,
                });
              }}
            >
              {province.code === 0 && (
                <option value="" disabled selected hidden>
                  {"Quận/Huyện"}
                </option>
              )}
              {districts?.map((district) => (
                <option key={district.district_id} value={district.district_id}>
                  {district.district_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ward and Street */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phường/Xã
            </label>
            <select
              value={ward || ""}
              className="block w-full mt-1 p-2 rounded-md bg-white border border-gray-400 hover:border-black focus:border-black"
              disabled={district.code === 0}
              onChange={(e) => setWard(e.target.value)}
            >
              <option value="" disabled selected hidden>
                {"Phường/Xã"}
              </option>
              {wards?.map((ward) => (
                <option key={ward.ward_id} value={ward.ward_name}>
                  {ward.ward_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số nhà, tên đường
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="block w-full mt-1 p-2 rounded-md bg-white border border-gray-400 hover:border-black focus:border-black"
              placeholder="Số nhà, tên đường"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
