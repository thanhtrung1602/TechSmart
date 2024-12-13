import type { GridItem } from "~/types/gridItem";
import ProductStockByCate from "~/components/ProductStockByCate";
import Revenue from "~/components/Revenue";
import StatisticalRevenue from "~/components/StatisticalRevenue";
import TotalUser from "~/components/TotalUser";
import OrderSummary from "~/components/OrderSummary";
import ProductSummary from "~/components/ProductSummary";

export default function Statistical() {
    return (
        <div className="min-h-screen ">
            <h1 className="text-[32px] font-bold mb-4 flex justify-start">Thống kê</h1>
            <div className="flex flex-col items-center justify-center py-2 md:px-8 xl:px-10 ">
                <div className="w-full mb-6 gap-4  ">
                    <OrderSummary />
                </div>
                <div className="w-full mb-6 gap-4 grid grid-cols-3 ">
                    <GridItem
                        title="Doanh thu"
                        className="col-span-2">
                        <Revenue />
                    </GridItem>
                    <GridItem
                        title="Thống kê doanh thu"
                        className="col-span-1">
                        <StatisticalRevenue />
                    </GridItem>
                </div>
                <div className="w-full mb-6 gap-4  ">
                    <ProductSummary />
                </div>
                <div className="w-full gap-4 grid grid-cols-3">
                    <GridItem
                        title="Sản phẩm"
                        className="col-span-1">
                        <ProductStockByCate />
                    </GridItem>
                    <GridItem
                        title="Khách hàng"
                        className="col-span-2">
                        <TotalUser />
                    </GridItem>
                </div>
            </div>
        </div>
    );
}

function GridItem({ title, children, className }: GridItem) {
    return (
        <div className={`flex flex-col items-center justify-center shadow-lg rounded-lg h-[400px] bg-white ${className}`}>
            <h3 className="text-2xl font-semibold text-black mb-1">{title}</h3>
            {children}
        </div>
    );
};
