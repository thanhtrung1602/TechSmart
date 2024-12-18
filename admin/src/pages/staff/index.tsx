import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Modal from "~/components/Modal/Modal";
import useDelete from "~/hooks/useDelete";
import useGet from "~/hooks/useGet";
import Staffs from "~/models/Staff";

function Staff() {
  const { mutate: deleteStaff } = useDelete();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [genderFilter, setGenderFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [currentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = () => {
    if (!isDeleting) return;
    deleteStaff(
      {
        url: `/staff/delStaff/${isDeleting}`,
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            queryClient.invalidateQueries({ queryKey: ["/staff/FindAll"] });
            setIsDeleting(null);
            toast.success("nhâ vien đã được xóa thành công");
            navigate(0);
          }
        },
        onError: (error) => {
          alert("Error deleting staff: " + error.message);
          toast.error("Có lỗi xảy ra khi xóa Nhân viên");
          setIsDeleting(null);
        },
      }
    );
  };

  const urlPagination = (page: number, size: number) => {
    const query = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),

      gender: genderFilter || "",
      position: positionFilter || "",
    });
    return `/staff/getAllStaffWithFilter?${query.toString()}`;
  };

  const { data: staffsPagination } = useGet<{ total: number; rows: Staffs[] }>(
    urlPagination(currentPage, itemsPerPage)
  );

  const matchesSearchTerm = (staff: Staffs) => {
    const lowerCaseSearchTerm = searchTerm?.toLowerCase() ?? "";

    return (
      !searchTerm ||
      (staff.fullName?.toLowerCase().includes(lowerCaseSearchTerm) ?? false)
    );
  };

  const filteredOrders = staffsPagination?.rows?.filter((staff) =>
    matchesSearchTerm(staff)
  );

  const resetFilters = () => {
    setGenderFilter("");
    setPositionFilter("");
  };

  return (
    <div>
      <div className="min-h-screen">
        <h1 className="text-[32px] font-bold mb-4">Nhân viên</h1>

        <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div className="flex space-x-4">
            <select
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="">Giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>

            <select
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
            >
              <option value="">Chức vụ</option>
              <option value="Nhân viên">Nhân viên</option>
              <option value="Quản lí">Quản lí</option>
            </select>

            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Tìm kiếm tên nhân viên..."
                className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={resetFilters}
              className="flex items-center space-x-2 py-2 px-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Bỏ lọc</span>
            </button>
            <div className="flex gap-2">
              <Link to="/staff/add">
                <button className="text-white bg-green-500 hover:bg-green-600 flex items-center px-4 py-2 rounded-lg">
                  <FiPlus className="w-4 h-4 mr-2" />
                  Thêm
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border ">
            <thead className="bg-gray-300">
              <tr className="border-b">
                <th className="py-3 px-4 text-center font-semibold text-[#202224]">
                  STT
                </th>
                <th className="py-3 px-4 text-center font-semibold text-[#202224]">
                  ID
                </th>
                <th className="py-3 px-4 text-center font-semibold text-[#202224] ">
                  Họ và tên
                </th>
                <th className="py-3 px-4 text-center font-semibold text-[#202224]">
                  Ngày sinh
                </th>
                <th className="py-3 px-4 text-center font-semibold text-[#202224]">
                  Ngày vào làm
                </th>
                <th className="py-3 px-4 text-center font-semibold text-[#202224]">
                  Giới tính
                </th>
                <th className="py-3 px-4 text-center font-semibold text-[#202224]">
                  SĐT
                </th>
                <th className="py-3 px-4 text-center font-semibold text-[#202224]">
                  Chức vụ
                </th>
                <th className="py-3 px-4 text-center font-semibold text-[#202224]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders && filteredOrders?.length > 0 ? (
                filteredOrders?.map((staff, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 text-center ">{index + 1}</td>
                    <td className="py-3 px-4 text-center ">{staff.id}</td>
                    <td className="py-3 px-4 text-center ">{staff.fullName}</td>
                    <td className="py-3 px-4 text-center ">
                      {staff.date_of_birth
                        ? new Date(staff.date_of_birth).toLocaleDateString(
                          "vi-VN"
                        )
                        : ""}
                    </td>
                    <td className="py-3 px-4 text-center ">
                      {staff.hire_date
                        ? new Date(staff.hire_date).toLocaleDateString("vi-VN")
                        : ""}
                    </td>
                    <td className="py-3 px-4 text-center ">{staff.gender}</td>
                    <td className="py-3 px-4 text-center ">{staff.phone}</td>
                    <td className="py-3 px-4 text-center ">{staff.position}</td>
                    <td className="py-3 px-4 w-2/12 text-center">
                      <span className="w-[100%] text-center px-4 py-2 text-xs font-semibold rounded-lg flex justify-between">
                        <Link
                          to={`/staff/update/${staff.id}`}
                          className="w-[100%] flex items-center justify-center py-2 px-4 text-[#319c5a] bg-green-100 rounded-tl-md rounded-bl-md duration-500 hover:text-green-600 hover:bg-green-300"
                        >
                          <HiOutlinePencilAlt className="text-lg flex items-center justify-center" />
                        </Link>
                        <button
                          className="w-[100%] flex items-center justify-center py-2 px-4 text-[#EF3826] bg-red-100 rounded-tr-md rounded-br-md duration-500 hover:text-red-600 hover:bg-red-300"
                          onClick={() => {
                            setOpen(true);
                            setIsDeleting(staff.id);
                          }}
                          disabled={isDeleting === staff.id}
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
                                Bạn muốn xóa nhân viên này?
                              </p>
                            </div>
                            <div className="flex gap-4">
                              <button
                                onClick={() => handleDelete()}
                                className="w-full bg-red-500 hover:bg-red-600 rounded-lg shadow text-white"
                              >
                                {isDeleting === staff.id
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
                  <td className="py-3 px-4 text-center" colSpan={8}>
                    Không tìm thấy cửa nhân viên nào
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

export default Staff;
