import { useState, useMemo, useEffect } from "react";
import NavCart from "~/layouts/components/NavCart";
import { useDispatch, useSelector } from "react-redux";
import Carts from "~/models/Carts";
import { MdDeleteForever } from "react-icons/md";
import Image from "~/components/Image";
import emptyCart from "~/assets/images/empty_cart.png";
import { useNavigate } from "react-router-dom";
import Button from "~/components/Button";
import { AppDispatch, RootState } from "~/redux/store";
import toast from "react-hot-toast";
import useGet from "~/hooks/useGet";
import { useDelete } from "~/hooks/usePost";
import { useQueryClient } from "@tanstack/react-query";
import ChildCart from "~/components/ChildCart";
import { removeCart } from "~/redux/cartSlice";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Modal from "~/components/Modal";
import { HiOutlineTrash } from "react-icons/hi2";

function Cart() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const userProfile = useSelector(
    (state: RootState) => state.userProfile.userProfile
  );
  const stockStatus = useSelector(
    (state: RootState) => state.socket.stockStatus
  );

  const socketCart = useSelector((state: RootState) => state.socket.cartUpdate);
  const { data: carts } = useGet<{ count: number; rows: Carts[] }>(
    `/cart/getAllCartByUserId/${socketCart.userId || userProfile?.id}`,
    {
      enabled: !!socketCart.userId || !!userProfile,
    }
  );

  const cart = useSelector((state: RootState) => state.cart.cartProducts);
  const { mutate } = useDelete();

  const navigate = useNavigate();

  const [quantities, setQuantities] = useState<{
    [key: number | string]: number;
  }>({});
  const [selectedItems, setSelectedItems] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    // Set quantities and selectedItems based on available data source
    const initialQuantities: { [key: string | number]: number } = {};
    const initialSelectedItems: { [key: number]: boolean } = {};

    const items = carts?.rows || cart || []; // Use carts if logged in, otherwise use cart from local storage
    items.forEach((item) => {
      const key = carts?.rows
        ? item.id
        : `${item.id}-${item.rom}-${item.color}`;
      initialQuantities[key] = item.quantity || 1; // Default quantity to 1 if undefined
      initialSelectedItems[item.id] = true; // Default selection state to true
    });
    setQuantities(initialQuantities);
    setSelectedItems(initialSelectedItems);
  }, [carts, cart]); // Depend on both carts and cart

  // Function to toggle selection of individual items
  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Function to toggle select all items
  const handleSelectAll = () => {
    const items = carts?.rows || cart || [];
    const allSelected = !Object.values(selectedItems).every(Boolean);
    const updatedSelectedItems = items.reduce((acc, item) => {
      acc[item.id] = allSelected;
      return acc;
    }, {} as { [key: number]: boolean });

    setSelectedItems(updatedSelectedItems);
  };

  // Memoized calculation for total original price
  const totalOriginalPrice = useMemo(() => {
    const items = carts?.rows || cart || [];
    return items.reduce((total, productDetail) => {
      if (selectedItems[productDetail.id]) {
        const price = carts?.rows
          ? Number(
            productDetail.variantData.price
          )
          : productDetail.price;
        const discount =
          productDetail.variantData.productData?.discount || productDetail.discount;
        return (
          total +
          Math.round(price / (1 - discount / 100)) *
          (quantities[
            carts?.rows
              ? productDetail.id
              : `${productDetail.id}-${productDetail.rom}-${productDetail.color}`
          ] || 1)
        );
      }
      return total;
    }, 0);
  }, [carts, cart, selectedItems]);

  // Memoized calculation for total discounted price
  const totalDiscountedPrice = useMemo(() => {
    const items = carts?.rows || cart || [];
    return items.reduce((total, productDetail) => {
      if (selectedItems[productDetail.id]) {
        const price = carts?.rows
          ? Number(
            productDetail.variantData.price
          )
          : productDetail.price;
        return (
          total +
          price *
          (quantities[
            carts?.rows
              ? productDetail.id
              : `${productDetail.id}-${productDetail.rom}-${productDetail.color}`
          ] || 1)
        );
      }
      return total;
    }, 0);
  }, [carts, cart, selectedItems]);

  // Memoized calculation for total discount
  const totalDiscount = useMemo(() => {
    return Math.round(totalOriginalPrice - totalDiscountedPrice);
  }, [totalOriginalPrice, totalDiscountedPrice]);

  const handleRemoveCart = () => {
    if (!userProfile) {
      dispatch(removeCart());
      return;
    }
    mutate(`/cart/clearCart/${userProfile?.id}`, {
      onSuccess: (res) => {
        if (res.status === 200) {
          toast.success("Đã xóa tất cả sản phẩm trong giỏ hàng");
          queryClient.invalidateQueries({
            queryKey: [`/cart/getAllCartByUserId/${userProfile?.id}`],
          });
        }
      },
      onError: (error) => console.log(error),
    });
  };

  // Hàm xử lý khi nhấn nút xác nhận
  const handleConfirmClick = async () => {
    if (!userProfile) {
      // Nếu chưa đăng nhập, ngăn không cho chuyển trang và hiển thị toast
      toast.error("Yêu cầu đăng nhập");
      return navigate("/login");
    } else if (userProfile.ban === true) {
      // Nếu đã đăng nhập nhưng tài khoản bị chặn, hiển thị thông báo
      toast.error("Tài khoản của bạn đã bị chặn");
      return;
    }

    const selectedProducts = carts?.rows.filter(
      (productDetail) => selectedItems[productDetail.id]
    );

    if (selectedProducts?.length === 0) {
      // Nếu không có sản phẩm được chọn, ngăn không cho chuyển trang và hiển thị toast
      toast.error("Vui lòng chọn ít nhất một sản phẩm");
      return; // Dừng lại không chuyển trang
    }

    // Kiểm tra stock từ WebSocket
    const checkStockWithWebSocket = async (selectedProducts: Carts[]) => {
      const outOfStockProducts = new Set(); // Sử dụng Set để chỉ lưu trữ duy nhất tên sản phẩm hết hàng
      const productQuantity: { [key: number]: number } = {}; //Chứa tổng số lượng sản phẩm theo ID

      // Tính tổng số lượng cho mỗi sản phẩm với ID giống nhau
      for (const product of selectedProducts) {
        const productId = product.variantData.productId;
        const quantity = product.quantity; // Lấy số lượng của sản phẩm từ selectedItems

        if (productQuantity[productId]) {
          console.log(productQuantity[productId]);
          productQuantity[productId] += quantity;
        } else {
          productQuantity[productId] = quantity;
        }
      }

      // Kiểm tra stock cho từng sản phẩm đã chọn
      for (const product of selectedProducts) {
        const productId = product.variantData.productId;

        const stock = stockStatus[productId] || product.variantData.stock; // Lấy stock tổng của sản phẩm theo ID
        const requestedQuantity = productQuantity[productId]; // Số lượng đã yêu cầu cho sản phẩm theo ID

        console.log(stock, requestedQuantity);

        if (stock - requestedQuantity < 2) {
          // Kiểm tra nếu số lượng tồn kho còn lại không đủ yêu cầu
          outOfStockProducts.add(product.variantData.productData.name); // Sử dụng Set để chỉ thêm tên sản phẩm một lần
        }
      }

      // Nếu có sản phẩm hết hàng
      if (outOfStockProducts.size > 0) {
        const outOfStockArray = Array.from(outOfStockProducts) as string[]; // Chuyển Set thành Array để render toast
        if (outOfStockArray.length === 1) {
          // Nếu chỉ có 1 sản phẩm hết hàng
          toast(
            <div className="flex items-center gap-x-4">
              <AiOutlineInfoCircle className="h-6 w-6 text-red-500" />
              <p className="text-sm font-medium text-gray-700">
                Rất tiếc phải xin lỗi quý khách, sản phẩm{" "}
                <span className="font-semibold text-red-600">
                  "{outOfStockArray[0]}"
                </span>{" "}
                đã hết hàng.
              </p>
            </div>
          );
        } else {
          // Nếu có nhiều sản phẩm hết hàng
          toast(
            <div className="flex items-center gap-x-4">
              <AiOutlineInfoCircle className="h-6 w-6 text-red-500" />
              <p className="text-sm font-medium text-gray-700">
                Rất tiếc phải xin lỗi quý khách, các sản phẩm sau đây đã hết
                hàng:
                <ul className="list-disc ml-6 text-red-600 font-semibold">
                  {outOfStockArray.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </p>
            </div>
          );
        }
        return false; // Có sản phẩm hết hàng
      }
      return true; // Tất cả sản phẩm đều còn hàng
    };

    // Kiểm tra stock của tất cả các sản phẩm được chọn
    const isStockAvailable = await checkStockWithWebSocket(
      selectedProducts || []
    );

    if (!isStockAvailable) {
      // Nếu không đủ stock, không chuyển trang
      return;
    }

    // Nếu tất cả các sản phẩm có stock đủ, chuyển đến trang thanh toán
    navigate("/checkout", {
      state: {
        selectedProducts,
        totalOriginalPrice,
        totalDiscountedPrice,
        totalDiscount,
      },
    });
  };

  return (
    <section className="px-4 sm:px-10 lg:px-40">
      <div className="w-full lg:w-[600px] mx-auto">
        <h4 className="text-center text-2xl lg:text-3xl font-bold py-4 lg:py-8">
          Giỏ hàng
        </h4>
        <NavCart />
      </div>
      <div className="min-h-28 py-6 lg:py-10 m-auto">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Cart Items Section */}
          <div className="w-full min-h-28 p-4 bg-white rounded-md shadow-sm">
            {cart?.length > 0 || (carts && carts?.rows?.length > 0) ? (
              <div>
                {/* Header with Select All and Delete */}
                <div className="flex justify-between pb-4 border-b-[1px] border-black">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 bg-gray-200 checked:bg-blue-500 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      checked={Object.values(selectedItems).every(Boolean)}
                      onChange={handleSelectAll}
                    />
                    <div className="text-xs sm:text-sm">
                      Chọn tất cả ({cart?.length || carts?.rows?.length})
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setOpen(true);
                    }}
                    className="p-2 cursor-pointer"
                  >
                    <MdDeleteForever className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                  </Button>
                  <Modal open={open} onClose={() => setOpen(false)}>
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
                          Bạn muốn xóa sản phẩm này?
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={handleRemoveCart}
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
                  </Modal>
                </div>
                {/* Items List */}
                {userProfile
                  ? carts?.rows?.map((productDetail) => (
                    <ChildCart
                      key={productDetail.id}
                      idCart={productDetail.id}
                      id={productDetail?.variantData?.productData.id}
                      price={productDetail?.variantData?.price}
                      discount={
                        productDetail?.variantData?.productData.discount
                      }
                      img={productDetail?.variantData?.productData.img}
                      name={productDetail?.variantData?.productData.name}
                      rom={productDetail.rom}
                      color={productDetail.color}
                      selectedItems={selectedItems}
                      handleSelectItem={handleSelectItem}
                    />
                  ))
                  : cart?.map((productDetail, index) => (
                    <ChildCart
                      key={index}
                      id={productDetail?.variantData?.productData.id}
                      price={productDetail?.variantData?.price}
                      discount={
                        productDetail?.variantData?.productData.discount
                      }
                      img={productDetail?.variantData?.productData.img}
                      name={productDetail?.variantData?.productData.name}
                      rom={productDetail.rom}
                      color={productDetail.color}
                      selectedItems={selectedItems}
                      handleSelectItem={handleSelectItem}
                    />
                  ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <Image src={emptyCart} alt="Empty Cart" />
                <p className="text-center text-xs sm:text-sm">
                  Chưa có sản phẩm nào trong giỏ hàng
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="sticky max-h-[90vh] top-[92px] w-full lg:w-2/6 min-h-28 p-6 lg:p-8 bg-white rounded-md shadow-sm">
            <div className="mb-4 lg:mb-[30px] text-lg lg:text-[20px]">
              <h3>Thông tin đơn hàng</h3>
            </div>
            <div className="mb-4 lg:mb-[15px]">
              <div>
                <div className="flex justify-between py-2 lg:py-[13px]">
                  <p className="text-sm lg:text-base">Tổng tiền</p>
                  <p className="font-bold text-sm lg:text-base">
                    {totalOriginalPrice?.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
              <hr />
              <div className="">
                <div className="flex justify-between py-2 lg:py-[13px]">
                  <p className="text-sm lg:text-base">Tổng khuyến mãi</p>
                  <p className="font-bold text-sm lg:text-base">
                    {totalDiscount?.toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <div className="flex justify-between py-2 lg:py-[13px]">
                  <p className="text-sm lg:text-base">Phí vận chuyển</p>
                  <p className="text-sm lg:text-base">Miễn phí</p>
                </div>
              </div>
              <hr />
              <div>
                <div className="flex justify-between py-2 lg:py-[13px] font-bold">
                  <p className="text-sm lg:text-base">Cần thanh toán</p>
                  <div className="font-bold">
                    <p className="font-bold text-red-600 text-sm lg:text-base">
                      {totalDiscountedPrice?.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {totalDiscountedPrice > 0 ? (
                <Button
                  className="block w-full text-center bg-[#eb3e32] text-white py-3 rounded-md duration-300 hover:bg-red-600"
                  onClick={handleConfirmClick}
                >
                  Xác nhận đơn
                </Button>
              ) : (
                <Button className="text-center bg-[#cccccc] text-white w-full py-2 rounded-md">
                  Xác nhận đơn
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
