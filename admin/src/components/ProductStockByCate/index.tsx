import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import useGet from "~/hooks/useGet";
import Products from "~/models/Products";
import Categories from "~/models/Categories";
import type { CTooltip } from "~/types/toolTip";

export default function ProductStockByCate() {
  const { data: products } = useGet<Products[]>("/products/findAll");
  const { data: categories } = useGet<Categories[]>(
    "/categories/getAllCategories"
  );

  if (!products || !categories) {
    return <div>Loading...</div>;
  }

  const categoryProductCounts = categories?.map((category) => {
    const productCount =
      products?.filter((product) => product.categoryId === category.id)
        ?.length || 0;
    return {
      name: category.name,
      value: productCount,
    };
  });

  const color = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF7777",
    "#8884d8",
  ];

  return (
    <div className="bg-white rounded-lg p-6 w-full">
      <div className="w-full h-[250px] mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={categoryProductCounts}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {color?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={color[index]} />
              ))}
            </Pie>
            <Legend layout="vertical" align="right" verticalAlign="middle" />
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: CTooltip) => {
  if (active && payload && payload?.length) {
    return (
      <div className="custom-tooltip bg-white shadow-lg rounded-lg p-2">
        <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};
