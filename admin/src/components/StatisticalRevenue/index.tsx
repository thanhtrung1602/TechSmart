import { useState, useEffect } from "react";
import {
  calculateRevenueByPeriod,
  calculateComparison,
} from "./RevenueTime/index";
import useGet from "~/hooks/useGet";
import Orders from "~/models/Orders";
import { HiOutlineArrowUp, HiOutlineArrowDown } from "react-icons/hi";

type PeriodType = "week" | "month" | "year";

const periodLabelMapping: { [key in PeriodType]: string } = {
  week: "tuần",
  month: "tháng",
  year: "năm",
};

const StatisticalRevenue = () => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [period, setPeriod] = useState<PeriodType>("week");
  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [previousRevenue, setPreviousRevenue] = useState(0);
  const [dateRange, setDateRange] = useState<string>("");
  const { data: fetchedOrders } = useGet<Orders[]>("orders/FindAllOrder");

  useEffect(() => {
    if (fetchedOrders) {
      setOrders(fetchedOrders?.filter((order) => order.statusId === 3));
    }
  }, [fetchedOrders]);

  useEffect(() => {
    if (orders?.length > 0) {
      const { revenue, startDate, endDate } = calculateRevenueByPeriod(
        orders,
        period
      );
      setCurrentRevenue(revenue);
      setDateRange(
        `${startDate.format("DD/MM/YYYY")} - ${endDate.format("DD/MM/YYYY")}`
      );
      setPreviousRevenue(calculateComparison(orders, period));
    }
  }, [orders, period]);

  const calculateGrowth = (currentRevenue: number, previousRevenue: number) => {
    if (previousRevenue === 0) return 100;
    return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  };

  const growth = calculateGrowth(currentRevenue, previousRevenue);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <section className="w-full px-4">
      <div className="mt-4">
        <label className="font-medium">Thống kê theo:</label>
        <select
          className="ml-2 p-2 border r focus:outline-none rounded-md bg-white"
          value={period}
          onChange={(e) => setPeriod(e.target.value as PeriodType)}
        >
          <option value="week">Tuần</option>
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </select>
      </div>
      <div className="mt-2">
        <p>Thời gian: {dateRange}</p>
      </div>
      <div className="mt-4">
        <p>
          Doanh thu {periodLabelMapping[period]} nay:{" "}
          {formatCurrency(currentRevenue)}
        </p>
        <p>
          Doanh thu {periodLabelMapping[period]} trước:{" "}
          {formatCurrency(previousRevenue)}
        </p>
        <p
          className={`flex items-center ${
            currentRevenue > previousRevenue ? "text-green-500" : "text-red-500"
          }`}
        >
          {currentRevenue > previousRevenue ? "Tăng" : "Giảm"}:{" "}
          {growth.toFixed(2)}%
          {currentRevenue > previousRevenue ? (
            <HiOutlineArrowUp />
          ) : (
            <HiOutlineArrowDown />
          )}
        </p>
      </div>
    </section>
  );
};

export default StatisticalRevenue;
