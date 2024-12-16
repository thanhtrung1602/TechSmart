import { FiRefreshCw, FiPlus } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGet from "~/hooks/useGet";
import Products from "~/models/Products";
import Categories from "~/models/Categories";
import Manufacturer from "~/models/Manufacturer";
import Modal from "~/components/Modal/Modal";
import PaginationList from "~/components/PaginationList";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BiSolidHide } from "react-icons/bi";
import { BiSolidShow } from "react-icons/bi";
import { usePatch } from "~/hooks/usePost";

import Image from "~/components/Image";
import { HiOutlinePencilAlt } from "react-icons/hi";
import DetailProduct from "./detailProduct";
import useDebounce from "~/hooks/useDebounce";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: UpdateVisible } = usePatch();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [open, setOpen] = useState(false);
  const [opendetail, setOpendetail] = useState(false);
  const [isUpdateVisible, setIsUpdateVisible] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<
    number | null
  >(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<boolean | null>(null); // Trạng thái lọc (Ẩn, Hiện)

  const debounceSearch = useDebounce(searchTerm, 500);

  const stockUpdate = useSelector(
    (state: RootState) => state.socket.stockStatus
  );

  // Get api
  const { data: categories } = useGet<Categories[]>(
    "/categories/getAllCategories/"
  );
  const { data: manufacturers } = useGet<
    Manufacturer[]
  >(`/manufacturer/getManufacturerByCategory/${selectedCategory}`, {
    enabled: false,
  });
  const {
    data: productsPagination,
    refetch,
  } = useGet<{ total: number; rows: Products[] }>(
    `/products/filteredProducts?page=${currentPage}&size=${itemsPerPage}&category=${selectedCategory}&manufacturer=${selectedManufacturer}&search=${debounceSearch}&visible=${filterStatus}`,
    { enabled: false }
  );

  useEffect(() => {
    if (productsPagination) {
      setTotalProducts(productsPagination.total);
    }
  }, [productsPagination]);

  // Handle pagination click
  const handlePageClick = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    refetch();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle filter change
  const handleFilterChange = () => {
    setCurrentPage(1);
    refetch();
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedManufacturer(null);
    setCurrentPage(1);
    setSearchTerm("");
    refetch();
    setFilterStatus(null);
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (
    price: number,
    discount: number
  ): number => {
    return Math.round(price / (1 - discount / 100) / 1000) * 1000;
  };

  // Handle product deletion
  const handleUpdateVisible = () => {
    if (!isUpdateVisible) return;
    UpdateVisible(
      {
        url: `/products/updateProductByVisible/${isUpdateVisible}`,
      },
      {
        onSuccess: (response) => {
          console.log(response);
          if (response.status === 200) {
            queryClient.invalidateQueries({
              queryKey: ["/products/getAllProducts"],
            });
            toast.success("Cập nhật thành công");
            setOpen(false);
            setIsUpdateVisible(null);
            navigate("/products");
            // window.location.reload();
          }
        },
        onError: (error) => {
          alert("Error deleting category: " + error.message);
          toast.error("Có lỗi xảy ra ");
          setIsUpdateVisible(null);
          navigate("/products");
        },
      }
    );
  };
  const handleOpenDetail = (productId: number) => {
    setSelectedProductId(productId); // Đặt ID của sản phẩm đã chọn
    setOpendetail(true);
  };

  // Khi đóng modal, reset `selectedProductId`
  const handleCloseDetail = () => {
    setSelectedProductId(null);
    setOpendetail(false);
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-[32px] font-bold mb-4">Danh sách sản phẩm</h1>

      <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-4">
          <select
            value={selectedCategory || ""}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedManufacturer(null); // reset manufacturer when category changes
              handleFilterChange();
            }}
            className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg focus:outline-none"
          >
            <option value="">Danh mục</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={selectedManufacturer || ""}
            onChange={(e) => {
              setSelectedManufacturer(Number(e.target.value));
              handleFilterChange();
            }}
            className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg focus:outline-none"
            disabled={!selectedCategory}
          >
            <option value="">Hãng</option>
            {manufacturers?.map((manufacturer) => (
              <option key={manufacturer.id} value={manufacturer.id}>
                {manufacturer.name}
              </option>
            ))}
          </select>
          <select
            className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg focus:outline-none"
            value={filterStatus === null ? "null" : filterStatus.toString()}
            onChange={(e) => {
              const value = e.target.value;
              setFilterStatus(value === "null" ? null : value === "true");
            }}
          >
            {/* <option value="null">Tất cả</option> */}
            <option value="null">Đang hiện</option>
            <option value="false">Đã ẩn</option>
          </select>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={resetFilters}
            className="flex items-center space-x-2 py-2 px-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Bỏ lọc</span>
          </button>

          <Link to={`/product/addProduct`}>
            <button className="text-white bg-green-500 hover:bg-green-600 flex items-center px-4 py-2 rounded-lg">
              <FiPlus className="w-4 h-4 mr-2" />
              <span>Thêm</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="w-full border-collapse bg-white border border-gray-200">
          <thead className="bg-gray-300">
            <tr className="text-center">
              <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                STT
              </th>
              <th className="py-3 px-7 font-semibold text-[#202224] border-b">
                Ảnh
              </th>
              <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                Tên sản phẩm
              </th>
              <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                Giá
              </th>
              <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                Giá giảm
              </th>
              <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                Phần trăm giảm
              </th>
              <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                Số lượng
              </th>
              <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                Hiện thông tin
              </th>
              <th className="py-3 px-4 text-center font-semibold text-[#202224] border-b">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {productsPagination && productsPagination?.total ? (
              productsPagination.rows?.map((product, index) => (
                <tr className="border-b" key={product.id}>
                  <td className="py-3 px-4 w-1/12 text-center">{index + 1}</td>
                  <td className="py-3 px-4 w-2/12">
                    <Image
                      src={product.img}
                      alt={product.name}
                      className="w-full"
                    />
                  </td>
                  <td className="py-3 px-4 max-w-60 overflow-hidden truncate whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="py-3 px-4 w-2/12 text-center ">
                    {calculateDiscountedPrice(
                      product.price,
                      product.discount
                    )?.toLocaleString("vi")}
                    đ
                  </td>
                  <td className="py-3 px-4 w-2/12 text-center ">
                    {product.price?.toLocaleString("vi")}đ
                  </td>
                  <td className="py-3 px-4 w-3/12 text-center">
                    {product.discount}%
                  </td>
                  <td className="py-3 px-4 w-1/12 text-center">
                    {stockUpdate[product.id] || product.stock}
                  </td>
                  <td className="py-3 px-4 w-4/12 items-center text-center">
                    <button
                      onClick={() => handleOpenDetail(product.id)}
                      className="w-[100%] flex items-center py-2 px-2 text-[#3271ab] bg-blue-100 rounded-lg duration-300 hover:text-blue-600 hover:bg-blue-300"
                    >
                      <span className="text-center text-xs font-semibold">
                        Thông tin
                      </span>
                    </button>
                  </td>
                  <td className="py-3 px-4 w-4/12 border-b">
                    <span className="w-[100%] text-center px-4 py-2 text-xs font-semibold rounded-lg flex justify-between">
                      <Link
                        to={`/product/editProduct/${product.id}`}
                        className="w-[100%] flex items-center py-2 px-4 text-[#319c5a] bg-green-100 rounded-tl-md rounded-bl-md duration-500 hover:text-green-600 hover:bg-green-300"
                      >
                        <HiOutlinePencilAlt className="text-lg flex items-center justify-center" />
                      </Link>
                      <button
                        onClick={() => {
                          setOpen(true);
                          setIsUpdateVisible(product.id); // Chuyển thành setIsUpdating(category.id) nếu cần
                        }}
                        disabled={isUpdateVisible === product.id} // Điều kiện này vẫn giữ nguyên
                        className={`w-[100%] flex items-center justify-center py-2 px-4 rounded-tr-md rounded-br-md duration-500 ${product.visible === true ? 'bg-red-100 text-red-500 hover:text-red-600 hover:bg-red-300' : 'bg-green-100 text-green-500 hover:text-green-600 hover:bg-green-300'}`}
                      >
                        {product.visible === true ? (
                          <BiSolidHide className="size-4" />
                        ) : (
                          <BiSolidShow className="size-4" />
                        )}
                      </button>


                      <Modal open={open} onClose={() => { setOpen(false); }}>
                        <div className="text-center w-auto">
                          {/* Conditional icon rendering */}
                          {product.visible == true ? (
                            <BiSolidHide size={56} className="mx-auto text-red-500" />
                          ) : (
                            <BiSolidShow size={56} className="mx-auto  text-green-500" />
                          )}
                          <div className="mx-auto my-4">
                            <h3 className="text-lg font-bold text-gray-800">
                              {product.visible == true ? "Xác nhận ẩn sản phẩm" : "Xác nhận hiện sản phẩm"}
                            </h3>
                            <p className="text-sm text-gray-500 my-2">
                              {product.visible == true ? "Bạn có muốn ẩn sản phẩm này không?" : "Bạn có muốn hiện sản phẩm này không?"}
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <button
                              onClick={() => handleUpdateVisible()}
                              className="w-full bg-red-500 hover:bg-red-600 rounded-lg shadow text-white"
                            >
                              {product.visible ? "Có" : "Có"}
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
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-3 px-4 border-b" colSpan={7}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Modal open={opendetail} onClose={handleCloseDetail}>
          <span> Thông tin sản phẩm:</span>
          {selectedProductId && <DetailProduct id={selectedProductId} />}
        </Modal>

        {totalProducts > 0 && (
          <PaginationList
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalProducts={totalProducts}
            handlePageClick={handlePageClick}
          />
        )}
      </div>
    </div>
  );
}

export default ProductList;
