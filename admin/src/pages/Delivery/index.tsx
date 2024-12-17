import Orders from "~/models/Orders";
import OrdersDetail from "~/models/Ordersdetail";
import Users from "~/models/Users";
import { useState, useEffect } from "react";
import useGet from "~/hooks/useGet";
import { usePatch } from "~/hooks/usePost";
import Image from "~/components/Image";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { FiRefreshCw } from "react-icons/fi";
import PaginationList from "~/components/PaginationList";
import Modal from "~/components/Modal/Modal";


export default function Delivery() {
  const queryClient = useQueryClient();
  const { mutate: updateStatusOrder } = usePatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [dateFilter, setDateFilter] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null); // Lưu ID đơn hàng
  const [nextStatusId, setNextStatusId] = useState<number | null>(null); // Lưu trạng thái tiếp theo
  const [delivery, setDelivery] = useState(false);
  const [done, setDone] = useState(false);

  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [delivery_methodFilter, setDelivery_methodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const urlPagination = (page: number, size: number) => {
    const query = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      status: statusFilter || "",
      paymentMethod: paymentMethodFilter || "",
      delivery_method: delivery_methodFilter || "",
      dateFilter: dateFilter || "",
      search: searchTerm || "",
    });
    return `/orders/getProcessingOrder?${query.toString()}`;
  };

  const { data: users } = useGet<Users[]>("/users/getAllUser");
  const { data: allOrders } = useGet<{ total: number; rows: Orders[] }>(
    urlPagination(currentPage, itemsPerPage)
  );

  const { data: allOrderDetails } = useGet<OrdersDetail[]>(
    "/orderdetails/getAllOrderDetails"
  );

  const matchesDateFilter = (order: Orders) => {
    if (!dateFilter) return true;

    const orderDate = new Date(order.createdAt);
    const today = new Date();
    let startDate;

    switch (dateFilter) {
      case "today":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        break;
      case "last7days":
        startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        break;
      case "last30days":
        startDate = new Date();
        startDate.setDate(today.getDate() - 30);
        break;
      default:
        return true;
    }

    return orderDate >= startDate;
  };

  const filteredOrders = allOrders?.rows.filter((order) =>
    matchesDateFilter(order)
  );

  useEffect(() => {
    if (allOrders) {
      setTotalOrders(allOrders.total);
    }
  }, [allOrders]);

  const handlePageClick = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetFilters = () => {
    setPaymentMethodFilter("");
    setStatusFilter("");
    setDelivery_methodFilter("");
    setDateFilter("");
    setSearchTerm("");
  };

  const openModalForConfirmation = (orderId: number, statusId: number) => {
    setSelectedOrderId(orderId);
    setNextStatusId(statusId);

    if (statusId === 2) {
      setDelivery(true); // Mở modal "Đang giao"
    } else if (statusId === 3) {
      setDone(true); // Mở modal "Hoàn tất"
    }
  };

  const confirmStatusChange = () => {
    if (selectedOrderId === null || nextStatusId === null) return;

    const order = allOrders?.rows.find((order) => order.id === selectedOrderId);
    if (!order) return;

    const detailsForOrder = allOrderDetails?.filter(
      (detail) => detail.orderId === selectedOrderId
    );

    const userId = order.userId;
    const addressId = order.addressId;

    updateStatusOrder(
      {
        url: `/orders/updateOrderStatus/${selectedOrderId}`,
        data: {
          orderDetails: detailsForOrder,
          statusId: nextStatusId,
          userId,
          addressId,
        },
      },
      {
        onSuccess: (response) => {
          console.log("Order status updated successfully", response.data);
          queryClient.invalidateQueries({ queryKey: [urlPagination(currentPage, itemsPerPage)] });
          toast.success("Cập nhật trạng thái đơn hàng thành công");

          // Đóng modal sau khi cập nhật
          setDelivery(false);
          setDone(false);
          setSelectedOrderId(null);
          setNextStatusId(null);
        },
        onError: (error) => {
          console.error("Error updating order status:", error);
          toast.error("Cập nhật trạng thái đơn hàng thất bại");
        },
      }
    );
  };

  return (
    <>
      <div className="min-h-screen">
        <h1 className="text-[32px] font-bold mb-4">Xác nhận đơn hàng</h1>

        <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div className="flex space-x-4">
            <select
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="" disabled hidden>
                Ngày
              </option>
              <option value="today">Hôm nay</option>
              <option value="last7days">7 ngày trước</option>
              <option value="last30days">30 ngày trước</option>
            </select>

            <select
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg"
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <option value="" disabled hidden>
                PT thánh toán
              </option>
              <option value="2">TT khi nhận hàng</option>
              <option value="1">Thanh toán online</option>
            </select>

            <select
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="" disabled hidden>
                Trạng thái
              </option>
              <option value="3">Hoàn tất</option>
              <option value="1">Đang xử lý</option>
              <option value="4">Đã hủy</option>
            </select>

            <select
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg"
              value={delivery_methodFilter}
              onChange={(e) => setDelivery_methodFilter(e.target.value)}
            >
              <option value="" disabled hidden>
                PT nhận hàng
              </option>
              <option value="Nhận tại cửa hàng">Tại cửa hàng</option>
              <option value="Giao hàng">Giao hàng</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={resetFilters}
              className="flex items-center space-x-2 py-2 px-4 text-red-600 bg-red-50 hover:bg-red-100  rounded-lg"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Bỏ lọc</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-300">
              <tr className="text-center">
                <th className="py-3 px-4 font-semibold w-1/12 border-b">
                  Mã vận đơn
                </th>
                <th className="py-3 px-4 font-semibold w-1/12 border-b">
                  Tên khách hàng
                </th>
                <th className="py-3 px-4 font-semibold w-3/12 border-b">
                  Sản phẩm
                </th>
                <th className="py-3 px-4 font-semibold w-1/12 border-b">
                  Tổng tiền
                </th>
                <th className="py-3 px-4 font-semibold w-2/12 border-b">
                  Phương thức thanh toán
                </th>
                <th className="py-3 px-4 font-semibold w-1/12 border-b">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders &&
                filteredOrders?.map((order) => {
                  const detailsForOrder = allOrderDetails?.filter(
                    (detail) => detail.orderId === order.id
                  );
                  const userForOrder = users?.find(
                    (user) => user.id === order.userId
                  );
                  return (
                    <tr key={order.id} className="border-b">
                      <td className="py-3 px-4 text-center">
                        {order.order_code}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col">
                          <p className="font-medium text-sm text-[#202224]">
                            {userForOrder?.fullname || "Không xác định"}
                          </p>
                          {userForOrder?.phone && (
                            <p className="text-xs text-gray-500">
                              {userForOrder.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col space-y-2">
                          {detailsForOrder?.map((detail) => (
                            <div key={detail.id} className="flex items-center">
                              <div
                                className="w-16 h-16 flex-shrink-0 mr-4"
                                style={{ minWidth: "64px" }}
                              >
                                <Image
                                  alt={detail.productData.name}
                                  src={detail.productData.img}
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                              <div>
                                <p className="line-clamp-2 text-sm font-medium">
                                  {detail.productData.name}
                                </p>
                                <div className="flex flex-wrap text-xs text-gray-500 gap-2">
                                  <span>Số lượng: {detail.quantity}</span>
                                  {detail.color && (
                                    <span>Màu sắc: {detail.color}</span>
                                  )}
                                  {detail.size && (
                                    <span>Dung lượng: {detail.size}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {order.total?.toLocaleString()}đ
                      </td>
                      <td className="py-3 px-4 text-center">
                        {order.paymentMethodData?.type}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() =>
                            openModalForConfirmation(
                              order.id,
                              order.statusId === 1 ? 2 : order.statusId === 2 ? 3 : 3
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg px-4 py-2"
                        >
                          {order.statusId === 1
                            ? "Đang xử lý"
                            : order.statusId === 2
                              ? "Đang giao"
                              : "Hoàn tất"}
                        </button>

                        {/* Modal Đang giao */}
                        <Modal open={delivery} onClose={() => setDelivery(false)}>
                          <div className="w-auto text-center">
                            <h2 className="text-xl font-bold mb-4">Xác nhận giao hàng</h2>
                            <p className="text-gray-500 my-2">Cập nhật đơn hàng sang "Đang giao" ?</p>
                            <div className="mt-4 flex justify-end gap-2">
                              <button
                                onClick={confirmStatusChange} 
                                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg"
                              >
                                Xác nhận
                              </button>
                              <button
                                onClick={() => setDelivery(false)}
                                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg"
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        </Modal>

                        {/* Modal Hoàn tất */}
                        <Modal open={done} onClose={() => setDone(false)}>
                          <div className="w-auto text-center">
                            <h2 className="text-xl font-bold mb-4">Xác nhận hoàn tất</h2>
                            <p className="text-gray-500 my-2">Cập nhật đơn hàng sang "Hoàn tất" ?</p>
                            <div className="mt-4 flex justify-end gap-2">
                              <button
                                onClick={confirmStatusChange}
                                className="w-full px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg"
                              >
                                Xác nhận
                              </button>
                              <button
                                onClick={() => setDone(false)} 
                                className="w-full px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg"
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        </Modal>
                      </td>
                    </tr>
                  );
                })}
              {filteredOrders && filteredOrders?.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-3 px-4 text-center">
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {totalOrders > 0 && (
        <PaginationList
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalProducts={totalOrders}
          handlePageClick={handlePageClick}
        />
      )}
    </>
  );
}
