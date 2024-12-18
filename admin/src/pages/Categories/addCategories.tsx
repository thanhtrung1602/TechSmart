import { useForm } from "react-hook-form";
import usePost from "~/hooks/usePost";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import DataCategory from "~/types/dataCategory";
function AddCategories() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataCategory>();
  const { mutate: mutateCategories } = usePost();

  const [file, setFile] = useState<File | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]); // Manage preview images
  const navigate = useNavigate();
  const [form, setForm] = useState({
    visible: false, // Giá trị mặc định của "Ẩn hiện"
  });
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      const imagePreviews = selectedFiles?.map((file) =>
        URL.createObjectURL(file)
      );

      // Store the first selected file in state
      setFile(selectedFiles[0]);

      // Store all selected images for preview
      setPreviewImages([...imagePreviews]);
    }
  };

  const onSubmit = (data: DataCategory) => {
    const formData = new FormData();
    formData.append("name", data.name); // Append the name to FormData
    formData.append("visible", form.visible.toString());
    if (file) {
      formData.append("img", file); // Only append the file if it's not null
    } else {
      console.error("No file selected");
    }
    mutateCategories(
      {
        url: "/categories/createCategories", // The endpoint for your POST request
        data: formData, // The FormData object is passed here
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            queryClient.invalidateQueries({
              queryKey: ["/categories/getAllCategories"],
            });
            // Additional success handling
            toast.success("Sản phẩm đã được thêm thành công");
            navigate("/categories");
          }
        },
        onError: (error) => {
          console.error("Error adding category:", error);
          toast.error("Có lỗi xảy ra khi thêm sản phẩm");
        },
      }
    );
  };

  return (
    <div>
      <div className="min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Thêm danh mục</h1>
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
                <span className="text-sm text-red-500">
                  Vui lòng nhập tên loại
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Hình</label>
              <input
                type="file"
                {...register("file", { required: true })}
                onChange={onFileChange}
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
                multiple // Allow multiple files to be selected
              />
              {errors.file && (
                <span className="text-sm text-red-500">Vui lòng chọn hình</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ẩn hiện</label>
              <select
                value={form.visible ? "Show" : "Hide"}
                onChange={(e) =>
                  setForm({ ...form, visible: e.target.value === "Show" })
                }
                className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              >
                <option value="Show">Hiện</option>
                <option value="Hide">Ẩn</option>
              </select>
            </div>
          </div>

          {/* Display selected image previews */}
          {previewImages?.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {previewImages.map((preview, index) => (
                <div key={index} className="w-full h-32">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="bg-[#1D2A48] text-white font-semibold py-2 px-7 rounded-lg absolute right-4 my-3"
          >
            Thêm
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCategories;
