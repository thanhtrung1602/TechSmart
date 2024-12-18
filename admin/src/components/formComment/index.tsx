import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CiLock } from "react-icons/ci";
import { FiCheckCircle } from "react-icons/fi";
import { useSelector } from "react-redux";
import useGet from "~/hooks/useGet";
import usePost from "~/hooks/usePost";
import Comments from "~/models/Comment";
import { RootState } from "~/redux/store";

export default function FormComment({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const { data: comment } = useGet<Comments>(`/comments/findOne/${id}`);
  const [content, setContent] = useState<string>("");
  const adminProfile = useSelector(
    (state: RootState) => state.adminProfile.adminProfile
  );
  const { mutate } = usePost();

  const COMMENT_STATUS = {
    PENDING: "pending",
    IN_PROGRESS: "inProgress",
    RESOLVED: "resolved",
  };

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

  const handleSendComment = () => {
    const data = {
      userId: adminProfile?.id,
      productId: comment?.productId,
      comment: content,
      commentId: id,
      isAdmin: true,
      status: "Đã phản hồi",
    };
    mutate(
      { url: "/comments/createComment", data },
      {
        onSuccess: (res) => {
          if (res.status === 200) {
            setContent("");
            queryClient.invalidateQueries({
              queryKey: [`/comments/findOne/${id}`],
            });
            queryClient.invalidateQueries({
              queryKey: [`/comments/getAllComment`],
            });
          }
        },
      }
    );
  };

  const paragraphs: string[] | undefined = comment?.comment
    ? comment?.comment.split("\n")
    : undefined;
  return (
    <div>
      {comment ? (
        <div className="border rounded-lg p-4 h-[calc(100vh-280px)] overflow-y-auto w-full">
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold">
                {comment.userData.fullname} | {comment.userData.phone}
              </h3>
              <StatusBadge status={comment.status || COMMENT_STATUS.PENDING} />
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Mã SP: {comment.productId} - {comment.productData.name}
            </p>
            <div className="text-gray-600 border-b pb-2 bg-gray-300 rounded p-3">
              {paragraphs?.map((paragraph, idx) => (
                <p key={idx} className="mb-2">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Lịch sử phản hồi</h4>
            <div className="space-y-3">
              {comment ? (
                comment.replies?.map((reply) => {
                  const paragraphs: string[] | undefined = reply?.comment
                    ? reply?.comment.split("\n")
                    : undefined;
                  return (
                    <div key={reply.id} className="bg-gray-50 rounded p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">
                          {reply.userData.fullname}
                        </span>
                        <span className="text-sm text-gray-500">
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
                      </div>
                      <p className="text-gray-600">
                        {paragraphs?.map((paragraph, idx) => (
                          <p key={idx} className="mb-2">
                            {paragraph}
                          </p>
                        ))}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500">Chưa có phản hồi nào</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Phản hồi mới</label>
              <div className="flex gap-2">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập phản hồi..."
                  className="border rounded px-3 py-2 bg-white h-40 w-full "
                ></textarea>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleSendComment}
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 flex items-center justify-center text-gray-500">
          Chọn một phản hồi để xem chi tiết
        </div>
      )}
    </div>
  );
}
