import React, { useState, useEffect } from "react";
import {
  FiRefreshCw,
  FiMessageCircle,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { HiOutlineTrash, HiOutlinePencilAlt } from "react-icons/hi";
import { CiLock } from "react-icons/ci";
import PaginationList from "~/components/PaginationList";
import Comments from "~/models/Comment";
import useGet from "~/hooks/useGet";
import FormComment from "~/components/formComment";
import useDelete from "~/hooks/useDelete.tsx";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store.ts";
import { useQueryClient } from "@tanstack/react-query";
import { Modal } from "@mui/material";

const CommentList = () => {
  const COMMENT_STATUS = {
    PENDING: "Chờ xử lý",
    RESOLVED: "Đã phản hồi",
  };

  const [statusComment, setStatusComment] = useState<string>(
    COMMENT_STATUS.PENDING
  );
  const [comments, setComments] = useState<Comments[]>([]);
  const [commentId, setCommentId] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalComments, setTotalComments] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteComment } = useDelete();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const newComment = useSelector((state: RootState) => state.socket.comments);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const urlPagination = (page: number, size: number) => {
    return `/comments/getAllComment?page=${page}&size=${size}`;
  };

  const { data: commentsPagination = { total: 0, rows: [] } } = useGet<{
    total: number;
    rows: [];
  }>(urlPagination(currentPage, itemsPerPage));

  useEffect(() => {
    if (commentsPagination && commentsPagination?.rows && commentsPagination?.total) {
      setComments(commentsPagination?.rows);
      setTotalComments(commentsPagination?.total);
    } else {
      setComments([]);
    }
  }, [commentsPagination.rows, commentsPagination.total]);

  useEffect(() => {
    if (newComment) {
      setComments(newComment);
    }
  }, [newComment]);

  const handlePageClick = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!commentsPagination) {
    return <div>Loading...</div>;
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      [COMMENT_STATUS.PENDING]: {
        color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        icon: <CiLock size={14} className="mr-1" />,
        text: "Chờ xử lý",
      },
      [COMMENT_STATUS.RESOLVED]: {
        color: "bg-green-100 text-green-800 border border-green-200",
        icon: <FiCheckCircle size={14} className="mr-1" />,
        text: "Đã phản hồi",
      },
    };

    const config = statusConfig[status] || statusConfig[COMMENT_STATUS.PENDING];

    return (
      <span
        className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.icon}
        {config.text}
      </span>
    );
  };

  const handleDelete = () => {
    if (!isDeleting) return;
    deleteComment(
      {
        url: `/comments/deleteComment/${isDeleting}`,
      },
      {
        onSuccess: (response) => {
          console.log(response);

          if (response.status === 200) {
            queryClient.invalidateQueries({
              queryKey: [
                `/products/getAllProducts?page=${currentPage}&size=${itemsPerPage}`,
              ],
            });
            setOpen(false);
            setIsDeleting(null);
            toast.success("Bình luận đã được xóa thành công");
            window.location.reload();
          }
        },
        onError: (error) => {
          alert("Error deleting category: " + error.message);
          toast.error("Có lỗi xảy ra khi xóa sản phẩm");
          setIsDeleting(null);
        },
      }
    );
  };

  const openModal = (commentId: number) => {
    setCommentId(commentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const reload = () => {
    window.location.reload();
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {isModalOpen && (
        <div
          className="fixed inset-0 w-full flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-[800px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
            <FormComment id={commentId} />
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý bình luận
          </h1>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={reload}
            >
              <FiRefreshCw size={16} />
              Làm mới
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-4 items-center justify-end">
              <div className="flex gap-3">
                <select
                  onChange={(e) => setStatusComment(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option defaultChecked defaultValue={COMMENT_STATUS.PENDING}>
                    Chờ xử lý
                  </option>
                  <option value={COMMENT_STATUS.RESOLVED}>Đã phản hồi</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {comments?.map((comment) => {
              const paragraphs: string[] | undefined = comment?.comment
                ? comment?.comment.split("\n")
                : undefined;
              return !comment?.isAdmin && statusComment === comment?.status ? (
                <div
                  key={comment?.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {comment?.userData?.fullname} | {comment?.userData?.phone}
                        </h3>
                        <StatusBadge status={comment?.status} />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{comment?.productData?.name}</span>
                        <span>•</span>
                        <span>Mã SP: {comment?.productId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <HiOutlinePencilAlt
                          size={18}
                          className="text-gray-500"
                        />
                      </button>
                      {/* <button className="p-1 hover:bg-gray-100 rounded">
                        <HiOutlineTrash size={18} className="text-gray-500" />
                      </button> */}

                      <button
                        onClick={() => {
                          setOpen(true);
                          setIsDeleting(comment.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <HiOutlineTrash size={18} className="text-gray-500" />
                      </button>
                      <Modal open={open} onClose={() => setOpen(false)}>
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                          {" "}
                          {/* Full screen overlay to center modal */}
                          <div className="text-center w-auto bg-white rounded-lg shadow-lg p-6">
                            <HiOutlineTrash
                              size={56}
                              className="mx-auto text-red-500"
                            />
                            <div className="mx-auto my-4">
                              <h3 className="text-lg font-bold text-gray-800">
                                Xác nhận xóa
                              </h3>
                              <p className="text-sm text-gray-500 my-2">
                                Bạn muốn xóa bình luận mục này?
                              </p>
                            </div>
                            <div className="flex gap-4">
                              <button
                                onClick={() => handleDelete()}
                                className="w-full bg-red-500 hover:bg-red-600 rounded-lg shadow text-white"
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
                        </div>
                      </Modal>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-gray-600">
                      {paragraphs?.map((paragraph, idx) => (
                        <p key={idx} className="mb-2">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiClock size={14} />
                        {new Date(comment.createdAt).toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiMessageCircle size={14} />
                        phản hồi
                      </span>
                    </div>
                    <button
                      className="text-blue-500 hover:text-blue-600 font-medium"
                      onClick={() => openModal(comment.id)}
                    >
                      Phản hồi
                    </button>
                  </div>
                </div>
              ) : (
                ""
              );
            })}
          </div>
        </div>

        {totalComments > 0 && (
          <PaginationList
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalProducts={totalComments}
            handlePageClick={handlePageClick}
          />
        )}
      </div>
    </div>
  );
};

export default CommentList;
