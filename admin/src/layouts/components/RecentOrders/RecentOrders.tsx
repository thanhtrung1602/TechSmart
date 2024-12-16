import { Link } from "react-router-dom";
import { getOrderStatus } from "~/lib/helper";
import useGet from "~/hooks/useGet";
import Orders from "~/models/Orders";
import Users from "~/models/Users";

function RecentOrders() {
  const { data: userList, isLoading: isLoadingUsers } =
    useGet<Users[]>("/users/getAllUser");
  const { data: orders, isLoading: isLoadingOrders } = useGet<{
    total: number;
    rows: Orders[];
  }>("/orders/getAllOrder");

  console.log(orders);

  if (isLoadingUsers || isLoadingOrders) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-lg shadow-lg flex-1">
      <strong className="text-xl pt-4 pl-4 font-bold">Các đơn hàng</strong>
      <div className="mt-3 rounded-lg max-h-[300px] scroll-smooth scroll-pl-2 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-black font-semibold sticky top-0">
            <tr>
              <td className="rounded-l-lg px-3 py-3 text-center text-sm">
                STT
              </td>
              <td className="px-3 py-3 text-center text-sm">Khách hàng</td>
              <td className="px-3 py-3 text-center text-sm">Ngày đặt</td>
              <td className="px-3 py-3 text-center text-sm">Tổng tiền</td>
              <td className="rounded-r-lg px-3 py-3 text-center text-sm">
                Phương thức thanh toán
              </td>
              <td className="rounded-r-lg px-3 py-3 text-center text-sm">
                Trạng thái
              </td>
            </tr>
          </thead>
          <tbody>
            {orders?.rows?.map((order, index) => {
              const users = userList?.filter(
                (user) => user.id === order.userId
              );
              const username = users?.map((user) => user.fullname).join(", ");
              return (
                <tr className="text-center" key={order.id}>
                  <td className="px-4 py-3 border-b-[1px] border-gray-200 ">
                  {index + 1}
                  </td>
                  <td className="px-4 py-3 border-b-[1px] border-gray-200 items-center">
                    <Link to={`/customer/${order.userId}`}>{username}</Link>
                  </td>
                  <td className="px-4 py-3 border-b-[1px] border-gray-200">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border-b-[1px] border-gray-200">
                    {order.total?.toLocaleString()} VNĐ
                  </td>
                  <td className="px-4 py-3 border-b-[1px] border-gray-200">
                    {order.paymentMethodData.type}
                  </td>
                  <td className="px-4 py-3 border-b-[1px] border-gray-200">
                    {getOrderStatus(order.statusData.status)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrders;
