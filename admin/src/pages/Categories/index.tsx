import { FiRefreshCw, FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import useGet from "~/hooks/useGet";
import Categories from "~/models/Categories";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "~/components/Modal/Modal";
import Image from "~/components/Image";
import { HiOutlinePencilAlt } from "react-icons/hi";
import PaginationList from "~/components/PaginationList";
import useDebounce from "~/hooks/useDebounce";
import { BiSolidHide } from "react-icons/bi";
import { BiSolidShow } from "react-icons/bi";
import { usePatch } from "~/hooks/usePost";

function CategoryList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [open, setOpen] = useState(false);
  const [isUpdateVisible, setIsUpdateVisible] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<boolean | null>(null); // Trạng thái lọc (Ẩn, Hiện)
  const { mutate: UpdateVisible } = usePatch();
  const debounceSearch = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  const urlFiltered = (page: number, size: number) => {
    return `/categories/filteredCategories?page=${page}&size=${size}&search=${debounceSearch}&filter=${selectedCategory}&visible=${filterStatus}`;
  };

  const { data: categoryPagination } = useGet<{
    count: number;
    rows: Categories[];
  }>(urlFiltered(currentPage, itemsPerPage));
  const { data: categories } = useGet<Categories[]>(
    "/categories/getAllCategories"
  );
  useEffect(() => {

    if (categoryPagination) {
      setTotalItems(categoryPagination.count);
    }
  }, [categoryPagination]);
  const handleUpdateVisible = () => {
    if (!isUpdateVisible) return;
    UpdateVisible(
      {
        url: `/categories/updateCategoriesByVisible/${isUpdateVisible}`,
      },
      {
        onSuccess: (response) => {
          console.log(response);
          if (response.status === 200) {
            queryClient.invalidateQueries({
              queryKey: ["/categories/getAllCategories"],
            });
            toast.success("Cập nhật thành công");
            setOpen(false);
            setIsUpdateVisible(null);
          }
        },
        onError: (error) => {
          alert("Error deleting category: " + error.message);
          toast.error("Có lỗi xảy ra ");
          setIsUpdateVisible(null);
          navigate("/categories");
        },
      }
    );
  };

  const handlePageClick = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSearchTerm("");
    setFilterStatus(null);
  };
  return (
    <div className="min-h-screen">
      <h1 className="text-[32px] font-bold mb-4">Danh sách loại</h1>

      <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4">
          <div className="flex space-x-4">
            <select
              value={selectedCategory || ""}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg focus:outline-none"
            >
              <option value="">Tên danh mục</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <select
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg focus:outline-none"
              value={filterStatus !== null ? filterStatus.toString() : ""}
              onChange={(e) => {
                const value = e.target.value;
                console.log(value);
                setFilterStatus(value === "true" ? true : value === "false" ? false : null);
              }}
            >
              <option value="" disabled hidden>Tất cả</option>
              <option value="true">Đang hiện</option>
              <option value="false">Đã ẩn</option>
            </select>
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg focus:outline-none"
          />

        </div>
        <div className="flex space-x-2">
          <button
            onClick={resetFilters}
            className="flex items-center space-x-2 py-2 px-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Bỏ lọc</span>
          </button>

          <Link to="/category/addCategory">
            <button className="text-white bg-green-500 hover:bg-green-600 flex items-center px-4 py-2 rounded-lg">
              <FiPlus className="w-4 h-4 mr-2" />
              Thêm
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-300">
            <tr className="text-center">
              <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                STT
              </th>
              <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                Ảnh
              </th>
              <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                Tên loại
              </th>
              <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                Đường dẫn
              </th>
              <th className="py-3 px-4 font-semibold text-[#202224] border-b text-center">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {categoryPagination && categoryPagination.count > 0 ? (
              categoryPagination.rows?.map((category, index) => (

                <tr className="border-b" key={category.id}>
                  <td className="py-3 px-4 text-center">{index + 1}</td>
                  <td className="py-3 px-4 text-center">
                    <Image
                      src={category.img}
                      alt={category.name}
                      className="w-2/3"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">{category.name}</td>
                  <td className="py-3 px-4 text-center">{category.slug}</td>

                  <td className="py-3 px-4 w-2/12 text-center">
                    <span className="w-[100%] text-center px-4 py-2 text-xs font-semibold rounded-lg flex justify-between">
                      <Link
                        to={`/category/updateCategory/${category.id}`}
                        className="w-[100%] flex items-center justify-center py-2 px-4 text-[#319c5a] bg-green-100 rounded-tl-md rounded-bl-md duration-500 hover:text-green-600 hover:bg-green-300"
                      >
                        <HiOutlinePencilAlt className="text-lg flex items-center justify-center" />
                      </Link>
                      <button
                        onClick={() => {
                          setOpen(true);
                          setIsUpdateVisible(category.id); // Chuyển thành setIsUpdating(category.id) nếu cần
                        }}
                        disabled={isUpdateVisible === category.id} // Điều kiện này vẫn giữ nguyên
                        className={`w-[100%] flex items-center justify-center py-2 px-4 rounded-tr-md rounded-br-md duration-500 ${category.visible === false ? 'bg-red-100 text-red-500 hover:text-red-600 hover:bg-red-300' : 'bg-green-100 text-green-500 hover:text-green-600 hover:bg-green-300'}`}
                      >
                        {category.visible === false ? (
                          <BiSolidHide className="size-4" />
                        ) : (
                          <BiSolidShow className="size-4" />
                        )}
                      </button>


                      <Modal open={open} onClose={() => { setOpen(false); }}>
                        <div className="text-center w-auto">
                          {/* Conditional icon rendering */}
                          {category.visible == true ? (
                            <BiSolidHide size={56} className="mx-auto text-red-500" />
                          ) : (
                            <BiSolidShow size={56} className="mx-auto  text-green-500" />
                          )}
                          <div className="mx-auto my-4">
                            <h3 className="text-lg font-bold text-gray-800">
                              {category.visible == true ? "Xác nhận ẩn sản phẩm" : "Xác nhận hiện sản phẩm"}
                            </h3>
                            <p className="text-sm text-gray-500 my-2">
                              {category.visible == true ? "Bạn có muốn ẩn sản phẩm này không?" : "Bạn có muốn hiện sản phẩm này không?"}
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <button
                              onClick={() => handleUpdateVisible()}
                              className="w-full bg-red-500 hover:bg-red-600 rounded-lg shadow text-white"
                            >
                              {category.visible ? "Có" : "Có"}
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
                <td className="py-3 px-4 border-b" colSpan={5}>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {totalItems > 0 && (
          <PaginationList
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalProducts={totalItems}
            handlePageClick={handlePageClick}
          />
        )}
      </div>
    </div>
  );
}

export default CategoryList;
