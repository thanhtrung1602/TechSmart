import { useState } from "react";
import useBlog from "~/hooks/useBlog";
import Blogs from "~/models/blog";
import MediumBlog from "../BlogComponent/MediumBlog/MediumBlog";
import PaginationList from "~/components/PaginationList";


export default function ListBlog() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Number of blogs per page
  const { data: blogs } = useBlog<Blogs[]>(`/posts?page=${currentPage}&per_page=${itemsPerPage}`);
  const total = blogs?.length;

  // Handle page change from PaginationList
  const handlePageClick = (_: any, page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white p-2 rounded-lg shadow-md gap-4 flex flex-col">
      {blogs &&
        blogs.length > 0 &&
        blogs.map((blog) => (
          <MediumBlog
            key={blog.id}
            title={blog.title.rendered}
            excerpt={blog.excerpt.rendered}
            featured_media={blog.featured_media}
            slug={blog.slug}
          />
        ))}

      {/* Pagination */}
      {total && (
        <PaginationList
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalProducts={total}
          handlePageClick={handlePageClick}
        />
      )}
    </div>
  );
}
