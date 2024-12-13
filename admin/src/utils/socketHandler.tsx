import { useEffect, useState } from "react";
import { socket } from "../socket.ts";
import {
  addNewComment,
  updateOrderStock,
  updateProfileUser,
} from "~/redux/socketSlice.ts";
import { useDispatch } from "react-redux";
import Comments from "~/models/Comment.ts";
import Users from "~/models/Users.ts";

export default function SocketHandler() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  console.log("connect: ", isConnected);
  const dispatch = useDispatch();

  useEffect(() => {
    function onConnect() {
      console.log("Connected to socket server");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("Disconnected from socket server");
      setIsConnected(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onConnectError(error: any) {
      console.error("Socket connection error:", error);
    }

    //Khi tạo order đồng bộ stock product
    function onUpdateStockOrder(data: { productId: number; newStock: number }) {
      console.log("Received stock update:", data);
      // Cập nhật stock trong Redux store
      dispatch(
        updateOrderStock({ productId: data.productId, newStock: data.newStock })
      );
    }

    function onUpdateUser(data: { data: Users }) {
      console.log("Received users update:", data);
      dispatch(updateProfileUser(data));
    }
    //Đồng bộ comment
    function onNewComment(newComment: Comments) {
      console.log("Received new comment:", newComment);
      dispatch(addNewComment(newComment)); // Thêm comment mới vào Redux store
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("stockUpdate", onUpdateStockOrder);
    socket.on("updateUser", onUpdateUser);
    socket.on("newComment", onNewComment);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("stockUpdate", onUpdateStockOrder);
      socket.off("updateUser", onUpdateUser);
      socket.off("newComment", onNewComment);
    };
  }, [dispatch]);

  return null;
}
