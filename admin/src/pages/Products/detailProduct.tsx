import useGet from "~/hooks/useGet.tsx";
import Products from "~/models/Products.ts";
import ValueAttribute from "~/models/ValueAttribute.ts";
import Image from "~/components/Image";
// import AttributeColorRom from "~/components/AttributeColorRom";
// import currencyFormat from "~/components/CurrencyFormat";
import { useState } from "react";
import Variants from "~/models/Variants";

export default function DetailProduct({ id }: { id: number }) {
  const { data: productDetail } = useGet<Products>(
    `/products/getOneProductById/${id}`
  );
  const { data: attributeValue } = useGet<ValueAttribute[]>(
    `/valueAttribute/getOneValueAttributeById/${productDetail?.id}`
  );

  const { data: getAllVariantByProductId } = useGet<Variants[]>(
    `/variants/getAllVariantByProductId/${id}`
  );

  const [activeTab, setActiveTab] = useState("Thông tin");

  if (!productDetail) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
          <p className="text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  const filteredAttributeValue = attributeValue?.filter((valueAttribute) => {
    if (productDetail.categoryId === 2 || productDetail.categoryId === 3) {
      return (
        valueAttribute.attributeData.id !== 4 &&
        valueAttribute.attributeData.id !== 29 &&
        valueAttribute.attributeData.id !== 6
      );
    }
    return (
      valueAttribute.attributeData.id !== 4 &&
      valueAttribute.attributeData.id !== 29
    );
  });

  return (
    <div className="px-4 py-6 bg-white max-h-screen w-[80vw]">
      {/* Tabbed Navigation */}
      <div className="border-b">
        <nav className="flex">
          <button
            className={`px-4 py-2  ${
              activeTab === "Thông tin"
                ? "bg-gray-100 border-b-2 border-indigo-500  font-semibold"
                : "hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("Thông tin")}
          >
            Thông tin
          </button>
          <button
            className={`px-4 py-2  ${
              activeTab === "Chi tiết"
                ? "bg-gray-100 border-b-2 border-indigo-500 font-semibold"
                : "hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("Chi tiết")}
          >
            Chi tiết
          </button>
        </nav>
      </div>

      {/* Content Based on Active Tab */}
      <div className="content">
        {activeTab === "Thông tin" ? (
          <div className="flex  gap-10">
            <div className="w-1/3 my-4 pb-4">
              {/* Product Image */}
              <div className="aspect-square w-48 mx-auto overflow-hidden">
                <Image
                  src={productDetail.img}
                  alt={productDetail.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Name and Price */}
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {productDetail.name}
                </h2>
              </div>
            </div>

            <div className="w-2/3 space-y-4 h-full overflow-scroll">
              <div className="px-4 py-3 bg-gray-50 border-b">
                <h3 className="font-medium text-gray-900">Thông Số Kỹ Thuật</h3>
              </div>
              <div className="w-full overflow-hidden">
                <table className="w-full  border border-gray-300 border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-center border border-gray-300 w-1/4">
                        Size
                      </th>
                      <th className="text-left px-4 py-2 font-medium text-center border border-gray-300 w-1/4">
                        Màu sắc
                      </th>
                      <th className="text-left px-4 py-2 font-medium text-center border border-gray-300 w-1/4">
                        Số lượng
                      </th>
                      <th className="text-left px-4 py-2 font-medium text-center border border-gray-300 w-1/4">
                        Giá
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getAllVariantByProductId?.map((variant) => (
                      <ProductVariant
                        key={variant.id}
                        id={variant.id}
                        stock={variant.stock}
                        price={variant.price}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 h-full overflow-scroll">
            {/* Product Specifications */}
            <div className="px-4 py-3 bg-gray-50 border-b">
              <h3 className="font-medium text-gray-900">Thông Số Kỹ Thuật</h3>
            </div>
            <div className="w-full overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {filteredAttributeValue?.map((attr) => (
                  <div
                    className="divide-y divide-gray-200 border p-1"
                    key={attr.id}
                  >
                    <div className="flex justify-between px-4 py-2 hover:bg-gray-50">
                      <div className="text-sm font-medium text-gray-500">
                        {attr.attributeData.name}
                      </div>
                      <div className="text-sm text-gray-900">{attr.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ProductVariant = ({
  id,
  stock,
  price,
}: {
  id: number;
  stock: number;
  price: number;
}) => {
  const { data: attributeValue } = useGet<ValueAttribute[]>(
    `/valueAttribute/getAttributeValueByVariant/${id}`
  );

  const colorAttributes = attributeValue?.filter(
    (attr) => attr.attributeData.name === "Màu sắc"
  );
  const sizeAttributes = attributeValue?.filter(
    (attr) => attr.attributeData.name === "ROM"
  );

  return (
    <tr>
      <td className="px-4 py-2 border text-center border-gray-300 align-top">
        {sizeAttributes?.map((attr) => (
          <div key={attr.id} className="text-sm  text-gray-900">
            {attr.value}
          </div>
        ))}
      </td>
      <td className="px-4 py-2 border text-center border-gray-300 align-top">
        {colorAttributes?.map((attr) => (
          <div key={attr.id} className="text-sm text-gray-900">
            <div
              className="border w-[20px] h-[20px] rounded-full"
              style={{ backgroundColor: attr.value }}
            ></div>
          </div>
        ))}
      </td>
      <td className="px-4 py-2 border text-center border-gray-300 align-top">
        <div className="text-sm text-gray-900">
          <p>{stock}</p>
        </div>
      </td>

      <td className="px-4 py-2 border text-center border-gray-300 align-top">
        <div className="text-sm text-gray-900">
          <p>{price}</p>
        </div>
      </td>
    </tr>
  );
};
