import { useState } from "react";
import useGet from "~/hooks/useGet";
import useDelete from "~/hooks/useDelete";
import toast from "react-hot-toast";
import Contacts from "~/models/Contact";
import Modal from "~/components/Modal/Modal";
import { HiOutlineTrash } from "react-icons/hi";
import { useQueryClient } from "@tanstack/react-query";

function Contact() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State cho từ khóa tìm kiếm
  const queryClient = useQueryClient();
  const { data: contact, isError } = useGet<Contacts[]>(
    `/contact/getAllContacts`
  );
  const { mutate: deleteCategory } = useDelete();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = () => {
    if (!isDeleting) return;
    deleteCategory(
      {
        url: `/contact/deleteContact/${isDeleting}`,
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            queryClient.invalidateQueries({
              queryKey: ["/contact/getAllContacts"],
            });
            setOpen(false);
            setIsDeleting(null);
            toast.success("Liên hệ đã được xóa thành công");
          }
        },
        onError: () => {
          toast.error("Có lỗi xảy ra khi xóa liên hệ");
          setIsDeleting(null);
        },
      }
    );
  };

  // Lọc danh sách liên hệ theo từ khóa tìm kiếm
  const filteredContacts = contact?.filter((item) => {
    const lowerCaseSearchTerm = searchTerm?.trim().toLowerCase() ?? ""; // Loại bỏ khoảng trắng thừa

    return (
      item.fullName.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.phone.includes(lowerCaseSearchTerm)
    );
  });

  // Xử lý lỗi khi không tải được dữ liệu
  if (isError) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Không thể tải dữ liệu liên hệ. Vui lòng thử lại sau.
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <h1 className="text-[32px] font-bold mb-4">Liên hệ</h1>
      <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <form className="relative w-96">
          <input
            type="text"
            className="w-full h-10 bg-slate-100 rounded-2xl border border-neutral-300 pl-4 pr-4 placeholder-opacity-60 text-neutral-800 focus:outline-none"
            placeholder="Tìm kiếm theo họ tên, email, hoặc số điện thoại"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      <div className="grid grid-cols-3 gap-6 p-4">
        {filteredContacts && filteredContacts?.length > 0 ? (
          filteredContacts?.map((contact) => (
            <div key={contact.id} className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-left">
                <h2 className="text-lg font-semibold">
                  Họ tên: {contact.fullName}
                </h2>
                <p className="text-gray-500">Email: {contact.email}</p>
                <p className="text-gray-500">Số điện thoại: {contact.phone}</p>
                <p className="text-gray-500">
                  Ngày:{" "}
                  {new Date(contact.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <p className="text-gray-500">Nội dung: {contact.text}</p>
              </div>
              <div className="mt-4 text-center flex items-center justify-center gap-1">
                <button
                  onClick={() => {
                    setOpen(true);
                    setIsDeleting(contact.id);
                  }}
                  disabled={isDeleting === contact.id}
                  className={`flex items-center justify-center space-x-2 py-2 px-4 ${isDeleting === contact.id
                    ? "bg-red-300 text-red-600 cursor-not-allowed"
                    : "bg-red-100 text-[#EF3826] hover:text-red-600 hover:bg-red-300"
                    } rounded-lg duration-500`}
                >
                  {isDeleting === contact.id ? "Đang xóa..." : "Xóa"}
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
                        Bạn muốn xóa liên hệ này?
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleDelete()}
                        className="w-full py-2 bg-red-500 hover:bg-red-600 rounded-lg shadow text-white"
                      >
                        Xóa
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
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            Không tìm thấy liên hệ nào.
          </div>
        )}
      </div>
    </div>
  );
}

export default Contact;
