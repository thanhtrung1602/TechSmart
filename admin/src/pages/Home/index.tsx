import DashboardStat from "~/layouts/components/DashboardStat/DashboardStat";
import TransactionChart from "~/layouts/components/TransactionChart/TransactionChart";
import RecentOrders from "~/layouts/components/RecentOrders/RecentOrders";
import HotProduct from "~/layouts/components/HotProduct/HotProduct";
function Home() {
  return (
    <div className="flex flex-col gap-4">
      <DashboardStat />
      <TransactionChart />
      <div className="flex flex-row gap-4 w-full">
        <RecentOrders />
        <HotProduct />
      </div>
    </div>
  );
}

export default Home;
