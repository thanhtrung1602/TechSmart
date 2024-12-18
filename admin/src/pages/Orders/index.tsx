import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PaginationList from "~/components/PaginationList";
import useGet from "~/hooks/useGet";
import Orders from "~/models/Orders";
import Users from "~/models/Users";
import OrdersDetail from "~/models/Ordersdetail";

function Order() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [dateFilter, setDateFilter] = useState("");
  const [paymentMethodFilter, setpaymentMethodFilter] = useState("");
  const [delivery_methodFilter, setdelivery_methodFilter] = useState("");
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
    return `/orders/getAllOrdersWithFilter?${query.toString()}`;
  };

  const { data: users } = useGet<Users[]>("/users/getAllUser");
  const { data: ordersPagination } = useGet<{ total: number; rows: Orders[] }>(
    urlPagination(currentPage, itemsPerPage)
  );

  const matchesDateFilter = (order: Orders) => {
    if (!dateFilter) return true; // Không lọc nếu không có giá trị

    const orderDate = new Date(order.createdAt); // Ngày đặt hàng
    const today = new Date(); // Ngày hiện tại
    let startDate;

    // Xác định khoảng thời gian cần lọc
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

    // Trả về true nếu ngày đặt hàng nằm trong khoảng thời gian đã chọn
    return orderDate >= startDate;
  };

  // Lọc orders sau khi fetch dữ liệu
  const filteredOrders = ordersPagination?.rows.filter((order) =>
    matchesDateFilter(order)
  );

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only pass the endpoint if selectedOrderId is not null, otherwise prevent the hook from running.
  const { data: orderDetails } = useGet<OrdersDetail[]>(
    selectedOrderId
      ? `/orderdetails/getAllOrderDetailByOrderId/${selectedOrderId}`
      : ""
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null); // Reset selected order
  };

  useEffect(() => {
    if (ordersPagination) {
      setTotalOrders(ordersPagination.total);
    }
  }, [ordersPagination]);

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
    setpaymentMethodFilter("");
    setStatusFilter("");
    setdelivery_methodFilter("");
    setDateFilter(""); // Reset bộ lọc ngày
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-[32px] font-bold mb-4">Danh sách đơn hàng</h1>

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
            onChange={(e) => setpaymentMethodFilter(e.target.value)}
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
            onChange={(e) => setdelivery_methodFilter(e.target.value)}
          >
            <option value="" disabled hidden>
              PT nhận hàng
            </option>
            <option value="Nhận tại cửa hàng">Tại cửa hàng</option>
            <option value="Giao hàng">Giao hàng</option>
          </select>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Tìm tên khách hàng..."
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={resetFilters}
              className="py-2 px-4 text-red-600 bg-red-50 rounded-lg"
            >
              Bỏ lọc
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-300">
            <tr className="text-center">
              <th className="py-3 px-4 text-sm font-medium text-[#202224] border-b">
                STT
              </th>
              <th className="py-3 px-4 text-sm font-medium text-[#202224] border-b">
                Tên Tài Khoản
              </th>
              <th className="py-3 px-4 text-sm font-medium text-[#202224] border-b">
                Số điện thoại
              </th>
              <th className="py-3 px-4 text-sm font-medium text-[#202224] border-b">
                Địa chỉ
              </th>
              <th className="py-3 px-4 text-sm font-medium text-[#202224] border-b">
                Ngày đặt
              </th>
              <th className="py-3 px-4 text-sm font-medium text-[#202224] border-b">
                Tổng tiền
              </th>
              <th className="py-3 px-4 text-sm font-medium text-[#202224] border-b">
                Phương thức thanh toán
              </th>
              <th className="py-3 px-4 text-sm font-medium text-[#202224] border-b">
                Trạng thái
              </th>
              <th className="py-3 px-4 text-sm font-medium text-[#202224] border-b">
                Hình thức nhận hàng
              </th>
              <th className="py-3 px-4 text-sm font-medium text-[#202224] border-b">
                Xem chi tiết
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders?.map((order, index) => {
                const user = users?.find((u) => u.id === order.userId);
                console.log("order: ", order);
                return (
                  <tr key={order?.id} className="text-center">
                    <td className="py-3 px-4 border-b">{index + 1}</td>
                    <td className="py-3 px-4 border-b">
                      {user ? user?.fullname : "Unknown User"}
                    </td>
                    <td className="py-3 px-4 border-b">{order?.phone}</td>
                    {order?.delivery_method === "Nhận tại cửa hàng" && (
                      <td className="py-3 px-4 border-b">
                        {`${order?.storeData?.province.name}, ${order?.storeData?.district.name}, ${order?.storeData?.ward}, ${order?.storeData?.street}`}
                      </td>
                    )}
                    {order?.delivery_method === "Giao hàng" && (
                      <td className="py-3 px-4 border-b">
                        {`${order?.addressData?.province.name}, ${order?.addressData?.district.name}, ${order?.addressData?.ward}, ${order?.addressData?.street}`}
                      </td>
                    )}
                    <td className="py-3 px-4 border-b">
                      {new Date(order?.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {order?.total?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 border-b text-sm">
                      {order?.paymentMethodData.type}
                    </td>
                    <td
                      className={`py-3 px-4 border-b text-sm ${getStatusColor(
                        order.statusData.status
                      )}`}
                    >
                      {order.statusData.status}
                    </td>
                    <td className={`py-3 px-4 border-b text-sm`}>
                      {order.delivery_method}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      <Link to={`/orderdetails/${order.id}`}>
                        <button
                          onClick={() => { }}
                          className="w-[100%] flex items-center py-2 px-2 text-[#3271ab] bg-blue-100 rounded-lg duration-300 hover:text-blue-600 hover:bg-blue-300"
                        >
                          <span className="text-center text-xs font-semibold">
                            Thông tin
                          </span>
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="py-3 px-4 border-b" colSpan={9}>
                  không tìm thấy đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Modal for showing order details */}
        {isModalOpen && orderDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
              <h2 className="text-2xl font-bold mb-4">Chi tiết hóa đơn</h2>
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-300">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-[#202224] border-b">
                      Order ID
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-[#202224] border-b">
                      Mã sản phẩm
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-[#202224] border-b">
                      Tên sản phẩm
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-[#202224] border-b">
                      Ảnh
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-[#202224] border-b">
                      Số lượng
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-[#202224] border-b">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.map((detail) => (
                    <tr key={detail.productId}>
                      <td className="py-3 px-4 border-b">{detail.orderId}</td>
                      <td className="py-3 px-4 border-b">{detail.productId}</td>
                      <td className="py-3 px-4 border-b">
                        {detail.productData.name}
                      </td>
                      <td className="py-3 px-4 border-b">Ảnh</td>
                      <td className="py-3 px-4 border-b">{detail.quantity}</td>
                      <td className="py-3 px-4 border-b">{detail.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 text-right">
                <button
                  className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={closeModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Pagination */}
        {totalOrders > 0 && (
          <PaginationList
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalProducts={totalOrders}
            handlePageClick={handlePageClick}
          />
        )}
      </div>
    </div>
  );
}

export default Order;
function getStatusColor(status: string) {
  switch (status) {
    case "Đang xử lý":
      return `text-sky-600 `;
    case "Đang giao":
      return "text-green-600";
    case "Đã huỷ":
      return "text-red-600 ";
    case "Hoàn tất":
      return "text-green-600 ";
    case "Trả hàng/Hoàn tiền":
      return "text-orange-600 ";
    default:
      return "text-gray-600 ";
  }
}
