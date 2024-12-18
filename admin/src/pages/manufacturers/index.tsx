import { FiRefreshCw, FiPlus } from "react-icons/fi";
import useGet from "~/hooks/useGet";
import { Link } from "react-router-dom";
import Manufacturer from "~/models/Manufacturer";
import Categories from "~/models/Categories";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PaginationList from "~/components/PaginationList";
import Image from "~/components/Image";
import Modal from "~/components/Modal/Modal";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useQueryClient } from "@tanstack/react-query";
import useDebounce from "~/hooks/useDebounce";
import { usePatch } from "~/hooks/usePost";
import { BiSolidHide } from "react-icons/bi";
import { BiSolidShow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
function Manufacturers() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalManufacturers, setTotalManufacturers] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<
    number | null
  >(null);
  const [isUpdateVisible, setIsUpdateVisible] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<boolean | null>(null); // Trạng thái lọc (Ẩn, Hiện)
  const [searchTerm, setSearchTerm] = useState("");
  const { mutate: UpdateVisible } = usePatch();

  const debounceSearch = useDebounce(searchTerm, 500);

  //Get api
  const { data: categories } = useGet<Categories[]>(
    "/categories/getAllCategories"
  );
  const { data: paginatedManufacturers } = useGet<{
    total: number;
    rows: Manufacturer[];
  }>(
    `/manufacturer/filteredManufacturer?page=${currentPage}&size=${itemsPerPage}&category=${selectedCategory}&manufacturer=${selectedManufacturer}&search=${debounceSearch}&visible=${filterStatus}`,
    { enabled: false }
  );
  const { data: manufacturerByCategory } = useGet<Manufacturer[]>(
    `/manufacturer/getManufacturerByCategory/${selectedCategory}`,
    { enabled: !!selectedCategory }
  );

  // Cập nhật total sau khi thay đổi filter
  useEffect(() => {
    if (paginatedManufacturers) {
      setTotalManufacturers(paginatedManufacturers.total);
    }
  }, [paginatedManufacturers]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedManufacturer(null);
    setCurrentPage(1);
    setFilterStatus(null);
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

  const handleUpdateVisible = () => {
    if (!isUpdateVisible) return;
    UpdateVisible(
      {
        url: `/manufacturer/updateManufacturerByVisible/${isUpdateVisible}`,
      },
      {
        onSuccess: (response) => {
          console.log(response);
          if (response.status === 200) {
            queryClient.invalidateQueries({
              queryKey: [`/manufacturer/getAllManufacturer`],
            });
            toast.success("Cập nhật thành công");
            setOpen(false);
            setIsUpdateVisible(null);
            navigate("/manufacturers");
            window.location.reload();
          }
        },
        onError: (error) => {
          alert("Error deleting category: " + error.message);
          toast.error("Có lỗi xảy ra ");
          setIsUpdateVisible(null);
          navigate("/manufacturers");
        },
      }
    );
  };

  return (
    <div>
      <div className="min-h-screen">
        <h1 className="text-[32px] font-bold mb-4">Danh sách hãng</h1>
        <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div className="flex space-x-4">
            {/* Category Filter */}
            <select
              value={selectedCategory || ""}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedManufacturer(null);
                setCurrentPage(1);
              }}
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg focus:outline-none"
            >
              <option value="" disabled hidden>
                Danh mục
              </option>

              {categories?.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* manufacturer */}
            <select
              value={selectedManufacturer || ""}
              onChange={(e) => {
                setSelectedManufacturer(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg focus:outline-none "
              disabled={!selectedCategory} // Disable nếu chưa chọn danh mục
            >
              <option value="" disabled hidden>
                Hãng
              </option>
              {manufacturerByCategory?.map((manufacturer) => (
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
                placeholder="Tìm kiếm theo tên hãng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={resetFilters}
              className="flex items-center space-x-2 py-2 px-4 text-red-600 bg-red-50 hover:bg-red-100  rounded-lg"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Bỏ lọc</span>
            </button>

            <Link to={`/manufacturer/addManufacturer`}>
              <button className="text-white bg-green-500 hover:bg-green-600 flex items-center px-4 py-2 rounded transition-all">
                <FiPlus className="w-4 h-4 mr-2" />
                <span>Thêm</span>
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
                  Dang mục
                </th>
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                  Nhà sản xuất
                </th>
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                  Ảnh
                </th>
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                  Đường dẫn
                </th>
                <th className="py-3 px-4 font-semibold text-[#202224] border-b">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedManufacturers?.total ? (
                paginatedManufacturers.rows?.map((m, index) => (
                  <tr key={m.id}>
                    <td className="py-3 px-4 border-b w-1/12 text-center">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 border-b w-2/12 text-center">
                      {categories?.find((c) => c.id === m.categoryId)?.name}
                    </td>
                    <td className="py-3 px-4 border-b w-2/12 text-center">
                      {m.name}
                    </td>
                    <td className="py-3 px-4 border-b w-2/12 text-center">
                      <Image
                        src={m.img}
                        alt={m.name}
                        className="flex text-center object-cover"
                      />
                    </td>
                    <td className="py-3 px-4 border-b w-2/12 text-center">
                      {m.slug}
                    </td>
                    <td className="py-3 px-4 border-b w-2/12">
                      <span className="w-[100%] text-center px-4 py-2 text-xs font-semibold rounded-lg flex justify-between">
                        <Link
                          to={`/manufacturer/updateManufacturer/${m.id}`}
                          className="w-[100%] flex items-center justify-center py-2 px-4 text-[#319c5a] bg-green-100 rounded-tl-md rounded-bl-md duration-500 hover:text-green-600 hover:bg-green-300"
                        >
                          <HiOutlinePencilAlt className="text-lg flex items-center justify-center" />
                        </Link>
                        <button
                          onClick={() => {
                            setOpen(true);
                            setIsUpdateVisible(m.id); // Chuyển thành setIsUpdating(category.id) nếu cần
                          }}
                          disabled={isUpdateVisible === m.id} // Điều kiện này vẫn giữ nguyên
                          className="w-[100%] flex items-center justify-center py-2 px-4  bg-red-100 rounded-tr-md rounded-br-md duration-500
                         hover:text-red-600 hover:bg-red-300"
                        >
                          {m.visible === true ? (
                            <BiSolidHide className="text-lg flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-300" />
                          ) : (
                            <BiSolidShow className="text-lg flex items-center justify-center text-green-500" />
                          )}
                        </button>

                        <Modal
                          open={open}
                          onClose={() => {
                            setOpen(false);
                          }}
                        >
                          <div className="text-center w-auto">
                            {/* Conditional icon rendering */}
                            {m.visible == true ? (
                              <BiSolidHide
                                size={56}
                                className="mx-auto text-red-500"
                              />
                            ) : (
                              <BiSolidShow
                                size={56}
                                className="mx-auto  text-green-500"
                              />
                            )}
                            <div className="mx-auto my-4">
                              <h3 className="text-lg font-bold text-gray-800">
                                {m.visible == true
                                  ? "Xác nhận ẩn sản phẩm"
                                  : "Xác nhận hiện sản phẩm"}
                              </h3>
                              <p className="text-sm text-gray-500 my-2">
                                {m.visible == true
                                  ? "Bạn có muốn ẩn sản phẩm này không?"
                                  : "Bạn có muốn hiện sản phẩm này không?"}
                              </p>
                            </div>
                            <div className="flex gap-4">
                              <button
                                onClick={() => handleUpdateVisible()}
                                className="w-full bg-red-500 hover:bg-red-600 rounded-lg shadow text-white"
                              >
                                {m.visible ? "Có" : "Có"}
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
                  <td className="py-3 px-4 border-b" colSpan={6}>
                    không tìm thấy nhà xuất bản nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          {totalManufacturers > 0 && (
            <PaginationList
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalProducts={totalManufacturers}
              handlePageClick={handlePageClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Manufacturers;
