import decodeHtml from "~/utils/decodeHtml";
import useBlog from "~/hooks/useBlog";
import { Link } from "react-router-dom";

type MediaBlog = {
  id: number;
  date: Date;
  date_gmt: Date;
  guid: {
    rendered: string;
  };
};

export default function BlogChildren({
  title,
  excerpt,
  featured_media,
  slug,
}: {
  title: string;
  excerpt?: string;
  featured_media: number;
  slug: string;
}) {
  const { data: mediaBlog } = useBlog<MediaBlog>(`/media/${featured_media}`);
  const excerptRender = decodeHtml(excerpt);

  const titleHtml = decodeHtml(title);
  return (
    <div className="relative rounded overflow-hidden select-none">
      <Link to={`/blog/${slug}`}>
        <div className="mb-5 flex justify-center">
          <img
            alt=""
            src={mediaBlog?.guid.rendered}
            className="w-full my-0 mx-auto"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="font-medium text-sm mt-1 line-clamp-2">{titleHtml}</p>
          <span className="text-xs text-gray-500">
            {mediaBlog && new Date(mediaBlog?.date_gmt).toLocaleDateString()}
          </span>
          <div
            className="flex flex-col gap-3 blogContent text-gray-700 text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: excerptRender }}
          />
        </div>
      </Link>
    </div>
  );
}
