import React, { FormEvent, useEffect, useState } from "react";
import Categories from "~/models/Categories";
import Manufacturer from "~/models/Manufacturer";
import useGet from "~/hooks/useGet";
import Modal from "~/components/Modal/Modal";
import { FaCheck } from "react-icons/fa6";
import usePost from "~/hooks/usePost";
import CategoryAttribute from "~/models/CategoryAttribute";
import Image from "../Image";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface Attribute {
  attributeId: number; // The ID of the attribute
  values: string[]; // The corresponding value for this attribute
}

interface FormData {
  name: string;
  price: number;
  discount: number;
  stock: number;
  visible: boolean;
  attributes: Attribute[];
}

export default function ProductForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { mutate: addProduct } = usePost();
  const { mutate: addAttributeValue } = usePost();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormEvent>();
  const [file, setFile] = useState<File | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]); // Manage preview images
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: 0,
    discount: 0,
    stock: 0,
    visible: false,
    attributes: [],
  });
  const { data: categories } = useGet<Categories[]>(
    `/categories/getAllCategories/`
  );
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    slug: string;
  }>({ id: 0, slug: "" });
  const [selectedManufacturer, setSelectedManufacturer] = useState<number>(0); // Updated type>;
  const { data: manufacturers } = useGet<Manufacturer[]>(
    `/manufacturer/getManufacturerByCategory/${selectedCategory.slug}`,
    {
      enabled: false,
    }
  );
  const { data: categoryAttribute } = useGet<CategoryAttribute[]>(
    `/categoryAttribute/getCategoryAttributesByCategory/${selectedCategory.id}`
  );
  useEffect(() => {
    if (categoryAttribute) {
      // Initialize attributes with one empty value each
      const newAttributes = categoryAttribute?.map((attr) => ({
        attributeId: attr.attributeData.id,
        values: [""], // Each attribute starts with one empty input
      }));

      setFormData((prevFormData) => ({
        ...prevFormData,
        attributes: newAttributes,
      }));

      console.log("New attributes:", newAttributes);
    }
  }, [categoryAttribute]);

  const handleAttributeChange = (
    attributeId: number,
    index: number,
    newValue: string
  ) => {
    setFormData((prevFormData) => {
      const createdAttributes = prevFormData.attributes?.map((attr) => {
        if (attr.attributeId === attributeId) {
          const createdValues = [...attr.values];
          createdValues[index] = newValue; // Update the specific input value
          return { ...attr, values: createdValues };
        }
        return attr;
      });

      return { ...prevFormData, attributes: createdAttributes };
    });
  };

  const handleAddValue = (attributeId: number) => {
    setFormData((prevFormData) => {
      const createdAttributes = prevFormData.attributes?.map((attr) => {
        if (attr.attributeId === attributeId) {
          return { ...attr, values: [...attr.values, ""] }; // Add a new empty value input
        }
        return attr;
      });

      return { ...prevFormData, attributes: createdAttributes };
    });
  };

  const handleRemoveValue = (attributeId: number, index: number) => {
    setFormData((prevFormData) => {
      const createdAttributes = prevFormData.attributes?.map((attr) => {
        if (attr.attributeId === attributeId) {
          const createdValues = attr.values.filter((_, i) => i !== index); // Remove the value at the specified index
          return { ...attr, values: createdValues };
        }
        return attr;
      });

      return { ...prevFormData, attributes: createdAttributes };
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    if (file) {
      const selectedFiles = Array.from(file);
      const imagePreviews = selectedFiles?.map((file) =>
        URL.createObjectURL(file)
      );

      // Store the first selected file in state
      setFile(selectedFiles[0]);

      // Store all selected images for preview
      setPreviewImages([...imagePreviews]);
    }
  };

  const OnSubmit = async () => {
    try {
      const form = new FormData();

      form.append("categoryId", selectedCategory.id.toString());
      form.append("manufacturerId", selectedManufacturer.toString());
      form.append("name", formData.name);
      form.append("price", formData.price.toString());
      form.append("discount", formData.discount.toString());
      form.append("stock", formData.stock.toString());
      form.append("visible", formData.visible.valueOf().toString());

      if (file) {
        form.append("img", file);
      }

      console.log(form);
      addProduct(
        { url: "/products/createProduct", data: form },
        {
          onSuccess: async (response) => {
            if (response.status === 200) {
              setFormData({
                name: "",
                price: 0,
                discount: 0,
                stock: 0,
                visible: false,
                attributes: [],
              });

              setFile(null);

              setSelectedCategory({ id: 0, slug: "" });
              setSelectedManufacturer(0);
              // Add attribute values
              const attributePromises = formData.attributes?.map(
                (attribute) => {
                  return Promise.all(
                    attribute.values?.map((value) => {
                      return addAttributeValue(
                        {
                          url: `/valueAttribute/createValueAttribute`,
                          data: {
                            productId: response.data.id,
                            attributeId: attribute.attributeId,
                            value,
                          },
                        },
                        {
                          onSuccess: (response) => {
                            console.log("Response:", response);
                            queryClient.invalidateQueries({
                              queryKey: ["/products/getAllProducts"],
                            });
                            navigate("/products");
                          },
                          onError: (error) => {
                            console.error(
                              "Error creating attribute value:",
                              error
                            );
                          },
                        }
                      );
                    })
                  );
                }
              );

              try {
                await Promise.all(attributePromises);
                setOpen(true);
                setFormData({
                  name: "",
                  price: 0,
                  discount: 0,
                  stock: 0,
                  visible: false,
                  // image: null as File | string | null,
                  attributes: [{ attributeId: 0, values: [] }],
                });
              } catch (error) {
                console.error("Error creating attribute values:", error);
              }
            }
          },
          onError: (error) => {
            console.error("Error creating product:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error creating product server:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Thêm sản phẩm</h1>

      <form
        onSubmit={handleSubmit(OnSubmit)}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4 flex items-center space-x-2">
          <span className="font-bold text-lg bg-[#1B253C] text-white rounded-full px-3 py-1 inline-flex items-center justify-center">
            1
          </span>
          <span className="text-xl font-bold">Sản phẩm</span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* Tên sản phẩm */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên sản phẩm
            </label>
            <input
              type="text"
              {...register("name", { required: "Vui lòng nhập tên sản phẩm." })}
              placeholder="Tên sản phẩm..."
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Hình ảnh */}
          <div className="relative group">
            <label className="block text-sm font-medium mb-1">Hình</label>
            <input
              type="file"
              {...register("file", { required: "Vui lòng chọn hình ảnh" })}
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
            />
            {previewImages?.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {previewImages?.map((preview, index) => (
                  <div key={index} className="w-full h-32">
                    <Image
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
            {errors.file && (
              <p className="mt-2 text-sm text-red-500">{errors.file.message}</p>
            )}
          </div>

          {/* Giá */}
          <div>
            <label className="block text-sm font-medium mb-1">Giá</label>
            <input
              type="text"
              {...register("price", { required: "Vui lòng nhập giá" })}
              placeholder="price."
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
            />
            {errors.price && (
              <p className="mt-2 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Giá giảm */}
          <div>
            <label className="block text-sm font-medium mb-1">Giá giảm</label>
            <input
              type="text"
              placeholder="Giá giảm..."
              {...register("discount", { required: "Vui lòng nhập giá giảm" })}
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: Number(e.target.value) })
              }
            />
            {errors.discount && (
              <p className="mt-2 text-sm text-red-500">
                {errors.discount.message}
              </p>
            )}
          </div>

          {/* Số lượng */}
          <div>
            <label className="block text-sm font-medium mb-1">Số lượng</label>
            <input
              type="text"
              placeholder="Số lượng"
              {...register("stock", { required: "Vui lòng nhập số lượng" })}
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: Number(e.target.value) })
              }
            />
            {errors.stock && (
              <p className="mt-2 text-sm text-red-500">
                {errors.stock.message}
              </p>
            )}
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium mb-1">Danh mục</label>
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

          {/* Nhà sản xuất */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nhà sản xuất
            </label>
            <select
              value={selectedManufacturer || ""}
              {...register("manufacturerId", {
                required: "Vui lòng chọn hãng",
              })}
              onChange={(e) => setSelectedManufacturer(Number(e.target.value))}
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              disabled={!selectedCategory.id} // Disable if no category is selected
            >
              <option value="" disabled hidden>
                Hãng
              </option>
              {manufacturers?.map((manufacturer) => (
                <option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </option>
              ))}
            </select>
            {errors.manufacturerId && (
              <p className="mt-2 text-sm text-red-500">
                {errors.manufacturerId.message}
              </p>
            )}
          </div>

          {/* Ẩn hiện */}
          <div>
            <label className="block text-sm font-medium mb-1">Ẩn hiện</label>
            <select
              value={formData.visible ? "Show" : "Hide"}
              onChange={(e) =>
                setFormData({ ...formData, visible: e.target.value === "Show" })
              }
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
            >
              <option value="Show">Hiện</option>
              <option value="Hide">Ẩn</option>
            </select>
          </div>
        </div>

        <div className="pt-6 mb-4 flex items-center space-x-2">
          <span className="font-bold text-lg bg-[#1B253C] text-white rounded-full px-3 py-1 inline-flex items-center justify-center">
            2
          </span>
          <span className="text-xl font-bold">Thuộc tính sản phẩm</span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* Thuộc tính sản phẩm */}
          {categoryAttribute &&
            categoryAttribute?.length > 0 &&
            categoryAttribute?.map((categoryAttr) => {
              const attributeValue = formData.attributes.find(
                (attr) => attr.attributeId === categoryAttr.attributeData.id
              );

              return (
                <div key={categoryAttr.id}>
                  <div className="flex items-center gap-x-2 mb-1">
                    <label className="block text-sm font-medium">
                      {categoryAttr.attributeData.name}
                    </label>
                    <button
                      type="button"
                      className=""
                      onClick={() =>
                        handleAddValue(categoryAttr.attributeData.id)
                      }
                    >
                      <FiPlusCircle />
                    </button>
                  </div>
                  {attributeValue &&
                    attributeValue.values?.map((value, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <input
                          type="text"
                          placeholder={`Giá trị ${categoryAttr.attributeData.name.toLowerCase()}...`}
                          className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
                          value={value}
                          onChange={(e) =>
                            handleAttributeChange(
                              categoryAttr.attributeData.id,
                              index,
                              e.target.value
                            )
                          }
                        />
                        {/* Show minus button only if there is more than one value */}
                        {index > 0 && (
                          <button
                            type="button"
                            className="text-red-500"
                            onClick={() =>
                              handleRemoveValue(
                                categoryAttr.attributeData.id,
                                index
                              )
                            }
                          >
                            <FiMinusCircle />
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              );
            })}
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-[#1B253C] text-white rounded-lg hover:bg-[#1b253cee]"
          >
            Thêm sản phẩm
          </button>
          <Modal open={open} onClose={() => setOpen(false)}>
            <div className="text-center w-56">
              <FaCheck className="mx-auto w-10 h-10 p-2 bg-green-400 text-white text-lg rounded-full" />
              <p className="text-center text-lg font-black">Thành công</p>
            </div>
          </Modal>
        </div>
      </form>
    </div>
  );
}
