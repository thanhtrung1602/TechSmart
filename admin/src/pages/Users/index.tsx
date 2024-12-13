import useGet from "~/hooks/useGet";
import Users from "~/models/Users";
import { FiRefreshCw } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usePatch } from "~/hooks/usePost";
import { MdBlock } from "react-icons/md";
import Modal from "~/components/Modal/Modal";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";

function User() {
  const [isBanning, setIsBanning] = useState<number | null>(null);
  const { mutate: banUser } = usePatch();
  const queryClient = useQueryClient();
  const { data: getUsers } = useGet<Users[] | undefined>("/users/getAllUser");
  const [users, setUsers] = useState<Users[] | undefined>(getUsers);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const user = useSelector((state: RootState) => state.socket.user);

  useEffect(() => {
    setUsers((prev) => prev?.map((u) => (u?.id === user?.id ? user : u)));
  }, [user]);

  const handleBanUser = (userId: number, isBanned: boolean) => {
    setIsBanning(userId);

    banUser(
      { url: `/users/BanUser/${userId}`, data: { isBanned } },
      {
        onSuccess: (res) => {
          if (res.status === 200) {
            // Cập nhật trực tiếp danh sách người dùng
            setUsers((prev) =>
              prev?.map((user) =>
                user.id === userId ? { ...user, ban: res.data.newBanStatus } : user
              )
            );

            // Hiển thị thông báo
            toast.success(
              isBanned ? "Người dùng đã bị chặn" : "Người dùng đã được bỏ chặn"
            );
          } else {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
          }
          setIsBanning(null);
        },
        onError: (error) => {
          toast.error(`Không thể cập nhật trạng thái: ${error.message}`);
          setIsBanning(null);
        },
      }
    );
  };

  const handleOpenModal = (userId: number) => {
    setSelectedUserId(userId);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
    setOpen(false);
  };

  // Hàm lọc và tìm kiếm danh sách người dùng
  const filteredUsers = users?.filter((user) => {
    const matchesSearchTerm = user.fullname
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "" ||
      (filterStatus === "Bị chặn" && user.ban === true) ||
      (filterStatus === "Không bị chặn" && user.ban === false);

    return matchesSearchTerm && matchesStatus;
  });

  return (
    <>
      <div className="min-h-screen">
        <h1 className="text-[32px] font-bold mb-4">Danh sách khách hàng</h1>
        <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div className="flex space-x-4">
            <select
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Trạng thái</option>
              <option value="Bị chặn">Bị chặn</option>
              <option value="Không bị chặn">Không bị chặn</option>
            </select>

            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
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
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">ID</th>
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">Tên Tài Khoản</th>
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">Gmail</th>
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">Số điện thoại</th>
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">Bom</th>
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">Chặn</th>
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
                        className={`w-full rounded-lg py-2 shadow-md transition-colors ${user.ban
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                        onClick={() => handleOpenModal(user.id)}
                      >
                        {user.ban ? "Đã chặn" : "Chặn"}
                      </button>
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

      {/* Modal xác nhận */}
      <Modal open={open} onClose={handleCloseModal}>
        <div className="p-6 text-center">
          <MdBlock size={56} className="mx-auto text-red-500" />
          <div className="my-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {users?.find((user) => user.id === selectedUserId)?.ban
                ? "Xác nhận bỏ chặn người dùng"
                : "Xác nhận chặn người dùng"}
            </h3>
            <p className="text-sm text-gray-500">
              {users?.find((user) => user.id === selectedUserId)?.ban
                ? "Bạn muốn bỏ chặn người dùng này?"
                : "Bạn muốn chặn người dùng này?"}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className="w-full bg-red-500 hover:bg-red-600 rounded-lg shadow text-white"
              onClick={() => {
                handleBanUser(
                  selectedUserId!,
                  !(users?.find((user) => user.id === selectedUserId)?.ban ?? false)
                );
                handleCloseModal();
              }}
            >
              {users?.find((user) => user.id === selectedUserId)?.ban ? "Bỏ chặn" : "Chặn"}
            </button>
            <button
              onClick={handleCloseModal}
              className="w-full bg-white hover:bg-gray-100 text-gray-600 rounded-lg py-2 shadow-md transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>

    </>
  );
}

export default User;
