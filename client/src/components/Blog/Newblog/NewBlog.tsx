import useBlog from "~/hooks/useBlog";
import Blog from "~/models/blog";
import BigBlog from "~/components/Blog/BlogComponent/BigBlog/BigBlog";
import SmallBlog from "../BlogComponent/SmallBlog/Smallblog";

export default function NewBlog() {
  const { data: blogs } = useBlog<Blog[]>(`/posts`);

  return (
    <div className="gap-x-1 sm:gap-x-4 grid grid-cols-1 sm:grid-cols-11 container">
      {blogs && blogs?.length > 0 && (
        <>
          <div className="col-span-1 sm:col-span-6 bg-white p-6 rounded-lg shadow-md">
            <BigBlog
              title={blogs[0].title.rendered}
              excerpt={blogs[0].excerpt.rendered}
              featured_media={blogs[0].featured_media}
              slug={blogs[0].slug}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 sm:col-span-5 col-span-1 gap-1 sm:gap-4 mt-2 sm:mt-0">
            {blogs.slice(1, 5)?.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-col items-start bg-white p-4 rounded-lg shadow-md"
              >
                <SmallBlog
                  title={blog.title.rendered}
                  featured_media={blog.featured_media}
                  slug={blog.slug}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
