import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import useGet from "~/hooks/useGet";
import Users from "~/models/Users";
import type { CTooltip } from "~/types/toolTip";
import dayjs from "dayjs";

export default function TotalUser() {
  const { data: users } = useGet<Users[]>("users/getAllUser");

  const data = users?.reduce((acc, user) => {
    const date = dayjs(user.createdAt).format("DD/MM/YYYY");
    // Tìm xem ngày này đã có trong danh sách chưa
    const existingEntry = acc?.find((entry) => entry.date === date);
    if (existingEntry) {
      existingEntry.total += 1; // Tăng tổng số người dùng cho ngày đó
    } else {
      acc.push({ date, total: 1 }); // Tạo ngày mới
    }
    return acc;
  }, [] as { date: string; total: number }[]);

  return (
    <div className="bg-white rounded-lg p-6 w-full">
      <div className="w-full h-[250px] mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="total"
              fill="#8884d8"
              stroke="#8884d8"
            />
          </LineChart>
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
        <p className="label text-[#8884d8]">{`Tổng khách hàng: ${total}`}</p>
      </div>
    );
  }

  return null;
};
