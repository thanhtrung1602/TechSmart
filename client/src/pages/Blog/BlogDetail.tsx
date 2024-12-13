import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useBlog from "~/hooks/useBlog";
import Blog from "~/models/blog";


import decodeHtml from "~/utils/decodeHtml";

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: blogs } = useBlog<Blog[]>(`/posts?slug=${slug}`);

  useEffect(() => {
    const elementDiv = document.querySelector(".blogContent") as HTMLDivElement;
    if (elementDiv) {
      elementDiv.style.lineHeight = "1.6";
      const elementImages = document.querySelectorAll(
        "img"
      ) as NodeListOf<HTMLImageElement>;

      const wp_block_gallery = document.querySelector(
        ".wp-block-gallery"
      ) as HTMLDivElement;

      if (wp_block_gallery) {
        wp_block_gallery.style.display = "flex";
        wp_block_gallery.style.flexDirection = "column";
        wp_block_gallery.style.gap = "10px";
      }

      elementImages.forEach((imgElement) => {
        const divImgElement = document.createElement("div");
        imgElement.parentNode?.insertBefore(divImgElement, imgElement);
        divImgElement.appendChild(imgElement);

        divImgElement.style.display = "flex";
        divImgElement.style.justifyContent = "center";
        divImgElement.style.gap = "4px";
        divImgElement.style.width = "100%";
      });
    }
  }, [blogs]);

  return (
    <div className="flex justify-center bg-gray-100 py-8 px-4">
      {blogs?.map((blog) => {
        const content = decodeHtml(blog.content.rendered);
        const titleBlog = decodeHtml(blog.title.rendered);
        return (
          <div
            className="bg-white max-w-4xl w-full p-6 md:p-10 rounded-lg shadow-lg"
            key={blog.id}
          >
            <h2 className="font-semibold text-3xl md:text-4xl mb-6 text-gray-800">
              {titleBlog}
            </h2>

            <div
              className="flex flex-col gap-3 blogContent text-gray-700 text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        );
      })}
    </div>
  );
}
