import Orders from "~/models/Orders";
import Status from "~/models/Status";
import useGet from "~/hooks/useGet";

export default function OrderSummary() {
  const { data: orders } = useGet<Orders[]>("orders/FindAllOrder");
  const { data: statuses } = useGet<Status[]>("status/findAllStatusOrder");

  const ordersByStatus = statuses?.map((status) => {
    const count =
      orders?.filter((order) => order.statusId === status.id)?.length || 0;
    return { ...status, count };
  });

  return (
    <section className="w-full px-4 bg-white shadow-lg rounded-lg p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Đơn hàng</h1>
      <div className="flex flex-wrap items-center justify-center gap-4 ">
        {ordersByStatus?.map((status) => (
          <div
            key={status.id}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-md border`}
          >
            <span className="font-medium">{status.status}</span>
            <span className="text-gray-500 text-sm mt-1">
              Tổng: {status.count}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
