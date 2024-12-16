import React from "react";
import { IoBarChartSharp, IoPeople, IoCart, IoCube } from "react-icons/io5";
import useGet from "~/hooks/useGet";
import Orders from "~/models/Orders";
import Products from "~/models/Products";
function DashboardStat() {
  const { data: products } = useGet<Products[]>("products/findAll");

  const { data: usersCount } = useGet<number>("/users/getTotalUsers");

  const { data: order } = useGet<Orders[]>("/orders/FindAllOrder");

  const totalRevenue =
    order
      ?.filter((order) => order.statusId === 3)
      .reduce((acc, order) => acc + order.total, 0) || 0;
  return (
    <>
      <h1 className="text-[32px] font-bold mb-4">Bảng điều khiển</h1>
      <div className=" flex gap-4 w-full">
        <BoxWrapper>
          <div className="">
            <span className="text-sm text-gray-500 font-light">
              Tổng khách hàng
            </span>
            <div className="flex items-center">
              <strong className="text-3xl font-semibold pt-4">
                {usersCount}
              </strong>
            </div>
            <div className="div"></div>
          </div>
          <div className=" rounded-full h-16 w-16 bg-violet-200 opacity-70 flex items-center justify-center">
            <IoPeople className="text-4xl text-indigo-700  " />
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className="">
            <span className="text-sm text-gray-500 font-light">
              Tổng đơn hàng
            </span>
            <div className="flex items-center">
              <strong className="text-3xl font-semibold pt-4">
                {order?.length}
              </strong>
            </div>
            <div className="div"></div>
          </div>
          <div className=" rounded-full h-16 w-16 bg-yellow-200 opacity-70 flex items-center justify-center">
            <IoCart className="text-4xl text-yellow-500 " />
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className="">
            <span className="text-sm text-gray-500 font-light">Doanh thu</span>
            <div className="flex items-center">
              <strong className="text-3xl font-semibold pt-4">
                ${totalRevenue?.toLocaleString()}
              </strong>
            </div>
            <div className="div"></div>
          </div>
          <div className=" rounded-full h-16 w-16 bg-green-200 opacity-70 flex items-center justify-center">
            <IoBarChartSharp className="text-4xl text-green-500 " />
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className="">
            <span className="text-sm text-gray-500 font-light">Sản phẩm</span>
            <div className="flex items-center">
              <strong className="text-3xl font-semibold pt-4">
                {products?.length}
              </strong>
            </div>
            <div className="div"></div>
          </div>
          <div className=" rounded-full h-16 w-16 bg-red-200 opacity-70 flex items-center justify-center">
            <IoCube className="text-4xl text-red-500  " />
          </div>
        </BoxWrapper>
      </div>
    </>
  );
}

export default DashboardStat;

function BoxWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-1 items-center justify-between">
      {children}
    </div>
  );
}
