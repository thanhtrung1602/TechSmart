export function getOrderStatus(status: string) {
  switch (status) {
    case "Đang xử lý":
      return (
        <span className="capitalize  text-xs text-sky-600 ">
          {status.replace("_", " ").toLowerCase()}
        </span>
      );
    case "Đang giao":
      return (
        <span className="capitalize  rounded-md text-xs text-yellow-600 ">
          {status.replace("_", " ").toLowerCase()}
        </span>
      );
    case "Hoàn tất":
      return (
        <span className="capitalize  rounded-md text-xs text-teal-600 ">
          {status.replace("_", " ").toLowerCase()}
        </span>
      );
    case "Đã huỷ":
      return (
        <span className="capitalize  rounded-md text-xs text-red-600 ">
          {status.replace("_", " ").toLowerCase()}
        </span>
      );
    case "Trả hàng/Hoàn tiền":
      return (
        <span className="capitalize  rounded-md text-xs text-orange-600 ">
          {status.replace("_", " ").toLowerCase()}
        </span>
      );
    default:
      return (
        <span className="capitalize  rounded-md text-xs text-gray-600">
          {status.replace("_", " ").toLowerCase()}
        </span>
      );
  }
}
