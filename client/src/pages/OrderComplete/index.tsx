import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import useGet from "~/hooks/useGet";
import { usePatch } from "~/hooks/usePost";
import NavCart from "~/layouts/components/NavCart";
import { RootState } from "~/redux/store";
import { toast } from "react-hot-toast";
import handleBank from "~/services/bank";
import OrderReturn from "~/models/OrderReturn";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

function OrderComplete() {
  const queryClient = useQueryClient();
  const userProfile = useSelector(
    (state: RootState) => state.userProfile.userProfile
  );
  dayjs.extend(relativeTime);
  const location = useLocation();
  const paymentMethod = location.state?.selectedPaymentMethod;
  const orderId = location.state?.orderId;

  const { data: orderReturn } = useGet<OrderReturn>(
    paymentMethod !== 2
      ? `/orders/getOrderReturn`
      : `/orders/getOrderById/${orderId}`
  );

  console.log("orderReturn: ", orderReturn);

  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const { mutate: cancelOrder } = usePatch();
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (orderReturn?.responseCode === "00") {
      console.log(orderReturn);
    }
  }, [orderReturn]);

  const handleCancelOrder = () => {
    if (!cancelReason) {
      toast.error("Vui lòng cung cấp lý do hủy đơn hàng.");
      return;
    }
    cancelOrder(
      {
        url: `/orders/updateOrder/${orderReturn?.id}`, // Specify url as a separate property
        data: {
          statusId: 4,
          reason: cancelReason,
          tracking_order: orderReturn?.tracking_order,
        },
      },
      {
        onSuccess: (res) => {
          if (res.status === 200) {
            toast.success("Đã hủy đơn hàng thành công");
            queryClient.invalidateQueries({
              queryKey: [`/cart/getAllCartByUserId/${userProfile?.id}`],
            });
            window.location.href = "/orders";
          }
        },
        onError: () => {
          // Handle error case here if needed
          toast.error("Không thể hủy đơn hàng, vui lòng thử lại sau.");
        },
      }
    );
  };

  const handlePayment = async () => {
    if (orderReturn) {
      const result = await handleBank.bank(orderReturn.total, orderReturn.id);
      window.location.href = result?.url;
      return;
    }
  };

  return (
    <>
      {paymentMethod !== 2 ? (
        orderReturn?.responseCode === "00" ? (
          <>
            <div className="px-4 lg:px-40">
              <div className="w-full lg:w-[600px] mx-auto">
                <h4 className="text-center text-2xl lg:text-3xl font-bold py-4 lg:py-8">
                  Hoàn tất đơn hàng
                </h4>
                <NavCart />
              </div>
            </div>
            <div className="flex items-center justify-center py-6 lg:py-10">
              <div className="bg-white p-6 lg:p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-md lg:text-lg font-medium text-gray-500 mb-2">
                  Cảm ơn bạn đã đặt hàng
                </h1>
                <h2 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">
                  Đơn đặt hàng của bạn đã đặt thành công
                </h2>
                <div className="text-center space-y-2 mb-4 lg:mb-6">
                  <p className="text-gray-700">
                    <strong>Mã đơn hàng:</strong> {orderReturn?.order_code}
                  </p>
                  <p className="text-gray-700">
                    <strong>Ngày:</strong>{" "}
                    {dayjs(orderReturn?.createdAt).format(
                      "HH:mm:ss DD/MM/YYYY"
                    )}
                  </p>
                  <p className="text-gray-700">
                    <strong>Tổng tiền:</strong>{" "}
                    <span className="text-red-600 font-semibold">
                      {Number(orderReturn?.total)?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    <strong>Phương thức thanh toán:</strong>{" "}
                    {orderReturn?.bankCode}
                  </p>
                </div>
                <Link
                  to={`/orders`}
                  className="bg-[#eb3e32] text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg font-semibold"
                >
                  Lịch sử đơn hàng
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="px-4 lg:px-40">
              <div className="w-full lg:w-[600px] mx-auto">
                <h4 className="text-center text-2xl lg:text-3xl font-bold py-4 lg:py-8">
                  Xác nhận tiếp tục thanh toán
                </h4>
                <NavCart />
              </div>
            </div>
            <div className="flex items-center justify-center py-6 lg:py-10">
              <div className="bg-white p-6 lg:p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-md lg:text-lg font-medium text-gray-500 mb-2">
                  Vui lòng tiếp tục xác nhận đặt hàng
                </h1>
                <h2 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">
                  Vui lòng xác nhận tiếp tục thanh toán
                </h2>
                <div className="text-center space-y-2 mb-4 lg:mb-6">
                  <p className="text-gray-700">
                    <strong>Mã đơn hàng:</strong> {orderReturn?.order_code}
                  </p>
                  <p className="text-gray-700">
                    <strong>Ngày:</strong>{" "}
                    {dayjs(orderReturn?.createdAt).format(
                      "HH:mm:ss DD/MM/YYYY"
                    )}
                  </p>
                  <p className="text-gray-700">
                    <strong>Tổng tiền:</strong>{" "}
                    <span className="text-red-600 font-semibold">
                      {Number(orderReturn?.total)?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    <strong>Phương thức thanh toán:</strong>{" "}
                    {orderReturn?.bankCode}
                  </p>
                </div>
                <div className="flex flex-col lg:flex-row justify-center gap-2 lg:gap-4">
                  <button
                    className="bg-[#202C46] text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full font-semibold"
                    onClick={handlePayment}
                  >
                    Tiếp tục thanh toán
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full font-semibold"
                    onClick={() => setShowCancelPopup(true)}
                  >
                    Hủy đơn hàng
                  </button>
                </div>
                {showCancelPopup && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-lg w-[90%] lg:w-[400px] text-center">
                      <h3 className="text-lg lg:text-xl font-semibold mb-4">
                        Lý do hủy đơn hàng
                      </h3>
                      <div className="text-left mb-4">
                        {[
                          "Khách không mua nữa",
                          "Đặt nhầm sản phẩm",
                          "Đơn trùng",
                          "Không muốn chuyển khoản",
                          "Lý do khác",
                        ]?.map((reason) => (
                          <label
                            key={reason}
                            className="flex items-center mb-2"
                          >
                            <input
                              type="radio"
                              name="cancelReason"
                              value={reason}
                              checked={cancelReason === reason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              className="mr-2"
                            />
                            {reason}
                          </label>
                        ))}
                        <textarea
                          className="w-full p-2 bg-gray-100 border rounded-lg mt-2"
                          placeholder="Vui lòng nhập lý do khác nếu có..."
                          rows={4}
                        ></textarea>
                      </div>
                      <div className="flex justify-end gap-2 lg:gap-4">
                        <button
                          className="bg-gray-300 px-4 py-2 rounded-full"
                          onClick={() => setShowCancelPopup(false)}
                        >
                          Đóng
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold"
                          onClick={handleCancelOrder}
                        >
                          Xác nhận hủy
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )
      ) : (
        <>
          <div className="px-4 lg:px-40">
            <div className="w-full lg:w-[600px] mx-auto">
              <h4 className="text-center text-2xl lg:text-3xl font-bold py-4 lg:py-8">
                Hoàn tất đơn hàng
              </h4>
              <NavCart />
            </div>
          </div>
          <div className="flex items-center justify-center py-6 lg:py-10">
            <div className="bg-white p-6 lg:p-8 rounded-lg shadow-lg text-center">
              <h1 className="text-md lg:text-lg font-medium text-gray-500 mb-2">
                Cảm ơn bạn đã đặt hàng
              </h1>
              <h2 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">
                Đơn đặt hàng của bạn đã đặt thành công
              </h2>
              <div className="text-center space-y-2 mb-4 lg:mb-6">
                <p className="text-gray-700">
                  <strong>Mã đơn hàng:</strong> {orderReturn?.order_code}
                </p>
                <p className="text-gray-700">
                  <strong>Ngày:</strong>{" "}
                  {dayjs(orderReturn?.createdAt).format("HH:mm:ss DD/MM/YYYY")}
                </p>
                <p className="text-gray-700">
                  <strong>Tổng tiền:</strong>{" "}
                  <span className="text-red-600 font-semibold">
                    {Number(orderReturn?.total)?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </p>
                <p className="text-gray-700">
                  <strong>Phương thức thanh toán:</strong> Thanh toán khi nhận
                  hàng
                </p>
              </div>
              <Link
                to={`/orders`}
                className="bg-[#eb3e32] text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg font-semibold"
              >
                Lịch sử đơn hàng
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default OrderComplete;
