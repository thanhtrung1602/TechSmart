import Products from "~/models/Products";
import ValueAttribute from "~/models/ValueAttribute";

function AttributeColorRom({
  attributeValue,
  productDetail,
}: {
  attributeValue: ValueAttribute[];
  productDetail: Products;
}) {
  return (
    <>
      {attributeValue && attributeValue?.length > 0 && (
        <>
          {productDetail.categoryId === 2 || productDetail.categoryId === 3 ? (
            // Trường hợp cho điện thoại và tablet: Hiển thị một hàng màu sắc và dung lượng
            <div className="pt-4 pb-4 flex flex-col gap-4">
              {/* Nhãn cho Màu sắc */}
              <ColorProduct
                attributeValue={attributeValue}
                productDetail={productDetail}
              />

              {/* Nhãn cho Dung lượng */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">
                  Dung lượng:
                </span>
              </div>
              {/* Hiển thị tất cả dung lượng */}
              <div className="flex flex-wrap gap-2">
                {attributeValue?.map((item) => {
                  if (item.attributeData.id === 6) {
                    return (
                      <button
                        key={item.id}
                        className={`overflow-hidden flex items-center gap-x-3 p-2 border-[0.5px] border-[#8e8d8d] rounded`}
                      >
                        <span className="text-sm font-medium">
                          {item.value}
                        </span>
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ) : (
            // Trường hợp cho laptop: Hiển thị một hàng màu sắc duy nhất từ attributeValue
            <div className="pt-3 pb-4">
              {/* Nhãn cho Màu sắc */}
              <ColorProduct
                attributeValue={attributeValue}
                productDetail={productDetail}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default AttributeColorRom;

function ColorProduct({
  attributeValue,
}: {
  attributeValue: ValueAttribute[];
  productDetail: Products;
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500">Màu sắc:</span>
      </div>
      {/* Hiển thị tất cả màu sắc */}
      <div className="flex flex-wrap gap-2">
        {attributeValue?.map((item) => {
          if (item.attributeData.id === 4 || item.attributeData.id === 29) {
            return (
              <button
                key={item.id}
                className={`relative overflow-hidden flex items-center gap-x-3 p-1 border-[#ff3737] bg-[#ff373722] border-[2px] rounded-full`}
              >
                <span
                  className="size-8 text- rounded-full font-medium"
                  style={{ backgroundColor: item.value }}
                ></span>
              </button>
            );
          }
          return null;
        })}
      </div>
    </>
  );
}
