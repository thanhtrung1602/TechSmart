import HotProduct from "./HotProduct";
import PoorProduct from "./PoorProduct";

export default function ProductSummary  () {
    return (
        <div className="flex flex-row gap-3">
            <HotProduct />
            <PoorProduct />
        </div>
    )    
}