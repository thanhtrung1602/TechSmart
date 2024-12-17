import { useCallback, useEffect, useState } from "react";
import { BsFillCartFill } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import useGet from "~/hooks/useGet";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import usePost from "~/hooks/usePost";
import { AppDispatch, RootState } from "~/redux/store";
import { addProduct, updateQuantity } from "~/redux/cartSlice";
import { useQueryClient } from "@tanstack/react-query";
import currencyFormat from "~/components/CurrencyFormat";
import GetProducts from "~/features/getProducts";
import Products from "~/models/Products";
import ValueAttribute from "~/models/ValueAttribute";
import CommentComponent from "~/components/Comment";
import StoreProduct from "~/components/store";
import AttributeColorRom from "~/components/AttributeColorRom";
import ProductImg from "~/components/ProductImg";
import Confirmed from "~/components/Confirmed";
import { getSmallestRom, parseCapacityValue } from "~/components/ConvertRom";
import Carts from "~/models/Carts";
import { AxiosError } from "axios";
import Description from "~/components/Description";
import Blog from "~/models/blog";
import useBlog from "~/hooks/useBlog";
import Loading from "~/layouts/components/Loading";
import { setPrice } from "~/redux/productSlice";
import Variants from "~/models/Variants";

function Product() {
  const { slugCategory, slugProduct } = useParams();
  const queryClient = useQueryClient();
  const [capacity, setCapacity] = useState(0);
  const [colors, setColors] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userProfile = useSelector(
    (state: RootState) => state.userProfile.userProfile
  );
  const cartProducts = useSelector(
    (state: RootState) => state.cart.cartProducts
  );

  const changePrice = useSelector(
    (state: RootState) => state.product.changePrice
  );

  // const stockStatus = useSelector(
  //   (state: RootState) => state.socket.stockStatus
  // );

  const { mutate } = usePost();

  const { data: products } = useGet<{ total: number; rows: Products[] }>(
    `/products/getProductCategory/${slugCategory}`
  );
  const { data: productDetail } = useGet<Products>(
    `/products/getOneProduct/${slugProduct}`
  );

  const { data: attributeValue, isLoading: isLoadPrice } = useGet<
    ValueAttribute[]
  >(`/valueAttribute/getOneValueAttributeById/${productDetail?.id}`);

  const sorted = [
    ...(attributeValue?.filter((item) => item.attributeId === 6) || []),
  ].sort((a, b) => {
    const capacityA = parseCapacityValue(a.value);
    const capacityB = parseCapacityValue(b.value);
    return capacityA - capacityB;
  });

  useEffect(() => {
    if (sorted.length > 0 && sorted[0]?.variantData?.price) {
      dispatch(setPrice(sorted[0].variantData.price.toLocaleString()));
    }
  }, [productDetail?.id, attributeValue, dispatch]);

  const { data: carts } = useGet<{ count: number; rows: Carts[] }>(
    `/cart/getAllCartByUserId/${userProfile?.id}`
  );

  console.log("Carts: ", carts);

  const { data: blogs } = useBlog<Blog[]>("/posts");
  console.log("Blogs: ", blogs);

  // Lấy ROM nhỏ nhất khi trang load nếu là điện thoại hoặc tablet
  useEffect(() => {
    if (slugCategory === "dien-thoai" || slugCategory === "tablet") {
      const smallestRom = getSmallestRom({
        attributeValue,
      });
      if (smallestRom) {
        setCapacity(smallestRom.id);
      }
    }
  }, [attributeValue, slugCategory]);

  // Xử lý lấy dữ liệu color và rom từ attributeValue
  const getColorAndRomFromAttributeValue = useCallback(() => {
    if (attributeValue && attributeValue?.length > 0) {
      const firstColor = attributeValue.find(
        (item) => item.attributeData.id === 4 || item.attributeData.id === 29
      );
      if (firstColor) setColors(firstColor.id);

      // Chỉ đặt dung lượng nếu là điện thoại hoặc tablet
      if (slugCategory === "dien-thoai" || slugCategory === "tablet") {
        const firstCapacity = attributeValue.find(
          (item) => item.attributeData.id === 6
        );
        if (firstCapacity) setCapacity(firstCapacity.id);
      }
    }
  }, [attributeValue, slugCategory]);

  // Gọi hàm này khi component load hoặc khi `attributeValue` và `slugCategory` thay đổi
  useEffect(() => {
    getColorAndRomFromAttributeValue();
  }, [getColorAndRomFromAttributeValue]);

  //Handle Color change
  const handleColorChange = (id: number) => {
    setColors(id);
  };

  //Handle Capacity change
  const handleCapacityChange = (id: number) => {
    setCapacity(id);
  };

  // Lấy thông tin màu sắc và dung lượng hiện tại từ attributeValue
  const selectedColor = attributeValue?.find(
    (item) =>
      (item.attributeData.id === 4 || item.attributeData.id === 29) &&
      item.id === colors
  );

  const selectedRomAsPhoneAndTablet = attributeValue?.find(
    (item) => item.attributeData.id === 6 && item.id === capacity
  );

  const selectedRom = attributeValue?.find(
    (item) => item.attributeData.id === 6
  );

  // Xác định giá dựa trên hệ số ROM
  const romValue = selectedRomAsPhoneAndTablet
    ? selectedRomAsPhoneAndTablet?.value
    : selectedRom?.value || null;

  const handleAddToCart = (
    product: Products,
    stockChecked: number,
    variantId: number,
    variantData: Variants | undefined,
    total: number
  ) => {
    if (userProfile && userProfile.ban === true) {
      toast.error("Tài khoản của bạn bị chặn");
      return;
    }

    if (stockChecked < 2) {
      toast.error("Sản phẩm này hết hàng!");
      return;
    }

    const stockProd = stockChecked || stockChecked - 2;
    const quantityProd = carts
      ? carts?.rows.find(
          (item) =>
            item.variantData.productId === product.id &&
            item.rom === romValue &&
            item.color === selectedColor?.value
        )
      : cartProducts.find(
          (item) =>
            item.id === product.id &&
            item.rom === romValue &&
            item.color === selectedColor?.value
        );

    if (quantityProd && quantityProd?.quantity + 1 > stockProd) {
      toast.error(`Sản phẩm chỉ còn ${stockProd} trong kho`);
      return;
    }

    // Đặt trạng thái loading là true khi bắt đầu
    setIsLoading(true);

    setTimeout(() => {
      if (userProfile) {
        // Dữ liệu cho cart
        const data: {
          userId: number;
          variantId: number;
          quantity: number;
          color: string | null;
          rom: string | null;
          total: number;
        } = {
          userId: userProfile.id,
          variantId: variantId,
          quantity: 1,
          color: selectedColor?.value || null,
          rom: romValue || null,
          total: total,
        };

        mutate(
          {
            url: "cart/createCart",
            data,
          },
          {
            onSuccess: (res) => {
              if (res.status === 200) {
                toast.success("Sản phẩm đã được cập nhật trong giỏ hàng.");
                queryClient.invalidateQueries({
                  queryKey: [`/cart/getAllCartByUserId/${userProfile.id}`],
                });
              }
            },
            onError: (error) => {
              if (error instanceof AxiosError) {
                const backendErrors = error.response?.data.error;
                if (backendErrors) {
                  toast.error(backendErrors);
                }
              }
            },
          }
        );
      } else {
        const productToAdd = {
          ...product,
          userId: null,
          quantity: 1, // Khởi tạo số lượng cho sản phẩm
          color: selectedColor?.value || null,
          variantData,
          variantId,
          rom: selectedRomAsPhoneAndTablet
            ? selectedRomAsPhoneAndTablet?.value
            : selectedRom?.value || null,
          total: product.price,
        };

        const existingProductIndex = cartProducts.findIndex(
          (item) =>
            item.id === productToAdd.id &&
            item.rom === productToAdd.rom &&
            item.color === productToAdd.color
        );

        if (existingProductIndex === -1) {
          // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
          dispatch(addProduct(productToAdd));
          toast.success("Sản phẩm đã được thêm vào giỏ hàng.");
        } else {
          const updatedProduct = {
            ...productToAdd,
            quantity: cartProducts[existingProductIndex].quantity + 1,
          };
          dispatch(
            updateQuantity({
              id: productToAdd.id,
              rom: productToAdd.rom,
              color: productToAdd.color,
              quantity: updatedProduct.quantity,
            })
          );
          toast.success("Sản phẩm đã được cập nhật trong giỏ hàng.");
        }
      }
      // Sau khi hoàn thành, tắt trạng thái loading
      setIsLoading(false);
    }, 1000);
  };

  const handleBuyNow = (
    product: Products,
    stockChecked: number,
    variantId: number,
    variantData: Variants | undefined,
    total: number
  ) => {
    if (userProfile && userProfile.ban === true) {
      toast.error("Tài khoản của bạn bị chặn");
      return;
    }

    if (stockChecked < 2) {
      toast.error("Sản phẩm này hết hàng!");
      return;
    }

    const stockProd = stockChecked || stockChecked - 2;
    const quantityProd = carts
      ? carts?.rows.find((item) => {
          console.log(item),
            item.variantData.productId === product.id &&
              item.rom === romValue &&
              item.color === selectedColor?.value;
        })
      : cartProducts.find(
          (item) =>
            item.id === product.id &&
            item.rom === romValue &&
            item.color === selectedColor?.value
        );

    if (quantityProd && quantityProd?.quantity + 1 > stockProd) {
      toast.error(`Sản phẩm chỉ còn ${stockProd} trong kho`);
      return;
    }

    // Đặt trạng thái loading là true khi bắt đầu
    setIsLoading(true);

    setTimeout(() => {
      if (userProfile) {
        // Dữ liệu cho cart
        const data: {
          userId: number;
          variantId: number;
          quantity: number;
          color: string | null;
          rom: string | null;
          total: number;
        } = {
          userId: userProfile.id,
          variantId: variantId,
          quantity: 1, // Luôn gửi số lượng 1, backend sẽ xử lý tăng số lượng
          color: selectedColor?.value || null,
          rom: romValue || null,
          total: total,
        };

        mutate(
          {
            url: "cart/createCart",
            data,
          },
          {
            onSuccess: (res) => {
              if (res.status === 200) {
                toast.success("Sản phẩm đã được cập nhật trong giỏ hàng.");
                queryClient.invalidateQueries({
                  queryKey: [`/cart/getAllCartByUserId/${userProfile.id}`],
                });
                navigate("/cart");
              }
            },
            onError: (error) => {
              console.log(error);
            },
          }
        );
      } else {
        const productToAdd = {
          ...product,
          userId: null,
          quantity: 1, // Khởi tạo số lượng cho sản phẩm
          variantData,
          variantId,
          color: selectedColor?.value || null,
          rom: selectedRomAsPhoneAndTablet
            ? selectedRomAsPhoneAndTablet?.value
            : selectedRom?.value || null,
          total: product.price,
        };

        const existingProductIndex = cartProducts.findIndex(
          (item) =>
            item.id === productToAdd.id &&
            item.rom === productToAdd.rom &&
            item.color === productToAdd.color
        );

        if (existingProductIndex === -1) {
          // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
          dispatch(addProduct(productToAdd));
          toast.success("Sản phẩm đã được thêm vào giỏ hàng.");
          navigate("/cart");
        } else {
          const updatedProduct = {
            ...productToAdd,
            quantity: cartProducts[existingProductIndex].quantity + 1,
          };
          dispatch(
            updateQuantity({
              id: productToAdd.id,
              rom: productToAdd.rom,
              color: productToAdd.color,
              quantity: updatedProduct.quantity,
            })
          );
          toast.success("Sản phẩm đã được cập nhật trong giỏ hàng.");
          navigate("/cart");
        }
      }

      // Sau khi hoàn tính, tắt trạng thái loading
      setIsLoading(false);
    }, 1000);
  };

  {
    isLoadPrice ? (
      <span>Loading...</span>
    ) : (
      <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#FF0000]">
        {sorted?.[0]?.variantData?.price.toLocaleString()}đ
      </span>
    );
  }

  const stockChecked = attributeValue?.find((item) => item?.variantData.stock);

  const variant = attributeValue?.find((item) => item?.variantId);

  console.log("adadadhhhhhhhhhhh ", variant);

  return (
    <>
      {isLoading && <Loading />}
      <section className="flex flex-col lg:flex-row justify-between lg:space-x-4 px-4 sm:px-8 md:px-20 lg:px-40 py-10 bg-white ">
        {productDetail && (
          <>
            <article className="lg:w-1/2 mb-6 lg:mb-0">
              {/* AnhSanPham */}
              <div className="flex flex-col sm:flex-row lg:flex-col lg:items-center px-4 sm:px-8 lg:px-10 pb-3 mx-2 lg:mx-10">
                <div className="w-full lg:w-[454px] flex flex-col justify-center gap-6">
                  <ProductImg id={productDetail.id} img={productDetail.img} />
                </div>
              </div>
              <hr className="my-7" />
              <Description />
            </article>
            <div className="lg:w-1/2">
              <span className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold mb-4">
                {productDetail.name}
              </span>

              <AttributeColorRom
                attributeValue={attributeValue || []}
                slugCategory={slugCategory || ""}
                colors={colors}
                capacity={capacity}
                handleColorChange={handleColorChange}
                handleCapacityChange={handleCapacityChange}
              />

              {/* Tien */}
              <div className="flex flex-col gap-y-2 p-4 sm:p-5 border border-gray-400 mb-4 rounded-lg">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#FF0000]">
                  {changePrice === 0 && sorted?.length
                    ? sorted?.[0]?.variantData?.price.toLocaleString()
                    : changePrice?.toLocaleString()}{" "}
                  đ
                </span>

                <p>
                  <span className="text-sm sm:text-base text-[#6C7275] line-through mr-3">
                    {currencyFormat({
                      paramFirst:
                        Number(changePrice) ||
                        Number(sorted?.[0]?.variantData?.price),
                      paramSecond: productDetail.discount,
                    })}
                    đ
                  </span>
                  <span className="text-sm sm:text-base text-red-500">
                    {productDetail.discount}%
                  </span>
                </p>
              </div>
              {/* Nutthaotac */}
              {stockChecked || 0 > 2 ? (
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    className="bg-[#eb3e32] px-3 py-3 rounded duration-300 hover:bg-red-600"
                    onClick={() => {
                      handleAddToCart(
                        productDetail,
                        Number(stockChecked?.variantData.stock),
                        Number(variant?.variantId),
                        variant?.variantData,
                        Number(variant?.variantData.price)
                      );
                    }}
                  >
                    <BsFillCartFill className="text-white text-xl sm:text-2xl" />
                  </button>
                  <button
                    className="flex-1 bg-[#eb3e32] px-8 py-2 sm:px-20 sm:h-12 rounded duration-300 hover:bg-red-600"
                    onClick={() => {
                      handleBuyNow(
                        productDetail,
                        Number(stockChecked?.variantData.stock),
                        Number(variant?.variantId),
                        variant?.variantData,
                        Number(variant?.variantData.price)
                      );
                    }}
                  >
                    <span className="text-sm sm:text-lg text-white">
                      Mua ngay
                    </span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Out of Stock Message */}
                  <div className="flex flex-col gap-y-2 p-5 border border-red-500 bg-red-100 mb-4 rounded text-center">
                    <span className="text-sm font-semibold text-red-600">
                      Sản phẩm hiện tại đang tạm hết hàng, quý khách có thể đặt
                      trước sản phẩm hoặc tham khảo sản phẩm tương tự!
                    </span>
                  </div>
                </>
              )}
              <StoreProduct id={productDetail.id} />
              <Confirmed />
            </div>
          </>
        )}
      </section>

      <section className="px-4 md:px-28 xl:px-40 ">
        <section className="mt-10 grid grid-cols-1  lg:grid-cols-3 gap-y-4 lg:gap-x-7 ">
          <CommentComponent id={productDetail?.id} />

          <div className="col-span-1 bg-white w-full p-4 rounded h-fit">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold mb-2">
                Thông số kĩ thuật
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full rounded-sm overflow-hidden">
                <tbody className="text-center">
                  {attributeValue &&
                    attributeValue
                      .filter((valueAttribute) => {
                        if (
                          slugCategory === "dien-thoai" ||
                          slugCategory === "tablet"
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
                      ?.map((valueAttribute) => (
                        <tr
                          key={valueAttribute.id}
                          className="odd:bg-[#ececec] font-medium text-sm sm:text-base"
                        >
                          <td className="w-2/5 py-2 text-[#6C7275]">
                            {valueAttribute.attributeData.name}
                          </td>
                          <td className="w-3/5 py-2 text-black">
                            {valueAttribute.value}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section className="bg-white p-4 sm:p-6 md:p-8 rounded-lg mt-10">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold pb-8">
            Sản Phẩm Cùng Loại
          </h2>
          <GetProducts
            products={products?.rows ?? []}
            breakpoints={{
              320: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            spaceBetween={20}
            pagination={true}
            navigation={true}
            className="relative group p-3"
          />
        </section>
      </section>
    </>
  );
}

export default Product;
