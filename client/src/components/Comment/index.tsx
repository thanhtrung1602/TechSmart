import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import useGet from "~/hooks/useGet";
import usePost, { useDelete, usePatch } from "~/hooks/usePost";
import { RootState } from "~/redux/store";
import { FaPaperPlane, FaUser } from "react-icons/fa";
import Comment from "~/models/Comment";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import MenuTooltip from "~/components/Popper/MenuTooltip";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { socket } from "../../socket.ts";
import PaginationList from "../PaginationList/index.tsx";
import { AiFillExclamationCircle } from "react-icons/ai";
import emptyComment from "~/assets/images/empty_comment.png";
import Image from "~/components/Image";

export default function CommentComponent({ id }: { id: number | undefined }) {
  const queryClient = useQueryClient();
  const userProfile = useSelector(
    (state: RootState) => state.userProfile.userProfile
  );

  dayjs.extend(relativeTime);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editComment, setEditComment] = useState<string>("");

  const { mutate: createComment } = usePost();
  const { mutate: deleteComment } = useDelete();
  const { mutate: updateComment } = usePatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalComments, setTotalComments] = useState(0);

  const urlPagination = (page: number, size: number) => {
    return `/comments/getOneCommentByProductId/${id}?page=${page}&size=${size}`;
  };

  const { data: commentsPagination = { total: 0, comments: [] } } = useGet<{
    total: number;
    comments: Comment[];
  }>(urlPagination(currentPage, itemsPerPage));

  useEffect(() => {
    if (commentsPagination && commentsPagination.comments && commentsPagination.total) {
      setComments(commentsPagination.comments || []);
      setTotalComments(commentsPagination.total || 0);
    } else {
      setComments([]);
      setTotalComments(0);
    }
  }, [commentsPagination]);

  useEffect(() => {
    // Nhận socket event 'newComment'
    socket.on("newComment", (newComment: Comment) => {
      if (newComment && typeof newComment === "object") {
        setComments((prevComments) => {
          // Nếu là bình luận cha
          if (!newComment.commentId) {
            return [newComment, ...prevComments];
          }

          // Nếu là bình luận con
          return prevComments?.map((comment) => {
            if (comment.id === newComment.commentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              };
            }
            return comment;
          });
        });
      } else {
        console.error("Received invalid newComment data:", newComment);
      }
    });

    return () => {
      socket.off("newComment"); // Gỡ sự kiện khi unmount
    };
  }, [setComments]);

  const handlePageClick = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const handleCommentSubmit = () => {
    if (!userProfile || !id) {
      toast(
        <div className="flex items-center gap-2">
          <AiFillExclamationCircle className="text-red-600 text-2xl" />
          <span>Quý khách cần đăng nhập để có thể bình luận</span>
        </div>
      );
      return;
    }

    const data = {
      comment: comment,
      userId: userProfile.id,
      productId: id,
      status: "Chờ xử lý",
    };

    createComment(
      { url: "/comments/createComment", data },
      {
        onSuccess: (res) => {
          console.log("Đã bình luận thành công");
          if (res.status === 200) {
            queryClient.invalidateQueries({
              queryKey: [`/comments/getOneCommentByProductId/${id}`],
            });
            queryClient.invalidateQueries({
              queryKey: [`/comments/getAllComment?page=${1}&size=${10}`],
            });
            setComment("");
          }
        },
        onError: (err) => {
          console.error("Error creating contact", err);
        },
      }
    );
  };

  const handleDeleteComment = (idComment: number, idCommentUser: number) => {
    if (idComment && idCommentUser) {
      if (idCommentUser !== userProfile?.id) {
        toast.error("Bạn không thể xóa bình luận");
        return;
      }

      deleteComment(`/comments/deleteComment/${idComment}`, {
        onSuccess: (res) => {
          if (res.status === 200) {
            toast.success("Đã xóa bình luận");
            queryClient.invalidateQueries({
              queryKey: [`/comments/getOneCommentByProductId/${id}`],
            });
            queryClient.invalidateQueries({
              queryKey: [`/comments/getAllComment?page=${1}&size=${10}`],
            });
          }
        },
        onError: (err) => {
          console.error("Error creating contact", err);
        },
      });
    } else {
      console.log("Invalid parameters");
    }
  };

  const handleUpdateComment = (
    idComment: number,
    idCommentUser: number,
    newComment: string
  ) => {
    if (idComment && idCommentUser && newComment) {
      console.log(idComment, idCommentUser, newComment);

      updateComment(
        {
          url: `/comments/updateComment/${idComment}`,
          data: { comment: newComment, userId: idCommentUser },
        },
        {
          onSuccess: (response) => {
            if (response.status === 200) {
              toast.success("Đã sửa bình luận");
              queryClient.invalidateQueries({
                queryKey: [`/comments/getOneCommentByProductId/${id}`],
              });
              queryClient.invalidateQueries({
                queryKey: [`/comments/getAllComment?page=${1}&size=${10}`],
              });
            }
          },
          onError: (err) => {
            console.error("Error update contact", err);
          },
        }
      );

      setEditCommentId(null);
      setEditComment(newComment);
    } else {
      console.log("Invalid parameters");
    }
  };

  const LIST_ITEM = (
    idComment: number,
    idCommentUser: number,
    newComment: string
  ) => [
    {
      icon: <MdDeleteForever />,
      name: "Xóa bình luận",
      onClick: () => handleDeleteComment(idComment, idCommentUser),
    },
    {
      icon: <RxUpdate />,
      name: "Chỉnh sửa",
      onClick: () => {
        if (idCommentUser !== userProfile?.id) {
          toast.error("Bạn không thể sửa bình luận");
          return;
        }

        setEditCommentId(idComment);
        setEditComment(newComment);
      },
    },
  ];

  return (
    <div className="col-span-2 bg-white p-5 rounded">
      <h3 className="text-xl font-semibold mb-6">Bình luận</h3>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-x-4 bg-white rounded-lg">
          <textarea
            id="comment"
            name="comment"
            placeholder="Xin mời để lại bình luận và câu hỏi..."
            className="w-full min-h-11 h-10 resize-none px-4 py-2 flex bg-white placeholder-gray 
            text-black text-sm font-medium rounded border border-[#aeaeae] outline-none "
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="px-8 py-2 flex items-center gap-x-3 text-white text-base font-medium 
            rounded-md bg-red-500 hover:bg-red-600 transition-colors duration-300 "
            onClick={handleCommentSubmit}
          >
            <FaPaperPlane />
            Gửi
          </button>
        </div>
      </div>
      <div className="mt-6">
        {comments?.length === 0 ? (
          <div className="text-center py-10">
            <Image src={emptyComment} alt="Empty Comment" className=""></Image>
            <p className="text-md text-gray-500">
              Sản phẩm này hiện chưa có bình luận.
            </p>
          </div>
        ) : (
          comments?.map((comment) => {
            const paragraphs: string[] | undefined = comment?.comment
              ? comment?.comment.split("\n")
              : undefined;
            return (
              <div key={comment.id} className="">
                <div className="flex gap-2">
                  <div className="size-10 flex justify-center items-center h-[40px] w-[43px] rounded-full bg-slate-300">
                    <FaUser className="size-4 text-white" />
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center w-full">
                      <div>
                        {comment.userData && comment.userData.id && (
                          <div className="font-medium text-sm text-black flex items-center gap-1">
                            {comment.userData.fullname || "Ẩn danh"}
                            {" • "}
                            <p className="text-sm text-gray-500">
                              {dayjs(comment.createdAt).fromNow()}
                            </p>
                          </div>
                        )}
                      </div>
                      {userProfile?.id === comment.userId && (
                        <div>
                          <MenuTooltip
                            items={LIST_ITEM(
                              comment.id,
                              comment.userId,
                              comment.comment
                            )}
                            className="flex flex-col gap-2 bg-white text-sm text-neutral-500 font-semibold rounded border-[0.5px] p-2 mt-2"
                          >
                            <div className="cursor-pointer">
                              <IoEllipsisVerticalSharp />
                            </div>
                          </MenuTooltip>
                        </div>
                      )}
                    </div>
                    <div className="bg-white ">
                      {editCommentId === comment.id ? (
                        <input
                          type="text"
                          className="w-full p-2 border outline-none rounded focus:bg-white bg-white"
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <div className="text-black text-sm">
                          {paragraphs?.map((paragraph, idx) => (
                            <p key={idx} className="mb-2">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="ml-12">
                  {comment.replies?.map((reply) => {
                    const paragraphs: string[] | undefined = reply?.comment
                      ? reply?.comment.split("\n")
                      : undefined;
                    return (
                      <div
                        className="flex gap-2 bg-[#f3f4f6] p-3 rounded-lg mt-2"
                        key={reply.id}
                      >
                        <p className="size-10 flex justify-center items-center rounded-full bg-slate-300">
                          <FaUser className="size-4 text-white" />
                        </p>
                        <div className="flex flex-col w-full">
                          <div className="flex justify-between items-center w-full">
                            <div>
                              {reply.userData && reply.userData.id && (
                                <div className="font-medium text-sm text-black flex items-center gap-1">
                                  {reply.userData.fullname || "Ẩn danh"}
                                  {" • "}
                                  <p className="text-sm text-gray-500">
                                    {dayjs(reply.createdAt).fromNow()}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div>
                              {userProfile?.id === comment.userId && (
                                <div>
                                  <MenuTooltip
                                    items={LIST_ITEM(
                                      comment.id,
                                      comment.userId,
                                      comment.comment
                                    )}
                                    className="flex flex-col gap-2 bg-white text-sm text-neutral-500 font-semibold rounded border-[0.5px] p-2 mt-2"
                                  >
                                    <div className="cursor-pointer">
                                      {/* <IoEllipsisVerticalSharp /> */}
                                    </div>
                                  </MenuTooltip>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="">
                            {editCommentId === reply.id ? (
                              <input
                                type="text"
                                className="w-full p-2 border outline-none rounded focus:bg-white bg-white"
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                autoFocus
                              />
                            ) : (
                              <div className="text-black text-sm">
                                {paragraphs?.map((paragraph, idx) => (
                                  <p key={idx} className="mb-2">
                                    {paragraph}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-end mt-2">
                    {editCommentId === comment.id ? (
                      <div className="flex justify-end mt-2">
                        <button
                          className="px-4 py-2 bg-[#eb3e32]  text-white rounded hover:bg-red-600"
                          onClick={() => {
                            handleUpdateComment(
                              comment.id,
                              comment.userId,
                              editComment
                            );
                          }}
                        >
                          Lưu
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
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
  );
}
