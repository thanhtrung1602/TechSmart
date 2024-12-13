import useGet from "~/hooks/useGet";
import { useParams } from "react-router-dom";
import OrdersDetail from "~/models/Ordersdetail";
import Orders from "~/models/Orders";
import dayjs from "dayjs";
import { RootState } from "~/redux/store";
import { useSelector } from "react-redux";
import SuccessOrder from "./successOrder";
import { LuDot } from "react-icons/lu";
import ProductInfor from "./productInfor";
import { getStatusColor } from "~/pages/Account/Orders";
type DeliveryEstimate = {
  desc: string;
  date: string;
  work_shift: number;
  time_slot: number;
  label: string;
};

type OrderDetails = {
  pick_source_estimate: DeliveryEstimate;
  pick_destination_estimate: DeliveryEstimate;
  deliver_estimate: DeliveryEstimate;
};

type DeliveryInfoResponse = {
  success: boolean;
  message: string;
  data: {
    [key: string]: OrderDetails; // Key là ID đơn hàng (có thể thay đổi)
  };
  log_id: string;
};

const OrderTracking = () => {
  const { id } = useParams();
  const userProfile = useSelector(
    (state: RootState) => state.userProfile.userProfile
  );

  const { data: orderDetails } = useGet<OrdersDetail[]>(
    `/orderdetails/getAllOrderDetailByOrderId/${id}`,
    {
      enabled: !!id,
    }
  );

  const { data: orderById } = useGet<Orders>(`/orders/getOrderById/${id}`, {
    enabled: !!id,
  });

  console.log("orderById: ", orderById);

  const { data: deliveryInfo } = useGet<DeliveryInfoResponse>(
    `/orders/getPackageOrderGHTK/${orderById?.tracking_order}`,
    {
      enabled: !!orderById?.tracking_order,
    }
  );

  const pickSource =
    deliveryInfo?.data?.[String(orderById?.tracking_order)]
      ?.pick_source_estimate;
  const pickDestination =
    deliveryInfo?.data?.[String(orderById?.tracking_order)]
      ?.pick_destination_estimate;
  const deliverEstimate =
    deliveryInfo?.data?.[String(orderById?.tracking_order)]?.deliver_estimate;

  return (
    <>
      <div className="bg-white md:pt-4 md:px-2 lg:pt-6 lg:px-6 rounded-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold">
            Chi tiết đơn hàng
          </h3>
        </div>
        <div className="mx-auto bg-white rounded-lg ">
          <div className="flex justify-between mb-4">
            <div className="w-full text-black text-base flex flex-col gap-2 ">
              <div className="flex justify-between">
                <p className="">
                  Ngày đặt hàng:{" "}
                  {dayjs(orderById?.createdAt).format("DD/MM/YYYY")}
                </p>
                {orderById?.deliveryDate && (
                  <p>
                    Ngày nhận hàng:{" "}
                    {dayjs(orderById?.deliveryDate).format("DD/MM/YYYY")}
                  </p>
                )}
                <div
                  className={`${getStatusColor(
                    `${orderById?.statusData?.status}`
                  )} flex`}
                >
                  <span className="ml-2">{orderById?.statusData?.status}</span>
                </div>
              </div>
              <div className="flex gap-x-1 md:gap-x-2 text-xs md:text-base">
                <p className="flex justify-center items-center text-gray-500">
                  <LuDot /> {orderById?.delivery_method} <LuDot />{" "}
                  {orderById?.paymentMethods?.type}
                </p>
                <p className="flex justify-center items-center text-gray-500">
                  <LuDot /> {orderById?.order_code} <LuDot />{" "}
                  {orderDetails?.length} sản phẩm
                </p>
              </div>
            </div>
          </div>

          {orderById?.statusId === 2 ? (
            <div className="relative mt-6">
              <div className="absolute top-0 bottom-0 border-l-2 border-gray-300"></div>
              <div className="pl-3">
                <div className="flex items-start mb-6">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1"></div>
                  <p className="ml-4 text-black text-sm">
                    <span className="font-semibold">
                      Dự kiến {pickSource?.label} sáng{" "}
                      {dayjs(pickSource?.date).format("DD/MM")}
                    </span>{" "}
                    {pickSource?.desc}
                  </p>
                </div>
                <div className="flex items-start mb-6">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1"></div>
                  <p className="ml-4 text-black text-sm">
                    <span className="font-semibold">
                      Dự kiến {pickDestination?.label} sáng{" "}
                      {dayjs(pickDestination?.date).format("DD/MM")}:
                    </span>{" "}
                    {pickDestination?.desc}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1"></div>
                  <p className="ml-4 text-black text-sm">
                    <span className="font-semibold">
                      Dự kiến {deliverEstimate?.label} sáng{" "}
                      {dayjs(deliverEstimate?.date).format("DD/MM")}:
                    </span>{" "}
                    {deliverEstimate?.desc}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-1">
              <hr className="my-4" />
              <div className="mt-4">
                <SuccessOrder statusId={orderById?.statusId} />
              </div>
              <hr className="my-4" />
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm relative">
                <div className="pr-2 border-r border-gray-300">
                  <p className="text-base font-semibold text-gray-700">
                    Thông tin người nhận
                  </p>
                  <div className="">
                    <p>
                      {orderById?.addressData?.name || userProfile?.fullname}
                    </p>
                    <p>{orderById?.addressData?.phone || userProfile?.phone}</p>
                  </div>
                </div>
                <div className="pl-2">
                  {orderById?.delivery_method === "Nhận tại cửa hàng" ? (
                    <>
                      <p className="text-base font-semibold text-gray-700">
                        Nhận hàng tại shop
                      </p>
                      <div className="">
                        <p>
                          {orderById?.storeData?.street},{" "}
                          {orderById?.storeData?.ward},{" "}
                          {orderById?.storeData?.district?.name},{" "}
                          {orderById?.storeData?.province?.name}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-base font-semibold text-gray-700">
                        Địa chỉ giao hàng
                      </p>
                      <div className="">
                        <p>
                          {orderById?.addressData?.street},{" "}
                          {orderById?.addressData?.ward},{" "}
                          {orderById?.addressData?.district?.name},{" "}
                          {orderById?.addressData?.province?.name}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductInfor />
    </>
  );
};

export default OrderTracking;
