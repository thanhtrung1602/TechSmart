import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Image from "~/components/Image";
import useGet from "~/hooks/useGet";
import usePost from "~/hooks/usePost";
import Categories from "~/models/Categories";
import DataManufacturer from "~/types/dataManufacturer";

function AddManufacturer() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataManufacturer>();
  const { mutate: mutateManufacturer } = usePost();
  const [file, setFile] = useState<File | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]); // Manage preview images
  const [selectedCategory, setSelectedCategory] = useState({ id: 0, slug: "" });
  const [form, setForm] = useState({
    visible: false, // Giá trị mặc định của "Ẩn hiện"
  });
  console.log("nè", form.visible);
  const { data: categories } = useGet<Categories[]>(
    "/categories/getAllCategories"
  );
  console.log("errors", errors);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      const imagePreviews = selectedFiles?.map((file) =>
        URL.createObjectURL(file)
      );
      setFile(selectedFiles[0]);
      setPreviewImages([...imagePreviews]);
    }
  };

  const onSubmit = (data: DataManufacturer) => {
    console.log("Submit Form: ", data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("categoryId", selectedCategory.id.toString());
    formData.append("visible", form.visible.toString());
    if (file) {
      formData.append("img", file);
    } else {
      console.error("No file selected");
    }

    mutateManufacturer(
      {
        url: "/manufacturer/createManufacturer",
        data: formData,
      },
      {
        onSuccess: (response) => {
          console.log("Manufacturer added successfully", response.data);

          navigate("/manufacturers");

          queryClient.invalidateQueries({
            queryKey: ["/manufacturer/getAllManufacturer"],
          });

          toast.success("Sản phẩm đã được thêm thành công");
          setSelectedCategory({ id: 0, slug: "" });
          window.location.reload();
        },
        onError: (error) => {
          console.error("Error adding Manufacturer:", error);
          toast.error("Có lỗi xảy ra khi thêm sản phẩm");
        },
      }
    );
  };

  return (
    <div>
      <div className="min-h-screen">
        <h1 className="text-2xl  font-bold mb-6">Thêm hãng theo danh mục</h1>

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
                {...register("categoryId", {
                  required: "Vui lòng chọn danh mục",
                })}
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
              {errors.categoryId && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Tên hãng</label>
              <input
                type="text"
                placeholder="tên hãng..."
                {...register("name", { required: "Vui lòng nhập tên hãng" })}
                className="w-full px-4 py-2 border focus:outline-none rounded-md  bg-white"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Ảnh</label>
              <input
                type="file"
                {...register("file", { required: "Vui lòng chọn hình ảnh" })}
                onChange={onFileChange}
                className="w-full px-4 py-2 border focus:outline-none rounded-md  bg-white "
                multiple
              />
              {errors.file && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.file.message}
                </p>
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

          {previewImages?.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {previewImages?.map((preview, index) => (
                <div key={index} className="size-2/4">
                  <Image
                    src={preview}
                    alt={`Preview ${index}`}
                    className="object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}

          <button className="bg-[#1D2A48] text-white font-semibold py-2 px-7 rounded-lg absolute right-4 my-3">
            Thêm
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddManufacturer;
