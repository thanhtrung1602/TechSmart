import { TbChecklist } from "react-icons/tb";
import { LuPackageCheck, LuPackageOpen, LuPackageX } from "react-icons/lu";
function SuccessOrder({ statusId }: { statusId: number | undefined }) {
  console.log("check statusId", statusId);
  return (
    <div className="flex flex-wrap justify-between mb-6 md:flex-nowrap">
      {/* Đặt hàng */}
      <div className="flex flex-col items-center w-full sm:w-auto">
        <div className="w-10 sm:w-12 h-10 sm:h-12 border-2 border-green-500 rounded-full flex items-center justify-center">
          <TbChecklist size={20} className="sm:size-24 text-green-500" />
        </div>
        <span className="mt-2 text-sm sm:text-base">Đặt hàng</span>
      </div>
  
      {/* Đường nối đầu tiên */}
      <div className="flex-1 border-t-2 border-green-500 mx-2 mt-4 sm:mt-6"></div>
  
      {/* Đang xử lý */}
      <div className="flex flex-col items-center w-full sm:w-auto">
        <div className="w-10 sm:w-12 h-10 sm:h-12 border-2 border-green-500 rounded-full flex items-center justify-center">
          <LuPackageOpen size={20} className="sm:size-24 text-green-500" />
        </div>
        <span className="mt-2 text-sm sm:text-base">Đang xử lý</span>
      </div>
  
      {/* Đường nối thứ hai */}
      <div
        className={`flex-1 border-t-2 ${
          statusId === 3
            ? "border-green-500"
            : statusId === 4
            ? "border-red-500"
            : "border-gray-500"
        } mx-2 mt-4 sm:mt-6`}
      ></div>
  
      {/* Hoàn tất hoặc Đã hủy */}
      <div className="flex flex-col items-center w-full sm:w-auto">
        <div
          className={`w-10 sm:w-12 h-10 sm:h-12 border-2 ${
            statusId === 3
              ? "border-green-500"
              : statusId === 4
              ? "border-red-500"
              : "border-gray-500"
          } rounded-full flex items-center justify-center`}
        >
          {statusId === 4 ? (
            <LuPackageX
              size={20}
              className={`${
                statusId === 4 ? "text-red-500" : "text-gray-500"
              } sm:size-24`}
            />
          ) : (
            <LuPackageCheck
              size={20}
              className={`${
                statusId === 3 ? "text-green-500" : "text-gray-500"
              } sm:size-24`}
            />
          )}
        </div>
        {statusId === 4 ? (
          <span className="mt-2 text-sm sm:text-base">Đã Hủy</span>
        ) : (
          <span className="mt-2 text-sm sm:text-base">Hoàn tất</span>
        )}
      </div>
    </div>
  );
  
  
}

export default SuccessOrder;
