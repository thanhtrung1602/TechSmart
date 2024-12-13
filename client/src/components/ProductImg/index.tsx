import Image from "../Image";
import useGet from "~/hooks/useGet";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import Button from "../Button";
type ProductImage = {
  id: number;
  productId: number;
  img: string;
};

function ProductImg({ id, img }: { id: number; img: string }) {
  const [idxImage, setIdxImage] = useState<number>(0);

  const { data: images } = useGet<ProductImage[] | undefined>(
    `/productimgs/getAllProductImgByProduct/${id}`
  );

  const handleNext = () => {
    if (!images) return;
    if (idxImage === images?.length - 1) {
      setIdxImage(0);
    } else {
      setIdxImage(idxImage + 1);
    }
  }

  const handlePrev = () => {
    if (!images) return;
    if (idxImage === 0) {
      setIdxImage(images?.length - 1);
    } else {
      setIdxImage(idxImage - 1);
    }
  }

  return (
    <>
      <div className="relative w-full flex justify-center px-4 sm:px-6 lg:px-10 py-6 sm:py-10 bg-white rounded">
        {/* Nút mũi tên trái */}
        <Button
          className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-8 text-[#6C7275] rounded-full cursor-pointer hover:bg-gray-200 flex items-center justify-center"
          onClick={handlePrev}
        >
          <FaArrowLeft className="text-lg" />
        </Button>

        {/* Hình ảnh chính */}
        <img
          src={images?.[idxImage]?.img || img}
          alt={images?.[idxImage]?.img}
          className="w-full max-w-lg object-contain"
          loading="lazy"
        />

        {/* Nút mũi tên phải */}
        <Button
          className="absolute top-1/2 right-0 -translate-y-1/2 w-8 h-8 text-[#6C7275] rounded-full cursor-pointer hover:bg-gray-200 flex items-center justify-center"
          onClick={handleNext}
        >
          <FaArrowRight className="text-lg" />
        </Button>
      </div>

      {/* Danh sách hình ảnh thu nhỏ */}
      <div className="w-full flex flex-wrap gap-2 justify-center mt-4 lg:flex-nowrap">
        {images?.map((image, index) => (
          <div key={image.id} className="cursor-pointer">
            <Image
              src={image.img}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-md border p-1 object-cover
            ${idxImage === index ? "border-black" : "border-gray-300"}
          `}
              onClick={() => setIdxImage(index)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductImg;
