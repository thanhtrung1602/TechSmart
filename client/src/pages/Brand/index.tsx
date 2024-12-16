import { useState, useEffect } from "react";
import useGet from "~/hooks/useGet";
import Image from "~/components/Image";
import emptyProduct from "~/assets/images/empty_product.png";
import Products from "~/models/Products";
import Categories from "~/models/Categories";
import GetProducts from "~/features/getProducts";
import { Link, useParams } from "react-router-dom";
import { IoFilter } from "react-icons/io5";
import PaginationList from "~/components/PaginationList";
import currencyFormat from "~/components/CurrencyFormat";
import BannerCategory, {
  CategoryType,
} from "~/layouts/components/BannerCategory";

function Brand() {
  const { slugCate, slugManu } = useParams();
  console.log(slugCate, slugManu);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedPrice, setSelectedPrice] = useState<{
    minPrice: number;
    maxPrice: number;
  }>({ minPrice: 0, maxPrice: 999999999999999 });
  const [totalProducts] = useState<number>(0);

  const { data: category } = useGet<Categories>(
    `/categories/getCategorySlug/${slugCate}`
  );

  const { data: productOfManufacturerCategoryAndPrice } = useGet<{
    total: number;
    rows: Products[];
  }>(
    `/products/getProductOfManufacturerCategoryAndPrice/${slugCate}/${slugManu}?page=${currentPage}&size=${itemsPerPage}&minPrice=${selectedPrice.minPrice}&maxPrice=${selectedPrice.maxPrice}`
  );

  console.log(productOfManufacturerCategoryAndPrice);

  //Set price về lại mặc định khi slug thay đổi
  useEffect(() => {
    setSelectedPrice({ minPrice: 0, maxPrice: 999999999999999 });
  }, [slugManu]);

  //Set current page về lại mặc định khi slug thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [slugManu]);

  // Handle page click
  const handlePageClick = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  // Handle price change
  const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const price = event.target.value.split("-"); //Cắt chuỗi thành mảng
    const [min, max] = price; //Áp dụng destructuring để lấy 2 phần tử trong mảng
    setSelectedPrice({ minPrice: parseInt(min), maxPrice: parseInt(max) });
  };

  return (
    <>
      <div className="container mx-auto px-4 md:px-10 xl:px-40 w-full">
        <h1 className="pt-4 mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">{category?.name}</h1>
        {category && <BannerCategory category={category?.id as CategoryType} />}
      </div>
      <div className="container w-full mx-auto px-4 md:px-10 xl:px-40 py-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-3 xL:gap-4">
        {/* Sidebar filters */}
        <div className="mb-4 md:mb-0 md:sticky top-[92px] h-auto md:h-[85vh] col-span-1 bg-white rounded p-4 shadow-md">
          <div className="flex items-center gap-x-2 py-2 mb-2 border-b-2">
            <IoFilter className="text-lg sm:text-xl md:text-2xl" />
            <h2 className="text-base sm:text-lg md:text-xl font-semibold">Bộ lọc</h2>
          </div>
          <form className="flex flex-row justify-between md:flex-col md:gap-y-6">
            <div className="w-full">
              <label
                htmlFor="price"
                className="block text-gray-500 font-medium mb-2"
              >
                Mức giá
              </label>
              <select
                id="price"
                value={`${selectedPrice.minPrice} - ${selectedPrice.maxPrice}`}
                name="price"
                onChange={handlePriceChange}
                className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              >
                <option
                  value="0-999999999999999"
                  className="text-xs xl:text-base"
                >Tất cả</option>
                <option
                  value="1 - 2000000"
                  className="text-xs xl:text-base"
                >Dưới 2 triệu</option>
                <option
                  value="2000000 - 4000000"
                  className="text-xs xl:text-base"
                >Từ 2 - 4 triệu</option>
                <option
                  value="4000000 - 8000000"
                  className="text-xs xl:text-base"
                >Từ 4 - 8 triệu</option>
                <option
                  value="8000000 - 10000000"
                  className="text-xs xl:text-base"
                >Từ 8 - 10 triệu</option>
                <option
                  value="10000000 - 20000000"
                  className="text-xs xl:text-base"
                >Từ 10 - 20 triệu</option>
                <option
                  value="20000000 - 999999999999999"
                  className="text-xs xl:text-base"
                >
                  Trên 20 triệu
                </option>
              </select>
            </div>
          </form>
        </div>

        {/* Products */}
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-3">
          {productOfManufacturerCategoryAndPrice ? (
            <div className="grid grid-cols-2 gap-[10px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productOfManufacturerCategoryAndPrice?.rows?.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col justify-between relative p-4 rounded-lg bg-white shadow hover:shadow-md duration-300 overflow-hidden select-none"
                >
                  <span className="absolute top-0 left-0 rounded-tr-full rounded-br-full px-4 text-white text-xs font-semibold py-[6px] bg-[#eb3e32] z-10">
                    Giảm {product.discount}%
                  </span>
                  <Link
                    to={`/product/${product.categoryData.slug}/${product.slug}`}
                  >
                    <div className="h-48 mb-2 flex justify-center items-center rounded-lg bg-white image-container overflow-hidden box-border">
                      <Image
                        src={product.img}
                        fallbackSrc=""
                        alt="Image Product"
                        className="size-[73%] md:size-3/4 mx-auto object-cover"
                      />
                    </div>
                    <p className="line-clamp-2 font-medium text-sm pt-1 text-gray-800 hover:text-red-500 duration-200 h-12">
                      {product.name}
                    </p>
                  </Link>
                  {/* Thông tin bổ sung */}
                  <div className="flex items-center text-xs text-gray-500 mt-1 h-11">
                    <span className="mr-2">
                      Thương hiệu: {product.manufacturerData.name}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-col flex-grow">
                    <span className="text-xs md:text-sm text-gray-500 line-through">
                      {currencyFormat({
                        paramFirst: product.price,
                        paramSecond: product.discount,
                      })}
                      đ đ
                    </span>
                    <span className="font-semibold text-base md:text-lg text-red-600">
                      {product.price?.toLocaleString()}đ
                    </span>
                    {product.discount > 0 && (
                      <span className="text-[0.7rem] md:text-xs text-green-600">
                        Giảm{" "}
                        {(
                          Math.round(
                            product.price / (1 - product.discount / 100) / 1000
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
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Image src={emptyProduct} alt="Empty Product"></Image>
              <p className="text-sm text-gray-500">
                Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalProducts
            ? productOfManufacturerCategoryAndPrice && (
              <PaginationList
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalProducts={totalProducts}
                handlePageClick={handlePageClick}
              />
            )
            : ""}
        </div>
      </div>
    </>
  );
}

export default Brand;
