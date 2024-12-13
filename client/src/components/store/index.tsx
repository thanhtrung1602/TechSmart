import { useState } from "react";
import useGet from "~/hooks/useGet";
import useProvince from "~/hooks/useProvince";
import District from "~/models/District";

import Stock from "~/models/stock";

type objCommon = {
  code: string | number | undefined;
  name: string | undefined;
};

function StoreProduct({ id }: { id: number }) {
  const { data: storeProducts } = useGet<Stock[]>(
    `/stock/findAllByProductId/${id}`
  );

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
    // const matchesProvince =
    //   store.storeData?.province?.code === codeProvince.code;
    const matchesDistrict =
      codeDistrict.code === 0 ||
      store.storeData?.district?.code === codeDistrict.code;

    return matchesDistrict;
  });

  return (
    <section className="p-4 bg-[#f3f4f6] max-h-[465px] rounded-lg">
      <article>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Tỉnh/Thành Phố
            </label>
            <select className="block w-full mt-1 p-2 border bg-white border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Thành Phố Hồ Chí Minh</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Quận/Huyện
            </label>
            <select
              className="block w-full mt-1 p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <option
                  key={district?.district_id}
                  value={district?.district_id}
                >
                  {district?.district_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </article>
      <article className="scrollbar">
        <h2 className="py-2 text-black">
          Có {filteredStores?.length || 0} cửa hàng có hàng
        </h2>
        {filteredStores?.map((store) => (
          <div
            key={store.id}
            className="bg-white p-2 rounded-md mb-2 flex flex-col gap-1"
          >
            <span>
              {store?.storeData?.street}, {store?.storeData?.ward},{" "}
              {store?.storeData?.district?.name},{" "}
              {store?.storeData?.province.name}
            </span>
            <p className="text-[#d97706] text-sm flex justify-end">
              {store.stockProduct === 0 && "Đặt hàng lấy sau 3 - 5 ngày"}
            </p>
          </div>
        ))}
      </article>
    </section>
  );
}

export default StoreProduct;
