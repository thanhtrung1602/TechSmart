import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import useGet from "~/hooks/useGet";
import Orders from "~/models/Orders";
import type { CTooltip } from "~/types/toolTip";

export default function TransactionChart() {
  const { data: order } = useGet<Orders[]>("orders/FindAllOrder");

  const data = order
    ?.filter((order) => order.statusId === 3)
    .reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-GB");
      const lastEntry = acc[acc?.length - 1];

      if (lastEntry && lastEntry.date === date) {
        lastEntry.total += order.total;
      } else {
        acc.push({
          date,
          total: lastEntry ? lastEntry.total + order.total : order.total,
        });
      }
      return acc;
    }, [] as { date: string; total: number }[]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg w-full">
      <strong className="text-xl pt-4 pl-4 font-bold">Sơ đồ doanh thu</strong>
      <div className="w-full h-[300px] mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 45, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis axisLine={false} tickMargin={10} dataKey="date" />
            <YAxis axisLine={false} tickMargin={10} />
            <CartesianGrid
              vertical={false}
              horizontal={true}
              strokeDasharray="1 1"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
const CustomTooltip = ({ active, payload }: CTooltip) => {
  if (active && payload && payload?.length) {
    const { date, total } = payload[0].payload;

    return (
      <div className="custom-tooltip bg-white shadow-lg rounded-lg p-2">
        <p className="label">{`Ngày: ${date}`}</p>
        <p className="label text-[#8884d8]">{`Tổng: ${total?.toLocaleString()}`}</p>
      </div>
    );
  }

  return null;
};
