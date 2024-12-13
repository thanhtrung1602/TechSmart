import dayjs from "dayjs";
import Stock from "~/models/stock";
import instance from "~/services/axios";

const deliveryTimes = {
  standard: "Đặt lấy hàng sau 3 - 5 ngày",
  express: "1-2 days",
};

export async function CheckValueReturnTime(
  productIds: number[],
  storeId: number
) {

  const now = new Date();

  const deliveryDay = new Date(now);
  deliveryDay.setDate(now.getDate() + 1);

  const results = [];
  for (const productId of productIds) {
    const storeProducts = await instance.get<Stock[]>(
      `/stock/findAllByProductId/${productId}`
    );

    const stockRecord = storeProducts?.data?.find(
      (record) =>
        record.productId === productId && record.storeId === Number(storeId)
    );
    const stock = stockRecord ? stockRecord.stockProduct > 0 : false;
    const pickupTime = stock ? deliveryDay.toString() : "Out of stock";
    const deliveryTime = stock ? deliveryDay.toString() : deliveryTimes.standard;

    const deliveryDate =
      stock === false ? dayjs().add(6, "day").format("DD/MM/YYYY") : deliveryDay.toString();

    if (!stockRecord) {
      results.push({
        productId,
        stock: false,
        message: "Product not found in the specified store.",
        deliveryTime: deliveryTimes.standard,
        pickupTime: "",
        deliveryDate,
      });
    }

    // Trả về kết quả nếu có stock
    results.push({
      productId,
      stock,
      message: stock
        ? "Product is in stock and available for pickup."
        : "Product is out of stock, available for delivery only.",
      deliveryTime,
      pickupTime,
      deliveryDate,
    });
  }

  return results;
}
