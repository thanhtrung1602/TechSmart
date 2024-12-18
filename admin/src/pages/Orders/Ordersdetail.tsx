import { useParams } from "react-router-dom";
import useGet from "~/hooks/useGet";
import OrdersDetail from "~/models/Ordersdetail";

type statusOrder = {
  order: {
    customer_tel: string;
    address: string;
    status_text: string;
  };
};

function OrderDetail() {
  const { id } = useParams();
  const orderIdNumber = Number(id);

  const { data: orderDetails } = useGet<OrdersDetail[]>(
    `/orderdetails/getAllOrderDetailByOrderId/${orderIdNumber}`
  );

  const { data: statusOrder } = useGet<statusOrder>(
    `/orders/getStatusOrderByGHTK/${orderDetails?.[0]?.orderData.tracking_order}`
  );

  const userData = orderDetails?.map((item) => item?.orderData?.userData);
  const totalAmount =
    orderDetails?.reduce((sum, item) => sum + item.total, 0) || 0;

  const totalQuantity =
    orderDetails?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-md border border-gray-300 p-4 text-sm">
        <div className="text-center">
          <h1 className="text-lg font-semibold">TechSmart</h1>
          <p>Địa chỉ: Phan Văn Trị - Phường Tân Chánh Hiệp, Hồ Chí Minh</p>
          <p>Điện thoại: 0909090909</p>
        </div>

        <div className="mt-4 border-t pt-4">
          <h2 className="text-center font-semibold">HÓA ĐƠN BÁN HÀNG</h2>
          <p className="text-center mt-1">
            Số HD: {orderDetails?.[0]?.orderData.order_code} <br />
            Ngày: {new Date().toLocaleDateString("vi-VN")}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <p>
            <span className="font-medium">Khách hàng:</span>{" "}
            {userData ? userData?.[0]?.fullname : "Khách lẻ"}
          </p>
          <p>
            <span className="font-medium">
              số điện thoại: {userData?.[0]?.phone}
            </span>
          </p>
          <p>
            <span className="font-medium">
              {orderDetails?.[0]?.orderData?.delivery_method === "Giao hàng" ? (
                <>
                  <strong>Địa chỉ:</strong>{" "}
                  {orderDetails?.[0]?.orderData?.addressData?.street},{" "}
                  {orderDetails?.[0]?.orderData?.addressData?.ward},{" "}
                  {orderDetails?.[0]?.orderData?.addressData?.district?.name},{" "}
                  {orderDetails?.[0]?.orderData?.addressData?.province?.name}
                </>
              ) : (
                <>
                  <strong>Địa chỉ:</strong>{" "}
                  {orderDetails?.[0]?.orderData?.storeData?.street},{" "}
                  {orderDetails?.[0]?.orderData?.storeData?.ward},{" "}
                  {orderDetails?.[0]?.orderData?.storeData?.district?.name},{" "}
                  {orderDetails?.[0]?.orderData?.storeData?.province?.name}
                </>
              )}
            </span>
          </p>
        </div>

        <div className="mt-4 border-t pt-4">
          <div className="border-b pb-2">
            <div className="grid grid-cols-4 gap-2 font-medium">
              <div>Tên sản phẩm</div>
              <div className="text-center">Số lượng</div>
              <div className="text-center">Đơn giá</div>
              <div className="text-center">Thành tiền</div>
            </div>
          </div>
          {orderDetails?.map((detail, index) => {
            const unitPrice = detail.total / detail.quantity;
            return (
              <div key={index} className="grid grid-cols-4 gap-2 py-2 border-b">
                <div>{detail.productData?.name || "Sản phẩm"}</div>
                <div className="text-center">{detail.quantity}</div>
                <div className="text-center">
                  {unitPrice?.toLocaleString("vi-VN")} đ
                </div>
                <div className="text-center">
                  {detail.total?.toLocaleString("vi-VN")} đ
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4">
          <div className="flex justify-between">
            <span>Tổng số lượng:</span>
            <span>{totalQuantity} sản phẩm</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>Tổng tiền hàng:</span>
            <span>{totalAmount?.toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>Phí giao hàng:</span>
            <span>Miễn phí</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>Chiết khấu:</span>
            <span>0 đ</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>Trạng thái:</span>
            <span>{statusOrder?.order?.status_text}</span>
          </div>
          <div className="flex justify-between font-bold mt-2">
            <span>Tổng thanh toán:</span>
            <span>{totalAmount?.toLocaleString("vi-VN")} đ</span>
          </div>
          <p className="text-right mt-2 italic">
            (
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalAmount)}{" "}
            chẵn)
          </p>
        </div>

        {/* Footer */}
        <div className="text-center border-t mt-4 pt-4">
          <p>Cảm ơn quý khách đã mua hàng và hẹn gặp lại!</p>
          <p className="italic">Powered by TechSmart</p>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
