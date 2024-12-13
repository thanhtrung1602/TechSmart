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

export default function SmallBlog({
  title,
  featured_media,
  slug,
}: {
  title: string;
  featured_media: number;
  slug: string;
}) {
  const { data: mediaBlog } = useBlog<MediaBlog>(`/media/${featured_media}`);
  const titleHtml = decodeHtml(title);
  return (
    <div className="relative rounded overflow-hidden select-none ">
      <Link
        to={`/blog/${slug}`}
        className="flex flex-row gap-4 sm:flex-col sm:gap-0"
      >
        <div className="w-full mb-3 flex justify-center">
          <img
            alt=""
            src={mediaBlog?.guid.rendered}
            className="w-full my-0 mx-auto rounded-lg"
          />
        </div>
        <div className="flex flex-col">
          <p className="font-medium text-base">
            {titleHtml?.length > 70
              ? `${titleHtml.substring(0, 60)}...`
              : titleHtml}
          </p>
        </div>
      </Link>
    </div>
  );
}
