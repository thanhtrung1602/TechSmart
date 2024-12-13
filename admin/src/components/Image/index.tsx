import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; // Đảm bảo bạn đã import hiệu ứng blur

type ImageProps = {
  alt?: string;
  src?: string;
  className?: string;
  fallbackSrc?: string; // Ảnh mặc định
  onClick?: () => void;
};

function Image({ alt, src, className, fallbackSrc, onClick }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false); // Quản lý trạng thái khi ảnh đã tải
  const [imgSrc, setImgSrc] = useState<string | undefined>(src); // Quản lý nguồn ảnh

  const handleAfterLoad = () => {
    setIsLoaded(true); // Khi ảnh đã tải xong, cập nhật trạng thái
  };

  const handleError = () => {
    if (fallbackSrc) {
      setImgSrc(fallbackSrc); // Nếu có lỗi, đặt ảnh mặc định
    }
  };

  return (
    <LazyLoadImage
      alt={alt}
      src={imgSrc}
      effect="blur" // Hiệu ứng mờ khi đang tải
      onLoad={handleAfterLoad} // Sự kiện sau khi tải
      onError={handleError} // Sự kiện khi lỗi
      className={`${className} transition-opacity duration-700 ease-in-out m-0 p-0 block ${
        isLoaded ? "opacity-100" : "opacity-0 blur-md"
      }`}
      onClick={onClick}
      loading="lazy"
    />
  );
}

export default Image;
