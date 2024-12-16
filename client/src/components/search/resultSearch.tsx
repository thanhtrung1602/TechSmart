import { Link } from "react-router-dom";
import Image from "../Image";
import useGet from "~/hooks/useGet";
import Products from "~/models/Products";

interface IResultSearch {
  id: number;
  name: string;
  image: string;
  price: number;
  slug: string;
}

function ResultSearch(props: IResultSearch) {
  const { data } = useGet<Products>(`/products/getOneProductById/${props.id}`);  

  return (
    <div className="mx-1 flex items-center justify-between bg-white p-2">
      <Link to={`/product/${data?.categoryData.slug}/${props.slug}`}>
        <div className="flex items-center gap-2">
          <Image
            className="w-10"
            src={
              props.image ||
              "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
            }
            alt={props.name}
          />
          <div className="text-sm text-black">
            <p>{props.name}</p>
            <p className="font-semibold">
              {props.price &&
                props.price?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ResultSearch;
