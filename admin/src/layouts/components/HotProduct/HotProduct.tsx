import useGet from "~/hooks/useGet";
import { Link } from "react-router-dom";
import Products from "~/models/Products";

function HotProduct() {
  const {
    data: products,
    error: productsError,
    isLoading: productsIsLoading,
  } = useGet<Products[] | undefined>(`/products/getProductsHot`);

  if (productsIsLoading) {
    return <div>Loading...</div>;
  }

  if (productsError) {
    return <div>Error loading products.</div>;
  }

  const calculateDiscountedPrice = (
    price: number,
    discount: number
  ): number => {
    return Math.round(price * (1 - discount / 100));
  };

  const productsToShow = Array.isArray(products) ? products : [];

  return (
    <div className="w-1/3 bg-white p-4 rounded-lg shadow-lg">
      <strong className="text-gray-700 font-bold">Sản phẩm nổi bật</strong>
      <div className="mt-4 flex flex-col gap-3 max-h-64 scroll-smooth scroll-pl-2 overflow-y-auto">
        {productsToShow?.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="flex items-start hover:no-underline"
          >
            <div className="w-10 h-10 min-w-[2.5rem] bg-gray-200 rounded-sm">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
            <div className="ml-4 flex-1">
              <p className="line-clamp-1 text-sm text-gray-800">
                {product.name}
              </p>
              <div className="text-xs text-black pl-1.5">
                {calculateDiscountedPrice(
                  product.price,
                  product.discount
                ).toLocaleString("vi")}{" "}
                VNĐ
              </div>
              <div className="text-xs text-red-500 pl-1.5">
                {product.discount}% off
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HotProduct;
