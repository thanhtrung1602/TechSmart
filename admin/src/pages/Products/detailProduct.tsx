import useGet from "~/hooks/useGet.tsx";
import Products from "~/models/Products.ts";
import ValueAttribute from "~/models/ValueAttribute.ts";
import Image from "~/components/Image";
import AttributeColorRom from "~/components/AttributeColorRom";
import currencyFormat from "~/components/CurrencyFormat";

export default function DetailProduct({ id }: { id: number }) {
  const { data: productDetail } = useGet<Products>(
    `/products/getOneProductById/${id}`
  );
  const { data: attributeValue } = useGet<ValueAttribute[]>(
    `/valueAttribute/getOneValueAttributeById/${productDetail?.id}`
  );

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

  return (
    <div className="px-4 py-6 bg-white max-h-screen w-[80vw]">
      {/* Two-Column Layout */}
      <div className="flex gap-6">
        {/* Left Column - Basic Info */}
        <div className="w-1/3 my-4  pb-4">
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
            <div className="">
              <span className="inline-block px-2 py-1 text-red-600 rounded-md text-base font-semibold">
                {productDetail.price?.toLocaleString("vi-VN")}₫
              </span>
              <span className="inline-block px-2 py-1 text-gray-400 rounded-md text-sm font-medium line-through">
                {currencyFormat({
                  paramFirst: productDetail.price,
                  paramSecond: productDetail.discount,
                })}
                đ₫
              </span>
            </div>
          </div>
          <AttributeColorRom
            attributeValue={attributeValue || []}
            productDetail={productDetail}
          />
          {/* Additional Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Ngày Thêm</p>
              <p className="font-medium text-gray-900">
                {new Date(productDetail.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Danh Mục</p>
              <p className="font-medium text-gray-900">
                {productDetail.categoryData.name || "Điện Tử"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Mã Sản Phẩm</p>
              <p className="font-medium text-gray-900">
                PRD-{productDetail.id}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Attributes and Additional Details */}
        <div className="w-2/3 space-y-4 h-full overflow-scroll">
          {/* Product Specifications */}
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h3 className="font-medium text-gray-900">Thông Số Kỹ Thuật</h3>
          </div>
          <div className="w-full overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {attributeValue &&
                attributeValue
                  .filter((valueAttribute) => {
                    if (
                      productDetail.categoryId === 2 ||
                      productDetail.categoryId === 3
                    ) {
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
                  })
                  ?.map((attr) => (
                    <div className="divide-y divide-gray-200 border p-1">
                      <div
                        key={attr.id}
                        className="flex justify-between px-4 py-2 hover:bg-gray-50"
                      >
                        <div className="text-sm font-medium text-gray-500">
                          {attr.attributeData.name}
                        </div>
                        <div className="text-sm text-gray-900">
                          {attr.value}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
