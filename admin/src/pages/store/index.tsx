import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Modal from "~/components/Modal/Modal";
import useDelete from "~/hooks/useDelete";
import useGet from "~/hooks/useGet";
import InterStore from "~/models/Store";

function Store() {
  // Lấy dữ liệu cửa hàng từ API
  const { data: store } = useGet<InterStore[]>("/store/findAll");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: deleteStore } = useDelete();
  const [open, setOpen] = useState(false);
  //search
  const [searchTerm, setSearchTerm] = useState("");

  // Trạng thái xoá và lựa chọn tỉnh/thành phố
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [SelectedDistrict, setSelectedDistrict] = useState<string>("");

  const handleDelete = () => {
    if (!isDeleting) return;
    deleteStore(
      {
        url: `/store/delStore/${isDeleting}`,
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            queryClient.invalidateQueries({ queryKey: ["/store/FindAll"] });
            setIsDeleting(null);
            toast.success("Sản phẩm đã được xóa thành công");
            navigate(0);
          }
        },
        onError: (error) => {
          alert("Error deleting store: " + error.message);
          toast.error("Có lỗi xảy ra khi xóa sản phẩm");
          setIsDeleting(null);
        },
      }
    );
  };

  // Hàm xử lý thay đổi tỉnh/thành phố
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value);
  };
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value); // Cập nhật giá trị quận
  };

  // Lọc dữ liệu cửa hàng theo tỉnh/thành phố và từ khóa tìm kiếm
  const filteredStores = store?.filter((s) => {
    const lowerCaseSearchTerm = searchTerm?.trim().toLowerCase() || "";

    if (lowerCaseSearchTerm === "" && !selectedProvince && !SelectedDistrict) {
      return true; // Không áp dụng lọc nếu không có điều kiện
    }

    const matchesProvince =
      !selectedProvince || s.province?.name === selectedProvince;
    const matchesDistrict =
      !SelectedDistrict || s.district?.name === SelectedDistrict;

    const matchesSearchTerm =
      !searchTerm ||
      (s.street?.toLowerCase().includes(lowerCaseSearchTerm) ?? false) ||
      (s.ward?.toLowerCase().includes(lowerCaseSearchTerm) ?? false) ||
      (s.district?.name?.toLowerCase().includes(lowerCaseSearchTerm) ??
        false) ||
      (s.province?.name?.toLowerCase().includes(lowerCaseSearchTerm) ??
        false) ||
      (s.codeStore?.toLowerCase().includes(lowerCaseSearchTerm) ?? false) ||
      (String(s.phone)?.toLowerCase().includes(lowerCaseSearchTerm) ?? false);

    return matchesProvince && matchesSearchTerm && matchesDistrict;
  });

  const handleClearFilters = () => {
    setSelectedProvince(""); // Reset tỉnh
    setSelectedDistrict(""); // Reset quận
    setSearchTerm(""); // Reset từ khóa
  };

  return (
    <div>
      <div className="min-h-screen">
        <h1 className="text-[32px] font-bold mb-4">Chi nhánh</h1>
        {/*  lọc và nút thêm */}
        <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div className="flex space-x-4">
            <select
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg"
              value={selectedProvince}
              onChange={handleProvinceChange}
            >
              <option value="">Tỉnh</option>
              {Array.isArray(store) &&
                [...new Set(store?.map((s) => s.province?.name))]
                  .filter(Boolean)
                  ?.map((province, index) => (
                    <option key={index} value={province}>
                      {province}
                    </option>
                  ))}
            </select>

            <select
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg"
              value={SelectedDistrict}
              onChange={handleDistrictChange}
              disabled={!selectedProvince} // Vô hiệu hóa quận nếu chưa chọn tỉnh
            >
              <option value="">Quận/Huyện</option>
              {Array.isArray(store) && selectedProvince
                ? [
                  ...new Set(
                    store
                      .filter((s) => s.province?.name === selectedProvince)
                      .map((s) => s.district?.name)
                  ),
                ]
                  .filter(Boolean)
                  ?.map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))
                : null}
            </select>
            <input
              type="text"
              placeholder="Tìm kiếm cửa hàng..."
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              className="flex items-center space-x-2 py-2 px-4 text-red-600 bg-red-50 hover:bg-red-100  rounded-lg"
              onClick={handleClearFilters} // Gọi hàm handleClearFilters
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              <span>Bỏ lọc</span>
            </button>

            <Link to="/store/add">
              <button className="text-white bg-green-500 hover:bg-green-600 flex items-center px-4 py-2 rounded-lg">
                <FiPlus className="w-4 h-4 mr-2" />
                <span>Thêm</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Bảng danh sách cửa hàng */}
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-300">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-[#202224] border-b">
                  ID
                </th>
                <th className="py-3 px-4 text-left font-semibold text-[#202224] border-b">
                  Đường
                </th>
                <th className="py-3 px-4 text-left font-semibold text-[#202224] border-b">
                  Phường
                </th>
                <th className="py-3 px-4 text-center font-semibold text-[#202224] border-b">
                  Quận
                </th>
                <th className="py-3 px-4 text-left font-semibold text-[#202224] border-b">
                  Tỉnh
                </th>
                <th className="py-3 px-4 text-left font-semibold text-[#202224] border-b">
                  SDT
                </th>
                <th className="py-3 px-4 text-left font-semibold text-[#202224] border-b">
                  Mã cửa hàng
                </th>
                <th className="py-3 px-4 text-center font-semibold text-[#202224] border-b">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredStores) ? (
                filteredStores?.map((store) => (
                  <tr key={store.id}>
                    <td className="py-3 px-4 border-b w-1/12 text-left">
                      {store.id}
                    </td>
                    <td className="py-3 px-4 border-b w-2/12 text-left">
                      {store.street}
                    </td>
                    <td className="py-3 px-4 border-b w-2/12 text-left">
                      {store.ward}
                    </td>
                    <td className="py-3 px-4 border-b w-2/12 text-center">
                      {store.district.name}
                    </td>
                    <td className="py-3 px-4 border-b w-2/12 text-left">
                      {store.province.name}
                    </td>
                    <td className="py-3 px-4 border-b w-2/12 text-left">
                      {store.phone}
                    </td>
                    <td className="py-3 px-4 border-b w-2/12 text-left">
                      {store.codeStore}
                    </td>
                    <td className="py-3 px-4 border-b w-2/12 text-center">
                      <span className="w-[100%] text-center px-4 py-2 text-xs font-semibold rounded-lg flex justify-between">
                        <Link
                          to={`/store/update/${store.id}`}
                          className="w-[100%] flex items-center py-2 px-2 text-[#319c5a] bg-green-100  rounded-tl-md rounded-bl-md duration-500 hover:text-green-600 hover:bg-green-300"
                        >
                          <HiOutlinePencilAlt className="text-lg flex items-center justify-center" />
                        </Link>
                        <button
                          className="w-[100%] flex items-center py-2 px-2 text-[#EF3826] bg-red-100 rounded-tr-md rounded-br-md duration-500 hover:text-red-600 hover:bg-red-300"
                          onClick={() => {
                            setOpen(true);
                            setIsDeleting(store.id);
                          }}
                          disabled={isDeleting === store.id}
                        >
                          <HiOutlineTrash className="text-lg flex items-center justify-center" />
                        </button>
                        <Modal
                          open={open}
                          onClose={() => {
                            setOpen(false);
                          }}
                        >
                          <div className="text-center w-auto">
                            <HiOutlineTrash
                              size={56}
                              className="mx-auto text-red-500"
                            />
                            <div className="mx-auto my-4">
                              <h3 className="text-lg font-bold text-gray-800">
                                Xác nhận xóa
                              </h3>
                              <p className="text-sm text-gray-500 my-2">
                                Bạn muốn xóa cửa hàng này?
                              </p>
                            </div>
                            <div className="flex gap-4">
                              <button
                                onClick={() => handleDelete()}
                                className="w-full bg-red-500 hover:bg-red-600 rounded-lg shadow text-white"
                              >
                                {isDeleting === store.id
                                  ? "Đang xóa..."
                                  : "Xóa"}
                              </button>
                              <button
                                className="w-full py-2 bg-white hover:bg-gray-100 rounded-lg shadow text-gray-500"
                                onClick={() => setOpen(false)}
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        </Modal>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 px-4 border-b" colSpan={8}>
                    Không tìm thấy cửa hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Store;
