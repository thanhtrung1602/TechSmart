import { useEffect, useState } from "react";
import { socket } from "../socket.ts";
import Products from "~/models/Products.ts";
import { addNewComment, addNewOrder, updateCart, updateOrderStock, updateProductStock } from "~/redux/socketSlice.ts";
import { useDispatch } from "react-redux";
import Comments from "~/models/Comment.ts";
import Orders from "~/models/Orders.ts";

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

    function onConnectError(error: Error) {
      console.error("Socket connection error:", error);
    }

    //Khi cập nhật stock của product thì client sẽ được đồng bộ
    function onUpdateProduct(data: { updatedProduct: Products }) {
      console.log("Received product update:", data);
      // Cập nhật stock trong Redux store
      dispatch(
        updateProductStock({
          id: data.updatedProduct.id,
          stock: data.updatedProduct.stock,
        })
      );
    }

    //Khi tạo order đồng bộ stock product
    function onUpdateStockOrder(data: { productId: number; newStock: number }) {
      console.log("Received stock update:", data);
      // Cập nhật stock trong Redux store
      dispatch(
        updateOrderStock({ productId: data.productId, newStock: data.newStock })
      );
    }

    //Đồng bộ comment
    function onNewComment(newComment: Comments) {
      console.log("Received new comment:", newComment);
      dispatch(addNewComment(newComment)); // Thêm comment mới vào Redux store
    }

    //Đồng bộ cart
    function onUpdateCart(data: { userId: number; cartId: number }) {
      console.log("Received cart update:", data);
      // Cập nhật cart trong Redux store
      dispatch(
        updateCart({ userId: data.userId, cartId: data.cartId })
      );
    }

    //Đồng bộ order khi tạo mới
    function onNewOrder(newOrder: Orders) {
      console.log("Received new order:", newOrder);
      // Cập nhật order trong Redux store
      dispatch(addNewOrder(newOrder));
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("updateProduct", onUpdateProduct); // Lắng nghe sự kiện updateProduct
    socket.on("stockUpdate", onUpdateStockOrder);
    socket.on("newComment", onNewComment);
    socket.on("updateCart", onUpdateCart);
    socket.on("newOrder", onNewOrder);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("updateProduct", onUpdateProduct);
      socket.off("stockUpdate", onUpdateStockOrder);
      socket.off("newComment", onNewComment);
      socket.off("updateCart", onUpdateCart);
      socket.off("newOrder", onNewOrder);
    };
  }, [dispatch]);

  return null;
}
