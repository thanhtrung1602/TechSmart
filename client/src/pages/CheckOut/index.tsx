import Image from "~/components/Image";
import NavCart from "~/layouts/components/NavCart";
import { useForm } from "react-hook-form";
import usePost from "~/hooks/usePost";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import handleBank from "~/services/bank";
import { useLocation, useNavigate } from "react-router-dom";
import OrderData from "~/types/dataOrder";
import { RootState } from "~/redux/store";
import useGet from "~/hooks/useGet";
import Address from "~/models/Address";
import toast from "react-hot-toast";
import Carts from "~/models/Carts";
import PaymentMethods from "~/models/PaymentMethods";
import DeleveryInfor from "~/components/DeliveryInfor";
import { CheckValueReturnTime } from "~/utils/deliveryTime.ts";
import calculatePriceByRom from "~/components/CalculatePriceByRom";
import { useQueryClient } from "@tanstack/react-query";
import { setResultValueStock } from "~/redux/addressSlice";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { AiOutlineInfoCircle } from "react-icons/ai";

function CheckOut() {
  dayjs.extend(customParseFormat);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userProfile = useSelector(
    (state: RootState) => state.userProfile.userProfile
  );

  const stockStatus = useSelector(
    (state: RootState) => state.socket.stockStatus
  );

  const [deliveryTime, setDeliveryTime] = useState<Date | null>(null);

  const {
    addressData,
    selectIdAddress,
    addAddressData,
    selectIdStore,
    deliveryType,
  } = useSelector((state: RootState) => state.address);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderData>();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    number | null
  >(null);

  const {
    selectedProducts,
    totalOriginalPrice,
    totalDiscountedPrice,
    totalDiscount,
  }: {
    selectedProducts: Carts[];
    totalOriginalPrice: number;
    totalDiscountedPrice: number;
    totalDiscount: number;
  } = location.state;

  useEffect(() => {
    if (selectedProducts?.length === 0) {
      navigate("/");
    }
  }, [selectedProducts, navigate]);

  const repurchaseProducts = location.state?.repurchaseProducts;

  const productsToDisplay: Carts[] = repurchaseProducts || selectedProducts;

  const { mutate } = usePost();

  const { data: paymentMethods } = useGet<PaymentMethods[]>(
    "/paymentMethod/findAllPaymentMethod"
  );

  const { data: address } = useGet<Address[]>(
    `address/getAddressesByUser/${userProfile?.id}`
  );

  useEffect(() => {
    const check = async () => {
      const productIds = productsToDisplay?.map(
        (product) => product.productData.id
      );

      const value = await CheckValueReturnTime(productIds, selectIdStore);

      const result =
        value.find((isStock) => isStock.stock === false) ||
        value.find((isStock) => isStock.stock === true);

      if (selectIdStore !== 0 && result?.stock === false) {
        setDeliveryTime(dayjs(result?.deliveryDate, "DD/MM/YYYY").toDate());
      } else {
        const deliveryDate = dayjs(result?.deliveryDate).format(
          "HH:mm DD/MM/YYYY"
        );
        const fixTime = dayjs(deliveryDate, "HH:mm DD/MM/YYYY").toDate();
        setDeliveryTime(fixTime);
      }

      dispatch(setResultValueStock(result));
    };

    check();
  }, [productsToDisplay, dispatch, selectIdStore]);

  //Tạo đơn hàng
  const createdOrder = (
    userId: number,
    addressId: number | null,
    paymentMethodId: number,
    totalDiscountedPrice: number,
    phone: number,
    cart: Carts[],
    storeId: number | null,
    delivery_method: string,
    deliveryDate: Date | null
  ) => {
    try {
      // Gửi yêu cầu tạo đơn hàng
      mutate(
        {
          url: "/orders/createOrder",
          data: {
            userId,
            addressId,
            phone,
            total: totalDiscountedPrice,
            statusId: 1,
            paymentMethodId,
            storeId: storeId,
            delivery_method,
            statusPayId: 1,
            deliveryDate,
          },
        },
        {
          onSuccess: (response) => {
            if (response.status === 200 && response.data.newOrder) {
              console.log("Order created successfully: ", response);
              const orderId = response.data.newOrder.id;

              // Nếu đơn hàng được tạo thành công, tiếp tục tạo chi tiết đơn hàng
              if (orderId && cart?.length > 0) {
                cart.forEach((cartItem) => {
                  if (!cartItem.id) return;

                  const detailOrder = {
                    orderId,
                    productId: cartItem.productData.id,
                    quantity: Number(cartItem.quantity),
                    total: cartItem.total,
                    color: cartItem.color,
                    size: cartItem.rom,
                  };

                  // Gửi yêu cầu tạo chi tiết đơn hàng
                  mutate(
                    {
                      url: "/orderdetails/createOrderDetail",
                      data: detailOrder,
                    },
                    {
                      onSuccess: (detailResponse) => {
                        if (detailResponse.status === 200) {
                          console.log(
                            "Order detail created successfully: ",
                            detailResponse
                          );
                          queryClient.invalidateQueries({
                            queryKey: [
                              `/orderdetails/getAllOrderDetailByOrderId/${orderId}`,
                            ],
                          });

                          // Xử lý thanh toán sau khi tạo thành công chi tiết đơn hàng
                          try {
                            toast.success("Đặt hàng thành công");
                            if (selectedPaymentMethod === 1) {
                              handleBank
                                .bank(totalDiscountedPrice, orderId)
                                .then((result) => {
                                  window.location.href = result?.url;
                                });
                            } else if (selectedPaymentMethod === 2) {
                              navigate("/ordercomplete", {
                                state: {
                                  selectedPaymentMethod: 2,
                                  orderId,
                                },
                              });
                            }
                          } catch (error) {
                            console.error("Error processing payment:", error);
                          }
                        }
                      },
                      onError: (error) => {
                        console.error("Error creating order detail:", error);
                      },
                    }
                  );
                });
              }
            } else {
              // Nếu tạo đơn hàng thất bại, không tạo chi tiết đơn hàng
              console.error("Failed to create order:", response);
            }
          },
          onError: (error) => {
            console.error("Error creating order:", error);
          },
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const onSubmit = async (data: OrderData) => {
    if (!userProfile) {
      toast.error("Xin hãy đăng nhập để tiếp tục");
      return;
    }

    const outOfStockProducts = new Set(); // Sử dụng Set để chỉ lưu trữ duy nhất tên sản phẩm hết hàng
    const productQuantity: { [key: number]: number } = {}; //Chứa tổng số lượng sản phẩm theo ID

    // Tính tổng số lượng cho mỗi sản phẩm với ID giống nhau
    for (const product of selectedProducts) {
      const productId = product.productData.id;
      const quantity = product.quantity; // Lấy số lượng của sản phẩm từ selectedItems

      if (productQuantity[productId]) {
        console.log(productQuantity[productId]);
        productQuantity[productId] += quantity;
      } else {
        productQuantity[productId] = quantity;
      }
    }

    // Kiểm tra stock cho từng sản phẩm đã chọn
    for (const product of selectedProducts) {
      const productId = product.productData.id;

      const stock = stockStatus[productId]; // Lấy stock tổng của sản phẩm theo ID
      const requestedQuantity = productQuantity[productId]; // Số lượng đã yêu cầu cho sản phẩm theo ID

      if (stock - requestedQuantity < 2) {
        // Kiểm tra nếu số lượng tồn kho còn lại không đủ yêu cầu
        outOfStockProducts.add(product.productData.name); // Sử dụng Set để chỉ thêm tên sản phẩm một lần
      }
    }

    // Nếu có sản phẩm hết hàng
    if (outOfStockProducts.size > 0) {
      const outOfStockArray = Array.from(outOfStockProducts) as string[]; // Chuyển Set thành Array để render toast
      if (outOfStockArray.length === 1) {
        // Nếu chỉ có 1 sản phẩm hết hàng
        toast(
          <div className="flex items-center gap-x-4">
            <AiOutlineInfoCircle className="h-6 w-6 text-red-500" />
            <p className="text-sm font-medium text-gray-700">
              Rất tiếc phải xin lỗi quý khách, sản phẩm{" "}
              <span className="font-semibold text-red-600">
                "{outOfStockArray[0]}"
              </span>{" "}
              đã hết hàng.
            </p>
          </div>
        );
      } else {
        // Nếu có nhiều sản phẩm hết hàng
        toast(
          <div className="flex items-center gap-x-4">
            <AiOutlineInfoCircle className="h-6 w-6 text-red-500" />
            <p className="text-sm font-medium text-gray-700">
              Rất tiếc phải xin lỗi quý khách, các sản phẩm sau đây đã hết hàng:
              <ul className="list-disc ml-6 text-red-600 font-semibold">
                {outOfStockArray.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </p>
          </div>
        );
      }
      return false; // Có sản phẩm hết hàng
    }

    if (deliveryType) {
      createdOrder(
        userProfile.id,
        null,
        data.paymentMethod,
        totalDiscountedPrice,
        userProfile?.phone,
        selectedProducts,
        selectIdStore,
        "Nhận tại cửa hàng",
        deliveryTime
      );
    }

    if (selectedPaymentMethod === null) {
      return;
    }
    if (address && selectIdAddress !== 0 && !addAddressData && !deliveryType) {
      await createdOrder(
        userProfile.id,
        selectIdAddress,
        data.paymentMethod,
        totalDiscountedPrice,
        userProfile?.phone,
        selectedProducts,
        null,
        "Giao hàng",
        deliveryTime
      );
    }
    if (addAddressData && !deliveryType) {
      mutate(
        { url: `/address/createAddress/`, data: addressData },
        {
          onSuccess: async (res) => {
            if (res.status === 200) {
              await createdOrder(
                userProfile.id,
                res.data.id,
                data.paymentMethod,
                totalDiscountedPrice,
                userProfile?.phone,
                selectedProducts,
                null,
                "Giao hàng",
                deliveryTime
              );
            }
          },
        }
      );
    }
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-40">
      <div className="w-full max-w-4xl mx-auto">
        <h4 className="text-center text-3xl font-bold py-8">
          Xác nhận đơn hàng
        </h4>
        <NavCart />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container mx-auto py-10 lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-2 gap-6">
          <div className="col-span-2 space-y-6 mb-10">
            <div className="p-4 bg-white rounded-md shadow-sm">
              <h2 className="text-base font-semibold mb-4">
                Sản phẩm trong giỏ hàng
              </h2>
              <div className="space-y-4">
                {productsToDisplay &&
                  productsToDisplay?.map((productDetail, index) => {
                    const currentPrice = calculatePriceByRom(
                      productDetail.productData.price,
                      productDetail.rom
                    );
                    return (
                      <div
                        key={index}
                        className={`flex items-center space-x-4 pb-4 ${productsToDisplay.length - 1 !== index &&
                          `border-b-[1px]`
                          }`}
                      >
                        <Image
                          src={
                            productDetail.productData.img ||
                            "https://via.placeholder.com/100"
                          }
                          alt={productDetail.productData.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="space-y-2 w-full">
                          <div className="flex justify-between items-start">
                            <div className="w-full">
                              <h4 className="line-clamp-1 text-sm font-semibold w-2/3">
                                {productDetail.productData.name}{" "}
                                {productDetail.rom}
                              </h4>
                              <div className="text-sm gap-x-2 flex items-center text-[#6C7275]">
                                Màu:
                                <span
                                  className="size-4 rounded-full"
                                  style={{
                                    backgroundColor: productDetail.color,
                                  }}
                                ></span>
                              </div>
                              <p className="text-xs text-gray-700">
                                Số lượng: {productDetail.quantity}
                              </p>
                            </div>
                            <div>
                              <p className="text-red-600 text-base font-semibold">
                                {currentPrice?.toLocaleString("vi-VN")}đ
                              </p>
                              <p className="text-sm line-through text-gray-500">
                                {Math.round(
                                  currentPrice /
                                  (1 -
                                    productDetail.productData.discount / 100)
                                )?.toLocaleString("vi-VN")}
                                đ
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Địa chỉ giao hàng */}
            <DeleveryInfor />

            {/* Phương thức thanh toán */}
            <div className="p-4 bg-white rounded-md shadow-sm">
              <h2 className="text-base font-semibold mb-4">
                Phương thức thanh toán
              </h2>
              <div className="space-y-4">
                {paymentMethods &&
                  paymentMethods.map((paymentMethod) => (
                    <label
                      key={paymentMethod.id}
                      className="block cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={paymentMethod.id}
                        {...register("paymentMethod", {
                          required: "Vui lòng chọn phương thức thanh toán",
                        })}
                        className="form-radio h-4 w-4"
                        onChange={(e) => {
                          setSelectedPaymentMethod(Number(e.target.value));
                        }}
                      />
                      <span className="ml-2 text-gray-700">
                        {paymentMethod.type}
                      </span>
                    </label>
                  ))}
                {errors.paymentMethod && (
                  <span className="text-sm text-red-500">
                    {errors.paymentMethod.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="sticky top-[92px] max-h-[55vh] w-full lg:w-full bg-white rounded shadow-sm p-8 leading-8">
            <div className="mb-[30px] text-[20px]">
              <h3>Thông tin đơn hàng</h3>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Tổng tiền</span>
              <span className="font-semibold">
                {totalOriginalPrice?.toLocaleString("vi-VN")}đ
              </span>
            </div>
            <hr className="my-2" />
            {/* Tổng khuyến mãi */}
            <div className="flex justify-between">
              <span className="text-gray-700">Tổng khuyến mãi</span>
              <span className="font-semibold">
                {totalDiscount?.toLocaleString("vi-VN")}đ
              </span>
            </div>

            {/* Phí vận chuyển */}
            <div className="flex justify-between mt-2">
              <span className="text-gray-700">Phí vận chuyển</span>
              <span className="text-sm">Miễn phí</span>
            </div>
            <hr className="my-2" />
            {/* Tổng cần thanh toán */}
            <div className="flex justify-between">
              <span className="text-gray-700">Cần thanh toán</span>
              <span className="font-semibold text-red-600 text-lg">
                {totalDiscountedPrice?.toLocaleString("vi-VN")}đ
              </span>
            </div>

            {/* nút submit */}
            <div>
              <button
                type="submit"
                className="w-full mt-4 bg-[#eb3e32] text-white p-3 rounded-lg font-semibold duration-300 hover:bg-red-600"
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CheckOut;
