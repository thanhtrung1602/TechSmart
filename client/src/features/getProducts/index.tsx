import { Link } from "react-router-dom";
import Image from "~/components/Image";
import SwiperCarousel from "~/components/Swiper";
import Products from "~/models/Products";
import Variants from "~/models/Variants";
import currencyFormat from "~/components/CurrencyFormat";

type PropProducts = {
  products: Products[];
  variants?: Variants[];
  breakpoints?: {
    [key: number]: {
      slidesPerView: number;
    };
  };
  spaceBetween: number;
  pagination: boolean;
  navigation: boolean;
  className?: string;
};

function GetProducts({
  products,
  variants,
  breakpoints,
  spaceBetween,
  pagination = true,
  navigation = true,
  className,
}: PropProducts) {
  return (
    <>
      <SwiperCarousel<Products>
        items={products}
        className={className}
        breakpoints={breakpoints}
        spaceBetween={spaceBetween}
        pagination={pagination}
        navigation={navigation}
      >
        {(product) => {
          // Tìm variant tương ứng với sản phẩm
          const variant = variants?.find(
            (variant) => variant.productId === product.id
          );

          // Nếu không tìm thấy variant cho sản phẩm, thì bỏ qua
          if (!variant) return null;

          return (
            <div className="flex flex-col justify-between relative p-4 rounded-lg bg-white shadow hover:shadow-md duration-300 overflow-hidden select-none ">
              {/* Dải giảm giá */}
              {product.discount > 0 && (
                <span className="absolute top-0 left-0 rounded-tr-full rounded-br-full px-4 text-white text-xs font-semibold py-[6px] bg-[#eb3e32] z-10 ">
                  Giảm {product.discount}%
                </span>
              )}

              {/* Link sản phẩm */}
              <Link
                to={`/product/${product.categoryData.slug}/${product.slug}`}
              >
                {/* Hình ảnh sản phẩm */}
                <div className="h-48 mb-2 flex justify-center items-center rounded-lg bg-white image-container overflow-hidden box-border">
                  <Image
                    src={product.img}
                    fallbackSrc="/fallback-product.jpg"
                    alt="Image Product"
                    className="size-[73%] md:size-3/4 mx-auto object-cover"
                  />
                </div>

                {/* Tên sản phẩm */}
                <p className="line-clamp-2 font-medium text-sm pt-1 text-gray-800 hover:text-red-500 duration-200 h-12">
                  {product.name}
                </p>
              </Link>

              {/* Thông tin bổ sung */}
              <div className="flex items-center text-xs text-gray-500 mt-1 h-4">
                <span className="mr-2">
                  Thương hiệu: {product.manufacturerData.name}
                </span>
              </div>

              {/* Giá sản phẩm */}
              <div className="mt-2 flex flex-col flex-grow">
                {product.discount > 0 && (
                  <span className="text-xs md:text-sm text-gray-500 line-through">
                    {currencyFormat({
                      paramFirst: variant.price,
                      paramSecond: product.discount,
                    })}
                  </span>
                )}
                <span className="font-semibold text-base md:text-lg text-red-600">
                  {variant.price.toLocaleString()}đ
                </span>
                {product.discount > 0 && (
                  <span className="text-[0.7rem] md:text-xs text-green-600">
                    Giảm{" "}
                    {(
                      Math.round(
                        variant.price / (1 - product.discount / 100) / 1000
                      ) *
                        1000 -
                      variant.price
                    ).toLocaleString()}
                    đ
                  </span>
                )}
              </div>

              {/* Thông tin tồn kho */}
              <div className="text-xs text-gray-600 mt-2">
                <span className="mr-2">Tồn kho: {variant.stock}</span>
              </div>
            </div>
          );
        }}
      </SwiperCarousel>
    </>
  );
}

export default GetProducts;
