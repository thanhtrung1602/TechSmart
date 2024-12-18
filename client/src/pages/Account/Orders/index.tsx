import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useGet from "~/hooks/useGet";
import { RootState } from "~/redux/store";
import { Link } from "react-router-dom";
import PaginationList from "~/components/PaginationList";
import SwiperStatusOrder from "~/features/swiperStatusOrder";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

type Order = {
  id: number;
  phone: number;
  total: number;
  order_code: string;
  createdAt: Date;
  statusId: number;
  paymentMethodId: number;
  transactionCode: number;
  tracking_order: string;
  statusData: {
    id: number;
    status: string;
  };
  paymentMethodData: {
    id: number;
    type: string;
  };
};

export type StatusOrder = {
  id: number;
  status: string;
};

function Orders() {
  dayjs.extend(relativeTime);
  const [order, setOrder] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("Tất cả");
  const [selectedStatusId, setSelectedStatusId] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const userProfile = useSelector(
    (state: RootState) => state.userProfile.userProfile
  );
  const orderCreated = useSelector(
    (state: RootState) => state.socket.orderCreated
  );

  const urlPagination = (page: number, size: number) => {
    return `/orders/getOrderByIdUser/${userProfile?.id}?page=${page}&size=${size}`;
  };

  const { data: orderPagination = { count: 0, rows: [] } } = useGet<{
    count: number;
    rows: Order[];
  }>(urlPagination(currentPage, itemsPerPage));

  const { data: statusOrders } = useGet<StatusOrder[]>(
    "/status/findAllStatusOrder/"
  );

  useEffect(() => {
    if (orderPagination && orderPagination.rows.length > 0) {
      setOrder(orderPagination.rows);
      setTotalOrders(orderPagination.count);
    }
  }, [orderPagination]);

  useEffect(() => {
    if (orderCreated && orderCreated.length > 0 && orderCreated[0].id !== 0) {
      setOrder((prevOrder) => {
        const isOrderExists = prevOrder.some(
          (order) => order.id === orderCreated[0].id
        );
        if (!isOrderExists) {
          // Thêm đơn hàng mới vào mảng order nếu đơn hàng chưa tồn tại
          return [orderCreated[0], ...prevOrder]; // orderCreated[0] vì orderCreated là mảng Orders[]
        }
        return prevOrder;
      });
    }
  }, [orderCreated]);

  const handleButtonClick = (status: string, id: number) => {
    setSelectedStatus(status);
    setSelectedStatusId(id);
    setCurrentPage(1); // Reset to first page when status is changed
  };

  const handlePageClick = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterStatusOrder = (
    orderCreated ? order : orderPagination.rows
  ).filter((status) => {
    const matches = status.statusId === selectedStatusId;
    if (selectedStatusId === 0) {
      return status;
    }
    return matches;
  });

  return (
    <section>
      <div className="mb-5">
        <h2 className="font-bold text-lg md:text-xl lg:text-2xl">
          Lịch sử đơn hàng
        </h2>
      </div>

      <div className="lg:hidden w-full">
        <SwiperStatusOrder
          statusOrders={statusOrders || []}
          selectedStatus={selectedStatus}
          handleButtonClick={handleButtonClick}
        />
      </div>
      <div className="hidden mb-3 lg:flex flex-wrap gap-2">
        <button
          onClick={() => handleButtonClick("Tất cả", 0)}
          className={`hidden md:block px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-md border ${
            selectedStatus === "Tất cả"
              ? "bg-[#eb3e32] text-white"
              : "hover:bg-[#eb3e32] hover:text-white duration-200 ease-in-out"
          }`}
        >
          Tất cả
        </button>
        {statusOrders?.map((s) => (
          <button
            key={s.status}
            onClick={() => handleButtonClick(s.status, s.id)}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-md border ${
              selectedStatus === s.status
                ? "bg-[#eb3e32] text-white"
                : "hover:bg-[#eb3e32] hover:text-white duration-200 ease-in-out"
            }`}
          >
            {s.status}
          </button>
        ))}
      </div>
      <article className="scrollbar overflow-auto">
        <table className="w-full border-collapse table-fixed text-xs sm:text-sm lg:text-base">
          <thead className="bg-white">
            <tr className="border-b-2 font-thin">
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-center bg-white text-black w-1/5">
                Ngày đặt
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-center bg-white text-black w-1/5">
                Trạng thái
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-center bg-white text-black w-1/5">
                Giá
              </th>
              <th className="hidden lg:flex px-2 py-2 sm:px-4 sm:py-3 lg:justify-center bg-white text-black">
                Phương thức thanh toán
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-center bg-white text-black w-1/5">
                Chi tiết
              </th>
            </tr>
          </thead>
          <tbody>
            {filterStatusOrder?.map((o) => {
              const date = new Date(o.createdAt);
              const formatDate = dayjs(date).format("HH:mm:ss DD/MM/YYYY");
              return (
                <tr
                  key={o.id}
                  className="border-b-2 text-[12px] sm:text-[14px] md:text-sm lg:text-base"
                >
                  <td className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                    {formatDate}
                  </td>
                  <td
                    className={`px-2 py-2 sm:px-4 sm:py-3 text-center ${getStatusColor(
                      o.statusData?.status
                    )}`}
                  >
                    {o.statusData?.status}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                    {o.total?.toLocaleString()}đ
                  </td>
                  <td className="hidden lg:flex px-2 py-2 sm:px-4 sm:py-3 lg:justify-center">
                    {o?.paymentMethodData?.type}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                    <Link
                      to={`/orders/detail/${o.id}`}
                      className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-md bg-[#eb3e32] text-white hover:bg-[#c7342b] duration-200"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {totalOrders > 0 && (
          <PaginationList
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalProducts={totalOrders}
            handlePageClick={handlePageClick}
          />
        )}
      </article>
    </section>
  );
}

export function getStatusColor(status: string) {
  switch (status) {
    case "Đang xử lý":
      return `text-sky-600 `;
    case "Đang Giao":
      return "text-green-600";
    case "Hoàn tất":
      return "text-teal-600 ";
    case "Đã huỷ":
      return "text-red-600 ";
    case "Trả hàng/Hoàn tiền":
      return "text-orange-600 ";
    default:
      return "text-gray-600 ";
  }
}

export default Orders;
