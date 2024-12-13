import instance from "./axios";

const handleBank = {
  bank: async (total: number, orderId: number) => {
    return instance
      .post("/orders/payment/createPayment", {
        total: total,
        id: orderId,
        bankSelect: "VNPAY",
        contentPayment: "Thanh toán đơn hàng" + orderId,
      })
      .then((res) => res.data);
  },
};

export default handleBank;
