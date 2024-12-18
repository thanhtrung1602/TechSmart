import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Image from "~/components/Image";
import useGet from "~/hooks/useGet";
import { usePatch } from "~/hooks/usePost";
import Categories from "~/models/Categories";
import Manufacturer from "~/models/Manufacturer";
import DataManufacturer from "~/types/dataManufacturer";

function UpdateManufacture() {
  const queryClient = useQueryClient();
  const { id } = useParams(); // Lấy id dưới dạng chuỗi từ URL
  const manufactureId = Number(id);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DataManufacturer>();

  const { mutate: mutateManufacturer } = usePatch();

  const { data: manufacture, error } = useGet<Manufacturer>(
    `/manufacturer/getOneManufacturerById/${manufactureId}`
  ); // Sử dụng custom hook để fetch dữ liệu
  const [file, setFile] = useState<File | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]); // Quản lý ảnh xem trước
  const [manufactureImage, setManufactureImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState({ id: 0, slug: "" });
  const { data: categories } = useGet<Categories[]>(
    "/categories/getAllCategories"
  );

  useEffect(() => {
    if (manufacture) {
      setValue("name", manufacture.name);
      setValue("categoryId", manufacture.categoryId);

      // Đặt hình ảnh từ manufacture vào manufactureImage
      if (manufacture.img) {
        setManufactureImage(manufacture.img);
      }
      if (manufacture.categoryId) {
        setSelectedCategory({ id: manufacture.categoryId, slug: "" });
      }
    }
    if (error) {
      console.error("Error fetching manufacturer:", error);
    }
  }, [manufacture, error, setValue]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      const imagePreviews = selectedFiles?.map((file) =>
        URL.createObjectURL(file)
      );

      // Lưu file vào state
      setFile(selectedFiles[0]);

      // Lưu ảnh xem trước
      setPreviewImages([...imagePreviews]);
    }
  };

  const onSubmit = (data: FieldValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("categoryId", selectedCategory.id.toString());

    if (file) {
      formData.append("img", file);
    } else {
      console.error("No file selected");
    }

    mutateManufacturer(
      {
        url: `/manufacturer/updateManufacturer/${id}`, // Sử dụng ID từ URL
        data: formData, // Truyền FormData object
      },
      {
        onSuccess: async (response) => {
          if (response.status === 200) {
            queryClient.invalidateQueries({
              queryKey: [
                `/manufacturer/getOneManufacturerById/${manufactureId}`,
              ],
            });

            toast.success("Sản phẩm đã được cập nhật thành công");
            navigate("/manufacturers");
          }
        },
        onError: (error) => {
          console.error("Error updating manufacture:", error);
          toast.error("Có lỗi xảy ra khi cập nhật sản phẩm");
        },
      }
    );
  };

  return (
    <div>
      <div className="min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Sửa nhà sản xuất</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-h-[600px] border rounded-lg p-6 bg-white relative"
        >
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-[13px] text-white font-medium rounded-full w-5 h-5 flex items-center justify-center border border-black bg-[#1B253C]">
              1
            </span>

            <h2 className="text-lg font-semibold">Nhà sản xuất</h2>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Danh mục</label>
              <select
                value={selectedCategory.id || ""}
                onChange={(e) => {
                  const findCategory = categories?.find(
                    (category) => category.id === parseInt(e.target.value)
                  );
                  setSelectedCategory({
                    id: findCategory?.id || 0,
                    slug: findCategory?.slug || "",
                  });
                }}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              >
                <option value="" disabled hidden>
                  Danh mục
                </option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.name && (
                <p className="text-red-500">Danh mục là bắt buộc</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Tên hãng</label>
              <input
                type="text"
                placeholder="tên hãng..."
                {...register("name", { required: true })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md  bg-white"
              />
              {errors.name && (
                <p className="text-red-500">Tên hãng là bắt buộc</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">hình</label>
              <input
                type="file"
                {...register("file")}
                onChange={onFileChange}
                className="w-full px-4 py-2 border focus:outline-none rounded-md  bg-white "
                accept="image/*"
              />
            </div>
          </div>

          {(previewImages?.length > 0 || manufactureImage) && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {previewImages?.length > 0
                ? previewImages?.map((preview, index) => (
                    <div key={index} className="size-2/4">
                      <Image
                        src={preview}
                        alt={`Preview ${index}`}
                        className="object-cover rounded-md"
                      />
                    </div>
                  ))
                : manufactureImage && (
                    <div className="size-2/4">
                      <Image
                        src={manufactureImage}
                        alt="Manufacture Image"
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
            </div>
          )}

          <button className="bg-[#1D2A48] text-white font-semibold py-2 px-7 rounded-lg absolute right-4 my-3">
            Cập nhật
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateManufacture;
