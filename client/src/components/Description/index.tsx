import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGet from "~/hooks/useGet";
import useBlog from "~/hooks/useBlog";
import decodeHtml from "~/utils/decodeHtml";
import Products from "~/models/Products";
import Blog from "~/models/blog";


function Description() {
  const { slugProduct } = useParams();
  const { data: productDetail } = useGet<Products>(
    `/products/getOneProduct/${slugProduct}`
  );
  const { data: blogs } = useBlog<Blog[]>("/posts");
  const [expanded, setExpanded] = useState(false); // Quản lý trạng thái hiển thị

  // Tìm blog phù hợp
  const matchingBlog = blogs?.find((blog) => blog.slug === productDetail?.slug);

  // Dùng nội dung mặc định nếu không có blog phù hợp
  const content = decodeHtml(matchingBlog?.content.rendered || "");
  const shortContent = content.slice(0, 300) + "..."; // Hiển thị 300 ký tự đầu

  useEffect(() => {
    const elementDiv = document.querySelector("#ez-toc-container") as HTMLDivElement;

    if (elementDiv) {
      elementDiv.style.display = "none";
    }
  }, [blogs]);

  // Không trả về `null` sớm, mà hiển thị một placeholder
  if (!matchingBlog) {
    return <div className="text-gray-500">Không có thông tin mô tả.</div>;
  }

  return (
    <div className="bg-white max-w-4xl w-full p-4 sm:p-6 lg:p-10 rounded-lg shadow-lg">
      <div className="text-gray-700 text-sm sm:text-base leading-relaxed">
        <div
          className="blogContent"
          dangerouslySetInnerHTML={{
            __html: expanded ? content : shortContent,
          }}
        />
        <button
          className="mt-4 text-sm sm:text-base text-blue-600 hover:text-blue-800 font-semibold"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Thu gọn" : "Đọc thêm"}
        </button>
      </div>
    </div>
  );
}


export default Description;
