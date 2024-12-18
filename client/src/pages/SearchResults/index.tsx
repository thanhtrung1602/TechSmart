import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Image from "~/components/Image";
import PaginationList from "~/components/PaginationList";
import emptyProduct from "~/assets/images/empty_product.png";
import currencyFormat from "~/components/CurrencyFormat";
import { IoFilter } from "react-icons/io5";
import { IoGridOutline } from "react-icons/io5";
import useGet from "~/hooks/useGet";
import Products from "~/models/Products";
import Categories from "~/models/Categories";
import Manufacturer from "~/models/Manufacturer";

function SearchResults() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Số sản phẩm hiển thị mỗi trang
  const [selectedPrice, setSelectedPrice] = useState({
    minPrice: 0,
    maxPrice: Number.MAX_SAFE_INTEGER,
  });

  const query = new URLSearchParams(location.search).get("s");

  const { data: searchResult } = useGet<{
    success: boolean;
    data: {
      products: Products[];
      categories: Categories[];
      manufacturers: Manufacturer[];
    };
  }>(`/products/tim-kiem?s=${query}`);

  console.log(searchResult);

  const { data: products } = useGet<Products[]>("/products/findAll");
  const { data: categories } = useGet<Categories[]>(
    "/categories/getAllCategories"
  );

  if (!products || !categories) {
    return <div>Loading...</div>;
  }

  //Tính số lượng sản phẩm theo category
  const categoryProductCounts = searchResult?.data.categories?.map(
    (category) => {
      const productCount = searchResult.data.products?.filter(
        (product) => product.categoryId === category.id
      ).length;

      return {
        id: category.id,
        name: category.name,
        img: category.img,
        count: productCount,
      };
    }
  );
  // Tính tổng số lượng sản phẩm đã search theo từ khoá
  const totalProducts = categoryProductCounts?.reduce(
    (total, category) => total + category.count,
    0
  );

  // Xử lý phân trang
  const handlePageClick = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  // Xử lý lọc theo giá
  const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [min, max] = event.target.value.split("-").map(Number);
    setSelectedPrice({ minPrice: min, maxPrice: max });
  };

  // Lọc sản phẩm theo giá
  const filteredProducts =
    searchResult?.data.products?.filter(
      (product: Products) =>
        product.price >= selectedPrice.minPrice &&
        product.price <= selectedPrice.maxPrice
    ) || [];

  // Phân trang sản phẩm
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="px-40 w-full">
        <h1 className="pt-4 mb-3 text-3xl font-bold">Kết quả tìm kiếm</h1>
      </div>
      <div className="px-40 py-5 grid grid-cols-4 gap-x-5">
        {/* Sidebar filters */}
        <div className="sticky top-[92px] h-[90vh] col-span-1 bg-white rounded p-4">
          <div className="flex items-center gap-x-2 py-2 mb-2 border-b-2">
            <IoFilter className="text-xl" />
            <h2 className="text-lg font-semibold">Bộ lọc</h2>
          </div>
          <form className="flex flex-col gap-y-6">
            <div>
              <label
                htmlFor="price"
                className="block text-gray-500 font-medium mb-2"
              >
                Mức giá
              </label>
              <select
                id="price"
                value={`${selectedPrice.minPrice}-${selectedPrice.maxPrice}`}
                name="price"
                onChange={handlePriceChange}
                className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              >
                <option value={`0-${Number.MAX_SAFE_INTEGER}`}>Tất cả</option>
                <option value="1-2000000">Dưới 2 triệu</option>
                <option value="2000000-4000000">Từ 2 - 4 triệu</option>
                <option value="4000000-8000000">Từ 4 - 8 triệu</option>
                <option value="8000000-10000000">Từ 8 - 10 triệu</option>
                <option value="10000000-20000000">Từ 10 - 20 triệu</option>
                <option value="20000000-999999999999">Trên 20 triệu</option>
              </select>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="col-span-3 ">
          {searchResult ? (
            <>
              <div className="px-6 py-4 bg-gray-100 bg-white rounded-md">
                {/* Danh mục */}
                <div className="flex items-center space-x-2 mb-4">
                  {/* Nút "Tất cả" */}
                  <button className="flex flex-col items-center px-6 py-4 border border-gray-300 rounded-lg hover:border-red-500 transition duration-300">
                    <div className="w-11 h-11 flex items-center justify-center">
                      <IoGridOutline className="text-2xl" />
                    </div>
                    <span className="text-sm font-medium">Tất cả</span>
                  </button>

                  {/* Các danh mục khác */}
                  {categoryProductCounts?.map((category) => (
                    <button
                      key={category.id}
                      className="flex flex-col items-center px-4 py-1 border border-gray-300 rounded-lg hover:border-red-500 transition duration-300"
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-white">
                        <Image
                          src={category.img}
                          alt={category.name}
                          className="size-8 md:size-12"
                        />
                      </div>
                      <span className="text-sm font-medium mt-1">
                        {category.name}
                      </span>
                      <span className="text-gray-400">
                        ({category.count || 0})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Lọc nhanh */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-medium">Lọc nhanh:</span>
                  <select className="border border-gray-300 rounded-md px-3 py-1 bg-white">
                    <option value="">Hãng sản xuất</option>
                    {/* Lọc các hãng trùng lặp */}
                    {[
                      ...new Map(
                        searchResult?.data.manufacturers?.map((manufacturer) => [
                          manufacturer.name,
                          manufacturer,
                        ])
                      ).values(),
                    ]?.map((uniqueManufacturer) => (
                      <option key={uniqueManufacturer.id}>
                        {uniqueManufacturer.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-4 mt-4">
                Tìm thấy {totalProducts} kết quả với từ khoá {query}
              </h2>
              <div className="grid grid-cols-4 gap-2">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts?.map((product: Products) => (
                    <div
                      key={product.id}
                      className="flex flex-col justify-between relative p-4 rounded-lg bg-white shadow hover:shadow-md duration-300 overflow-hidden select-none "
                    >
                      {/* Dải giảm giá */}
                      {product.discount > 0 && (
                        <span className="absolute top-0 left-0 rounded-tr-full rounded-br-full px-4 text-white text-xs font-semibold py-[6px] bg-[#eb3e32] z-10 ">
                          Giảm {product.discount}%
                        </span>
                      )}

                      {/* Link sản phẩm */}
                      <Link
                        to={`/product/${product.categoryData.slug}/${product.slug}`}
                      >
                        {/* Hình ảnh sản phẩm */}
                        <div className="h-48 mb-2 flex justify-center items-center rounded-lg bg-white image-container overflow-hidden box-border">
                          <Image
                            src={product.img}
                            fallbackSrc="/fallback-product.jpg"
                            alt="Image Product"
                            className="size-[73%] md:size-3/4 mx-auto object-cover"
                          />
                        </div>

                        {/* Tên sản phẩm */}
                        <p className="line-clamp-2 font-medium text-sm pt-1 text-gray-800 hover:text-red-500 duration-200 h-12">
                          {product.name}
                        </p>
                      </Link>

                      {/* Thông tin bổ sung */}
                      <div className="flex items-center text-xs text-gray-500 mt-1 h-4">
                        <span className="mr-2">
                          Thương hiệu: {product.manufacturerData.name}
                        </span>
                      </div>

                      {/* Giá sản phẩm */}
                      <div className="mt-2 flex flex-col flex-grow">
                        {product.discount > 0 && (
                          <span className="text-xs md:text-sm text-gray-500 line-through">
                            {currencyFormat({
                              paramFirst: product.price,
                              paramSecond: product.discount,
                            })}
                          </span>
                        )}
                        <span className="font-semibold text-base md:text-lg text-red-600">
                          {product.price?.toLocaleString()}đ
                        </span>
                        {product.discount > 0 && (
                          <span className="text-[0.7rem] md:text-xs text-green-600">
                            Bạn tiết kiệm{" "}
                            {(
                              Math.round(
                                product.price /
                                  (1 - product.discount / 100) /
                                  1000
                              ) *
                                1000 -
                              product.price
                            )?.toLocaleString()}
                            đ
                          </span>
                        )}
                      </div>

                      {/* Thông tin tồn kho */}
                      <div className="text-xs text-gray-600 mt-2">
                        <span className="mr-2">Tồn kho: {product.stock}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <Image src={emptyProduct} alt="Empty Product" />
                    <p className="text-sm text-gray-500">
                      Rất tiếc, chúng tôi không tìm thấy kết quả phù hợp.
                    </p>
                  </div>
                )}
              </div>
              {filteredProducts.length > itemsPerPage && (
                <PaginationList
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalProducts={filteredProducts.length}
                  handlePageClick={handlePageClick}
                />
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <Image src={emptyProduct} alt="Empty Product" />
              <p className="text-sm text-gray-500">
                Rất tiếc, chúng tôi không tìm thấy kết quả phù hợp.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchResults;
