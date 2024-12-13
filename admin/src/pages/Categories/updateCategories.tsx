import { useForm } from "react-hook-form";
import useGet from "~/hooks/useGet"; // Giả sử bạn có một custom hook dùng cho GET requests
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Để lấy id từ URL
import Categories from "~/models/Categories";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Image from "~/components/Image";
import { usePatch } from "~/hooks/usePost";
interface FormData {
  name: string;
  file: File | null;
}

function UpdateCategories() {
  const { id } = useParams(); // Lấy id dưới dạng chuỗi từ URL
  const categoryId = Number(id);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const { mutate: mutateCategories } = usePatch();

  const [file, setFile] = useState<File | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]); // Quản lý ảnh xem trước
  const [categoryImage, setCategoryImage] = useState<string | null>(null);

  // Fetch category data by ID
  const { data: categories, error } = useGet<Categories>(
    `/categories/getCategoryById/${categoryId}`
  ); // Sử dụng custom hook để fetch dữ liệu

  useEffect(() => {
    if (categories) {
      setValue("name", categories.name);
      if (categories.img) {
        setCategoryImage(categories.img);
      }
    }
    if (error) {
      console.error("Error fetching category:", error);
    }
  }, [categories, error, setValue]);

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

  const onSubmit = (data: FormData) => {
    console.log("Submit Form: ", data);

    const formData = new FormData();
    formData.append("name", data.name); // Append name vào FormData

    if (file) {
      formData.append("img", file); // Chỉ thêm file nếu có
    } else {
      console.log("No new file selected, keeping existing image");
    }

    mutateCategories(
      {
        url: `/categories/updateCategories/${id}`, // Sử dụng ID từ URL
        data: formData, // Truyền FormData object
      },
      {
        onSuccess: async (response) => {
          if (response.status === 200) {
            queryClient.refetchQueries({
              queryKey: ["/categories/getAllCategories"],
            });
            console.log("Category updated successfully", response.data);
            toast.success("Sản phẩm đã được cập nhật thành công");
            window.location.href = "/categories";
          }
        },
        onError: (error) => {
          console.error("Error updating category:", error);
          toast.error("Có lỗi xảy ra khi cập nhật sản phẩm");
        },
      }
    );
  };

  return (
    <div>
      <div className="min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Sửa danh mục</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-h-[600px] border rounded-lg p-6 bg-white relative"
        >
          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Tên Loại</label>
              <input
                type="text"
                placeholder="Tên sản phẩm..."
                {...register("name", { required: true })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              />
              {errors.name && (
                <p className="text-red-500">Tên loại is required</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Hình</label>
              <input
                type="file"
                {...register("file")}
                onChange={onFileChange}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
                accept="image/*"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Ẩn hiện</label>
              <select className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white">
                <option>Ẩn</option>
                <option>Hiện</option>
              </select>
            </div>
          </div>

          {/* Hiển thị ảnh xem trước */}
          {(previewImages?.length > 0 || categoryImage) && (
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
                : categoryImage && (
                  <div className="size-2/4">
                    <Image
                      src={categoryImage}
                      alt="Manufacture Image"
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
            </div>
          )}
          <button
            type="submit"
            className="bg-[#1D2A48] text-white font-semibold py-2 px-7 rounded-lg absolute right-4 my-3"
          >
            Cập nhật
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCategories;
