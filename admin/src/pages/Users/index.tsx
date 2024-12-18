import useGet from "~/hooks/useGet";
import Users from "~/models/Users";
import { FiRefreshCw } from "react-icons/fi";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usePatch } from "~/hooks/usePost";
import Modal from "~/components/Modal/Modal";
import { useNavigate } from "react-router-dom";

function User() {
  const [isBanning, setIsBanning] = useState<number | null>(null);
  const { mutate: banUser } = usePatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: users } = useGet<Users[]>("/users/getAllUser");
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const handleBanUser = () => {
    if (!isBanning) return;
    banUser(
      {
        url: `/users/BanUser/${isBanning}`,
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            queryClient.invalidateQueries({
              queryKey: [`/users/getAllUser`],
            });
            toast.success("Cập nhật thành công");
            setOpen(false);
            setIsBanning(null);
          }
        },
        onError: (error) => {
          alert("Error deleting category: " + error.message);
          toast.error("Có lỗi xảy ra ");
          setIsBanning(null);
          navigate("/users");
        },
      }
    );
  };

  // Hàm lọc và tìm kiếm danh sách người dùng
  const filteredUsers = users?.filter((user) => {
    const matchesSearchTerm = user.fullname
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "" ||
      (filterStatus === "true" && user.ban === true) ||
      (filterStatus === "false" && user.ban === false);

    return matchesSearchTerm && matchesStatus;
  });

  return (
    <>
      <div className="min-h-screen">
        <h1 className="text-[32px] font-bold mb-4">Danh sách khách hàng</h1>
        <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div className="flex space-x-4">
            {/* Dropdown lọc trạng thái */}
            <select
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="" disabled hidden>
                Tất cả
              </option>
              <option value="false">Không bị chặn</option>
              <option value="true">Bị chặn</option>
            </select>
            {/* Input tìm kiếm */}
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <button
              className="flex items-center space-x-2 py-2 px-4 text-red-600 bg-red-50 hover:bg-red-100  rounded-lg"
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("");
              }}
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Bỏ lọc</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-300">
              <tr className="text-center">
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                  ID
                </th>
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                  Tên Tài Khoản
                </th>
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                  Gmail
                </th>
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                  Số điện thoại
                </th>
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                  Bom
                </th>
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                  Chặn
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers && filteredUsers?.length > 0 ? (
                filteredUsers?.map((user) => (
                  <tr key={user.id} className="text-center">
                    <td className="py-3 px-4 border-b">{user.id}</td>
                    <td className="py-3 px-4 border-b">{user.fullname}</td>
                    <td className="py-3 px-4 border-b">{user.email}</td>
                    <td className="py-3 px-4 border-b">{user.phone}</td>
                    <td className="py-3 px-4 border-b">{user.bom}</td>
                    <td className="py-3 px-4 border-b">
                      <button
                        onClick={() => {
                          setOpen(true);
                          setIsBanning(user.id); // Chuyển thành setIsUpdating(category.id) nếu cần
                        }}
                        disabled={isBanning === user.id} // Điều kiện này vẫn giữ nguyên
                        className={`w-[100%] flex items-center justify-center py-2 px-4 rounded-tr-md   ${
                          user.ban === false
                            ? "bg-red-100 text-red-500 hover:text-red-600 hover:bg-red-300"
                            : "bg-green-100 text-green-500 hover:text-green-600 hover:bg-green-300"
                        }`}
                      >
                        {user.ban === false ? <p>Chặn</p> : <p>Bỏ chặn</p>}
                      </button>

                      <Modal open={open} onClose={() => setOpen(false)}>
                        <div className="text-center w-auto">
                          {/* Conditional icon rendering */}
                          {user.ban === false ? (
                            <MdBlock
                              size={56}
                              className="mx-auto text-red-500"
                            />
                          ) : (
                            <MdBlock
                              size={56}
                              className="mx-auto text-green-500"
                            />
                          )}
                          <div className="mx-auto my-4">
                            <h3 className="text-lg font-bold text-gray-800">
                              {user.ban === true
                                ? "Xác nhận bỏ chặn sản phẩm"
                                : "Xác nhận chặn sản phẩm"}
                            </h3>
                            <p className="text-sm text-gray-500 my-2">
                              {user.ban === true
                                ? "Bạn có muốn bỏ chặn sản phẩm này không?"
                                : "Bạn có muốn chặn sản phẩm này không?"}
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <button
                              onClick={() => handleBanUser()}
                              className="w-full bg-red-500 hover:bg-red-600 rounded-lg shadow text-white"
                            >
                              {user.ban === true ? "Bỏ chặn" : "Chặn"}
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 px-4 border-b" colSpan={6}>
                    No Users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal for Ban/Unban */}
    </>
  );
}

export default User;
