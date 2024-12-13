import ListBlog from "~/components/Blog/ListBlog/ListBlog";
import NewBlog from "~/components/Blog/Newblog/NewBlog";

function Blog() {
  return (
    <div className="px-2.5 py-4 sm:px-40 md:px-12 lg:px-40">
      <div className="container">
        <div className="pt-4">
          <NewBlog />
        </div>
        <div className="pt-4">
          <span className="text-3xl font-medium mb-4">Danh sách tin tức</span>
          <ListBlog />
        </div>
      </div>
    </div>
  );
}

export default Blog;
