import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGet from "~/hooks/useGet";
import useProvince from "~/hooks/useProvince";
import District from "~/models/District";
import { IStore2 } from "~/models/Store";
import { setSelectIdStore } from "~/redux/addressSlice";
import { RootState } from "~/redux/store";
type objCommon = {
  code: string | number | undefined;
  name: string | undefined;
};

export default function DeliveryStore() {
  const dispatch = useDispatch();
  const { resultValueStock, selectIdStore } = useSelector(
    (state: RootState) => state.address
  );
  const { data: storeProducts } = useGet<IStore2[]>(`/store/findAll`);

  const [codeDistrict, setCodeDistrict] = useState<objCommon>({
    code: 0,
    name: "",
  });

  const provinceId = 79;
  const { data: districts } = useProvince<District[]>(
    `/province/district/${provinceId}`,
    {
      enabled: !!provinceId,
    }
  );

  const filteredStores = storeProducts?.filter((store) => {
    const matchesDistrict =
      codeDistrict.code === 0 ||
      Number(codeDistrict.code) === Number(store?.district?.id);
    console.log(matchesDistrict);
    console.log("tessstttt1: ", store?.district?.id);
    console.log("tessstttt2: ", codeDistrict.code);
    return matchesDistrict;
  });

  return (
    <div className="space-y-4 px-4">
      {/* Tỉnh/Thành phố */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          TỈNH / THÀNH PHỐ
        </label>
        <select className="w-full p-2.5 bg-white text-sm border border-gray-200 rounded focus:outline-none sm:text-base sm:p-3">
          <option>Hồ Chí Minh</option>
        </select>
      </div>

      {/* Quận/Huyện */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quận/Huyện
        </label>
        <select
          className="w-full p-2.5 bg-white text-sm border border-gray-200 rounded focus:outline-none sm:text-base sm:p-3"
          onChange={(e) => {
            const selectedValue = e.target.value;
            if (selectedValue === "") {
              setCodeDistrict({ code: 0, name: "" });
            } else {
              const findDistrict = districts?.find(
                (d) => d.district_id.toString() === selectedValue
              );
              setCodeDistrict({
                code: findDistrict?.district_id,
                name: findDistrict?.district_name,
              });
            }
          }}
        >
          <option value="">Tất cả</option>
          {districts?.map((district) => (
            <option key={district?.district_id} value={district?.district_id}>
              {district?.district_name}
            </option>
          ))}
        </select>
      </div>

      {/* Cửa hàng */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">CỬA HÀNG</label>
        <select
          onChange={(e) => dispatch(setSelectIdStore(e.target.value))}
          className="w-full bg-white p-2.5 text-sm border border-gray-200 rounded focus:outline-none sm:text-base sm:p-3"
        >
          <option>Chọn địa chỉ cửa hàng</option>
          {filteredStores?.map((store) => (
            <option key={store.id} value={store.id}>
              {store?.street}, {store?.ward}, {store?.district?.name},{" "}
              {store?.province?.name}
            </option>
          ))}
        </select>
        {selectIdStore !== 0 && (
          <div className="text-[#d97706] text-sm flex justify-end">
            {!resultValueStock.stock && (
              <span className="text-[#d97706]">
                {resultValueStock.deliveryTime}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Ghi chú */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Ghi chú khác (nếu có)
        </label>
        <input
          type="text"
          className="w-full p-2.5 bg-white text-sm border border-gray-200 rounded focus:outline-none placeholder-gray-400 sm:text-base sm:p-3"
          placeholder="Nhập ghi chú"
        />
      </div>
    </div>
  );
}
