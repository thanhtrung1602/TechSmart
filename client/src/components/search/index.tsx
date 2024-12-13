import { memo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Tippy from "@tippyjs/react/headless";
import useSearch from "~/hooks/useSearch";
import useDebounce from "~/hooks/useDebounce";
import { Link, useNavigate } from "react-router-dom";
import ResultSearch from "./resultSearch";


type SearchProduct = {
  _id: number;
  _source: {
    img: string;
    name: string;
    price: number;
    slug: string;
  };
};

function Search() {
  const [key, setKey] = useState<string>("");
  const [hiddenSearch, setHiddenSearch] = useState<boolean>(false);
  const inputSearchDebounce = useDebounce(key, 300);
  const navigate = useNavigate();
  const {
    data: products,
    isLoading,
    isError,
  } = useSearch<SearchProduct[]>("/products/search", inputSearchDebounce);

  // Xử lý điều hướng khi nhấn Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && key.trim()) {
      e.preventDefault();
      const formattedKey = key.trim().toLowerCase();
      // Điều hướng đến tìm kiếm chung
      navigate(`/tim-kiem?s=${formattedKey}`);
      setHiddenSearch(false);
    }
  };
  

  return (
    <Tippy
      interactive
      visible={hiddenSearch}
      placement="bottom-end"
      onClickOutside={() => setHiddenSearch(false)}
      render={(attrs) => (
        <div className="w-full mt-2 md:w-[36rem]" tabIndex={-1} {...attrs}>
          <div className="rounded-lg bg-white shadow-lg">
            {hiddenSearch && (
              <ul>
                <li className="p-3 border-b text-gray-600">
                  Tìm kiếm cho "{key}"
                </li>

                {isLoading && (
                  <li className="p-4 text-center text-gray-500">
                    <div className="inline-block animate-spin w-6 h-6 border-2 border-[#eb3e32] border-t-transparent rounded-full" />
                    <p className="mt-2">Đang tìm kiếm...</p>
                  </li>
                )}

                {!isLoading && isError && (
                  <li className="p-4 text-center text-red-500">
                    Lỗi khi tải dữ liệu, vui lòng thử lại.
                  </li>
                )}

                {!isLoading && !isError && products?.length === 0 && (
                  <li className="p-4 text-center text-gray-500">
                    Không tìm thấy sản phẩm nào.
                  </li>
                )}

                {!isLoading && products && products?.length > 0 && (
                  <>
                    <li className="p-3 text-gray-600">Sản phẩm đề xuất</li>
                    {products?.map((product) => (
                      <li key={product._id} className="">
                        <Link
                          to={`/${product._source.slug}`}
                          className="block p-3"
                          onClick={() => setHiddenSearch(false)}
                        >
                          <ResultSearch
                            id={product._id}
                            name={product._source.name}
                            image={product._source.img}
                            price={product._source.price}
                            slug={product._source.slug}
                          />
                        </Link>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    >
      <form className="relative" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setHiddenSearch(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Hôm nay bạn muốn tìm kiếm gì?"
          className="sm:w-80 md:w-[25rem] xl:w-[36rem] h-11 rounded-full pl-5 pr-12 text-black bg-white 
                 border border-[#eb3e32] outline-none focus:border-[#d32f2f] placeholder:text-xs md:placeholder:text-sm"
        />
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#eb3e32] hover:text-[#d32f2f]"
          type="submit"
        >
          <FaSearch className="w-5 h-5" />
        </button>
      </form>
    </Tippy>
  );
}

export default memo(Search);
