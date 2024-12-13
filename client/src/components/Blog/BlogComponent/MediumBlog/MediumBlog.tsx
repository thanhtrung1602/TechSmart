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

export default function MediumBlog({
  title,
  excerpt,
  featured_media,
  slug,
}: {
  title: string;
  excerpt: string;
  featured_media: number;
  slug: string;
}) {
  const { data: mediaBlog } = useBlog<MediaBlog>(`/media/${featured_media}`);
  const titleHtml = decodeHtml(title);
  const excerptRender = decodeHtml(excerpt);

  return (
    <div className="flex flex-col sm:flex-row items-start gap-2 rounded overflow-hidden select-none">
      <Link
        to={`/blog/${slug}`}
        className="flex flex-col sm:flex-row items-start gap-4"
      >
        <div className="flex-shrink-0 w-full md:w-1/3 mb-2">
          <img
            alt=""
            src={mediaBlog?.guid.rendered}
            className="w-full h-auto object-cover rounded-lg"
            style={{ maxHeight: "200px", maxWidth: "400px" }}
          />
        </div>
        <div className="flex flex-col gap-y-3 w-full md:w-2/3">
          <p className="font-medium text-xl mt-1">
            {titleHtml?.length > 30
              ? `${titleHtml.substring(0, 27)}...`
              : titleHtml}
          </p>
          <div
            className="text-sm text-gray-700"
            dangerouslySetInnerHTML={{ __html: excerptRender }}
          />
        </div>
      </Link>
    </div>
  );
}
