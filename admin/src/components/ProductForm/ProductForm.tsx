import React, { FormEvent, useEffect, useState } from "react";
import Categories from "~/models/Categories";
import Manufacturer from "/models/Manufacturer";
import useGet from "~/hooks/useGet";
import Modal from "~/components/Modal/Modal";
import { FaCheck } from "react-icons/fa6";
import usePost from "~/hooks/usePost";
import CategoryAttribute from "~/models/CategoryAttribute";
import Image from "../Image";
import { FiMinusCircle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface AttributeValueData {
  attributeId: number;
  value: string;
}

interface VariantData {
  stock: number;
  price: number;
  attributeValues: AttributeValueData[];
}

interface FormData {
  name: string;
  discount: number;
  visible: boolean;
  variants: VariantData[];
  attributeValues: AttributeValueData[]; // For non-variant attributes
}

export default function ProductForm() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: categories } = useGet<Categories[]>(
    "/categories/getAllCategories/"
  );
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    slug: string;
  }>({ id: 0, slug: "" });
  const [selectedManufacturer, setSelectedManufacturer] = useState(0);
  const { data: manufacturers } = useGet<Manufacturer[]>(
    `/manufacturer/getManufacturerByCategory/${selectedCategory.slug}`,
    {
      enabled: !!selectedCategory.slug,
    }
  );
  const { data: categoryAttributes } = useGet<CategoryAttribute[]>(
    `/categoryAttribute/getCategoryAttributesByCategory/${selectedCategory.id}`,
    {
      enabled: !!selectedCategory.id,
    }
  );

  const { mutate: createProduct } = usePost();
  const { mutateAsync: createVariant } = usePost();
  const { mutate: createAttributeValue } = usePost();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormEvent>();
  const [file, setFile] = useState<File | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    discount: 0,
    visible: false,
    variants: [
      {
        stock: 0,
        price: 0,
        attributeValues: [], // Initialize as empty array
      },
    ],
    attributeValues: [], // Initialize as empty array
  });

  useEffect(() => {
    if (categoryAttributes) {
      // Initialize attributeValues for non-variant attributes
      setFormData((prevFormData) => ({
        ...prevFormData,
        attributeValues: categoryAttributes
          ?.filter((attr) => ![4, 29, 6].includes(attr.attributeData.id))
          ?.map((attr) => ({
            attributeId: attr.attributeData.id,
            value: "",
          })),
      }));
    }
  }, [categoryAttributes]);

  const handleVariantChange = (
    variantIndex: number,
    field: "stock" | "price",
    value: string
  ) => {
    // Kiểm tra nếu giá trị nhập vào là một số hợp lệ và không dưới 0
    const parsedValue = Number(value);

    if (!isNaN(parsedValue) && parsedValue >= 0) {
      // Nếu giá trị hợp lệ, cập nhật giá trị
      setFormData((prevFormData) => {
        const newVariants = [...prevFormData.variants];
        newVariants[variantIndex][field] = parsedValue;
        return { ...prevFormData, variants: newVariants };
      });
    } else {
      // Nếu không hợp lệ (không phải số hoặc dưới 0), giữ nguyên giá trị cũ hoặc đặt giá trị về 0
      setFormData((prevFormData) => {
        const newVariants = [...prevFormData.variants];
        newVariants[variantIndex][field] = 0; // Đặt về 0 nếu không hợp lệ
        return { ...prevFormData, variants: newVariants };
      });
    }
  };

  // Handle attribute value changes for variants
  const handleAttributeValueChange = (
    variantIndex: number,
    attributeId: number,
    value: string
  ) => {
    setFormData((prevFormData) => {
      const newVariants = [...prevFormData.variants];
      const newVariant = { ...newVariants[variantIndex] };

      const existingAttributeIndex = newVariant.attributeValues?.findIndex(
        (attrValue) => attrValue.attributeId === attributeId
      );

      if (existingAttributeIndex !== -1) {
        // Update existing attribute value
        newVariant.attributeValues[existingAttributeIndex].value = value;
      } else {
        // Add new attribute value
        newVariant.attributeValues.push({ attributeId, value });
      }

      newVariants[variantIndex] = newVariant;

      return { ...prevFormData, variants: newVariants };
    });
  };

  // Handle attribute value changes for non-variant attributes
  const handleNonVariantAttributeChange = (
    attributeId: number,
    value: string
  ) => {
    setFormData((prevFormData) => {
<<<<<<< HEAD
      const newAttributeValues = prevFormData.attributeValues.map((attrValue) =>
        attrValue.attributeId === attributeId
          ? { ...attrValue, value }
          : attrValue
=======
      const newAttributeValues = prevFormData.attributeValues?.map((attrValue) =>
        attrValue.attributeId === attributeId ? { ...attrValue, value } : attrValue
>>>>>>> thinh
      );
      return { ...prevFormData, attributeValues: newAttributeValues };
    });
  };

  const handleAddVariant = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      variants: [
        ...prevFormData.variants,
        {
          stock: 0,
          price: 0,
          attributeValues: [], // Initialize as empty for new variants
        },
      ],
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      variants: prevFormData.variants?.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      const imagePreviews = selectedFiles?.map((file) =>
        URL.createObjectURL(file)
      );
      setFile(selectedFiles[0]);
      setPreviewImages(imagePreviews);
    }
  };

  const onSubmit = () => {
    try {
      const productFormData = new FormData();
      productFormData.append("categoryId", selectedCategory.id.toString());
      productFormData.append("manufacturerId", selectedManufacturer.toString());
      productFormData.append("name", formData.name);
      productFormData.append("discount", formData.discount.toString());
      productFormData.append("visible", formData.visible.toString());
      if (file) {
        productFormData.append("img", file);
      }

      // Tạo product trước
      createProduct(
        { url: "/products/createProduct", data: productFormData },
        {
          onSuccess: async (productResponse) => {
            if (productResponse.status === 200) {
              const productId = productResponse.data.id;
              if (!productId) return;

              const allAttributes = [
                ...formData.attributeValues,
                ...formData.variants.flatMap(
                  (variant) => variant.attributeValues
                ),
              ];

              // Tách attributeValues thành 2 nhóm: cần tạo variant và không cần
<<<<<<< HEAD
              // const variantAttributes = allAttributes.filter(
              //   (attrValue) =>
              //     (attrValue.attributeId === 4 ||
              //       attrValue.attributeId === 29 ||
              //       attrValue.attributeId === 6) &&
              //     attrValue.value.trim() !== ""
              // );
              const nonVariantAttributes = allAttributes.filter(
                (attrValue) =>
                  attrValue.attributeId !== 4 &&
                  attrValue.attributeId !== 29 &&
                  attrValue.attributeId !== 6 &&
                  attrValue.value.trim() !== ""
=======
              const variantAttributes = allAttributes?.filter(
                (attrValue) => (attrValue.attributeId === 4 || attrValue.attributeId === 29 || attrValue.attributeId === 6) && attrValue.value.trim() !== ""
              );
              const nonVariantAttributes = allAttributes?.filter(
                (attrValue) => (attrValue.attributeId !== 4 && attrValue.attributeId !== 29 && attrValue.attributeId !== 6) && attrValue.value.trim() !== ""
>>>>>>> thinh
              );

              // Xử lý các attributeValue không cần tạo variant
              const nonVariantAttributePromises = nonVariantAttributes?.map(
                (attrValue) => {
                  const attributeValueFormData = {
                    attributeId: attrValue.attributeId,
                    productId: productId,
                    variantId: null,
                    value: attrValue.value.trim(),
                  };

                  return createAttributeValue(
                    {
                      url: `/valueAttribute/createValueAttribute`,
                      data: attributeValueFormData,
                    },
                    {
                      onError: (error) => {
                        console.error(
                          "Error creating attribute value not variant:",
                          error
                        );
                      },
                    }
                  );
                }
              );

              // Xử lý các variants và attributeValue cần tạo variant
<<<<<<< HEAD
              const variantPromises = formData.variants.map(
                async (variantData) => {
                  const variantFormData = {
                    productId: productId,
                    stock: variantData.stock,
                    price: variantData.price,
                  };

                  try {
                    // Đợi tạo variant
                    const variantResponse = await createVariant({
                      url: "/variants/createVariant",
                      data: variantFormData,
=======
              const variantPromises = formData.variants?.map(async (variantData) => {
                const variantFormData = {
                  productId: productId,
                  stock: variantData.stock,
                  price: variantData.price,
                };

                console.log("Variant form data:", variantFormData);

                try {
                  // Đợi tạo variant
                  const variantResponse = await createVariant({
                    url: "/variants/createVariant",
                    data: variantFormData,
                  });

                  console.log("Variant response:", variantResponse);
                  if (variantResponse.status === 200) {
                    console.log("Variant created successfully", variantResponse.data);

                    const variantId = variantResponse.data.id;
                    if (!variantId) return;

                    console.log("Variant ID:", variantId);

                    // Lọc các attributeValues cho variant này (color, ROM)
                    const attributeValuePromises = variantData.attributeValues?.map((attrValue) => {
                      const attributeValueFormData = {
                        attributeId: attrValue.attributeId,
                        variantId: variantId,  // Gán variantId cho attribute value này
                        productId: productId,
                        value: attrValue.value.trim(), // Lấy giá trị từ attribute
                      };
                      console.log("Attribute value form data:", attributeValueFormData);
                      // Tạo attribute value cho variant
                      return createAttributeValue({
                        url: `/valueAttribute/createValueAttribute`,
                        data: attributeValueFormData,
                      });
>>>>>>> thinh
                    });

                    if (variantResponse.status === 200) {
                      const variantId = variantResponse.data.id;
                      if (!variantId) return;

                      // Lọc các attributeValues cho variant này (color, ROM)
                      const attributeValuePromises =
                        variantData.attributeValues.map((attrValue) => {
                          const attributeValueFormData = {
                            attributeId: attrValue.attributeId,
                            variantId: variantId, // Gán variantId cho attribute value này
                            productId: productId,
                            value: attrValue.value.trim(), // Lấy giá trị từ attribute
                          };
                          // Tạo attribute value cho variant
                          return createAttributeValue({
                            url: `/valueAttribute/createValueAttribute`,
                            data: attributeValueFormData,
                          });
                        });

                      // Đợi tất cả các attributeValues được tạo cho variant
                      if (attributeValuePromises.length > 0) {
                        await Promise.all(attributeValuePromises);
                        queryClient.invalidateQueries({
                          queryKey: ["/products/getAllProducts"],
                        });
                        navigate("/products");
                      }
                    }
                  } catch (error) {
                    console.error(
                      "Error during variant creation or attribute value creation:",
                      error
                    );
                  }
                }
              );

              // Chờ tất cả các promise hoàn tất
              await Promise.all([nonVariantAttributePromises, variantPromises]);

              // Reset form và các xử lý khác
              setFormData({
                name: "",
                discount: 0,
                visible: false,
                variants: [
                  {
                    stock: 0,
                    price: 0,
                    attributeValues:
                      categoryAttributes?.map((attr) => ({
                        attributeId: attr.attributeData.id,
                        value: "",
                      })) || [],
                  },
                ],
                attributeValues: [], // reset attributeValues
              });
              setFile(null);
              setPreviewImages([]);
              setSelectedCategory({ id: 0, slug: "" });
              setSelectedManufacturer(0);
            }
          },
          onError: (error) => {
            console.error("Error creating product:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Thêm sản phẩm</h1>
      {/* ... (rest of the form code) ... */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4 flex items-center space-x-2">
          <span className="font-bold text-lg bg-[#1B253C] text-white rounded-full px-3 py-1 inline-flex items-center justify-center">
            1
          </span>
          <span className="text-xl font-bold">Thông tin sản phẩm</span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
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
              value={formData.name || ""}
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
            <label className="block text-sm font-medium mb-1">Hình ảnh</label>
            <input
              type="file"
              accept="image/*"
              multiple
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
          </div>

          {/* Giá giảm */}
          <div>
            <label className="block text-sm font-medium mb-1">Giá giảm</label>
            <input
              type="text"
              placeholder="Giá giảm..."
              {...register("discount", { valueAsNumber: true })}
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              value={formData.discount || 0}
              onChange={(e) => {
                // Lấy giá trị nhập vào và kiểm tra nếu nó là số hợp lệ
                const value = e.target.value;
                const parsedValue = Number(value);

                // Kiểm tra nếu giá trị là một số và không dưới 0
                if (!isNaN(parsedValue) && parsedValue >= 0) {
                  setFormData({ ...formData, discount: parsedValue });
                } else {
                  // Nếu không phải số hoặc dưới 0, giữ nguyên giá trị cũ
                  setFormData({ ...formData, discount: 0 });
                }
              }}
            />
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
                const category = categories?.find(
                  (cat) => cat.id === parseInt(e.target.value)
                );
                setSelectedCategory({
                  id: category?.id || 0,
                  slug: category?.slug || "",
                });
              }}
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
            >
              <option value="" disabled hidden>
                Chọn danh mục
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
              disabled={!selectedCategory.id}
            >
              <option value="" disabled hidden>
                Chọn hãng
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
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              value={formData.visible ? "true" : "false"}
              onChange={(e) =>
                setFormData({ ...formData, visible: e.target.value === "true" })
              }
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
            >
              <option value="true">Hiện</option>
              <option value="false">Ẩn</option>
            </select>
          </div>
        </div>

        <div className="pt-6 mb-4 flex items-center space-x-2">
          <span className="font-bold text-lg bg-[#1B253C] text-white rounded-full px-3 py-1 inline-flex items-center justify-center">
            2
          </span>
          <span className="text-xl font-bold">Thông tin sản phẩm</span>
        </div>
        {/* Non-variant attributes */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Thuộc tính chung</h3>
          <div className="grid grid-cols-3 gap-4">
            {categoryAttributes
              ?.filter((attr) => ![4, 29, 6].includes(attr.attributeData.id))
              ?.map((catAttr) => (
                <div key={catAttr.attributeData.id}>
                  <label className="block text-sm font-medium mb-1">
                    {catAttr.attributeData.name}
                  </label>
                  <input
                    type="text"
                    placeholder={`Nhập ${catAttr.attributeData.name.toLowerCase()}...`}
                    className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
                    value={
                      formData.attributeValues?.find(
                        (av) => av.attributeId === catAttr.attributeData.id
                      )?.value || ""
                    }
                    onChange={(e) =>
                      handleNonVariantAttributeChange(
                        catAttr.attributeData.id,
                        e.target.value
                      )
                    }
                  />
                </div>
              ))}
          </div>
        </div>
        {/* Variant attributes */}
        {formData.variants?.map((variant, variantIndex) => (
          <div key={variantIndex} className="border rounded-md p-4 my-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Biến thể {variantIndex + 1}
              </h3>
              {formData.variants.length > 1 && (
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => handleRemoveVariant(variantIndex)}
                >
                  <FiMinusCircle />
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Giá</label>
                <input
                  type="text"
                  placeholder="Giá..."
                  className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
                  value={variant.price}
                  onChange={(e) =>
                    handleVariantChange(variantIndex, "price", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Số lượng
                </label>
                <input
                  type="text"
                  placeholder="Số lượng..."
                  className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
                  value={variant.stock}
                  onChange={(e) =>
                    handleVariantChange(variantIndex, "stock", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {categoryAttributes
                ?.filter((attr) => [4, 29, 6].includes(attr.attributeData.id))
                ?.map((catAttr) => (
                  <div key={catAttr.attributeData.id}>
                    <label className="block text-sm font-medium mb-1">
                      {catAttr.attributeData.name}
                    </label>
                    <input
                      type="text"
                      placeholder={`Nhập ${catAttr.attributeData.name.toLowerCase()}...`}
                      className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
                      value={
                        variant.attributeValues?.find(
                          (av) => av.attributeId === catAttr.attributeData.id
                        )?.value || ""
                      }
                      onChange={(e) =>
                        handleAttributeValueChange(
                          variantIndex,
                          catAttr.attributeData.id,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}

        <div className="mt-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={handleAddVariant}
          >
            Thêm biến thể
          </button>
        </div>

        <div className="mt-6">
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
