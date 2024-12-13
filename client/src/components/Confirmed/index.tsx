import { GoDotFill } from "react-icons/go";

export default function Confirmed() {
    return (
        <div className="w-auto mx-auto mt-2 space-y-2">
            <div className="border border-gray-300 rounded-lg">
                <h2 className="text-md font-semibold mb-2 bg-gray-100 w-full p-2 rounded-t-lg">Yên tâm mua hàng</h2>
                <ul className="space-y-2 text-sm px-3 py-1">             
                    <li className="flex items-center space-x-2">
                        <GoDotFill className="text-green-600" />
                        <span>Sản phẩm chính hãng 100%</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <GoDotFill className="text-green-600" />
                        <span>Trả góp lãi suất 0% toàn bộ giỏ hàng</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <GoDotFill className="text-green-600" />
                        <span>Trả bảo hành tận nơi sử dụng</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <GoDotFill className="text-green-600" />
                        <span>Bảo hành tận nơi cho doanh nghiệp</span>
                    </li>
                </ul>
            </div>
            <div className="border border-gray-300 rounded-lg">
                <h2 className="text-md font-semibold mb-2 bg-gray-100 w-full p-2 rounded-t-lg">Miễn phí giao hàng</h2>
                <ul className="space-y-2 text-sm px-3 py-1">
                    <li className="flex items-center space-x-2">
                        <GoDotFill className="text-green-600" />
                        <span>Giao hàng trong vòng 24h</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <GoDotFill className="text-green-600" />
                        <span>Giao hàng miễn phí trên toàn quốc</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <GoDotFill className="text-green-600" />
                        <span>Nhận hàng và thanh toán tại nhà</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}
