import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGet from "~/hooks/useGet";
import usePost, { usePatch } from "~/hooks/usePost";
import Categories from "~/models/Categories";
import CategoryAttribute from "~/models/CategoryAttribute";
import Manufacturer from "~/models/Manufacturer";
import Products from "~/models/Products";
import ValueAttribute from "~/models/ValueAttribute";
import Variants from "~/models/Variants";
import Image from "~/components/Image";
import { useForm } from "react-hook-form";
// import { useQueryClient } from "@tanstack/react-query";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
// import toast from "react-hot-toast";

interface AttributeValueData {
  productId: number;
  attributeId: number;
  value: string;
}

interface VariantData {
  productId: number;
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

type ProductImage = {
  id: number;
  productId: number;
  img: string;
};

export default function EditProduct() {
  const { id } = useParams();
  const productId = Number(id);
  // const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    slug: string;
  }>({ id: 0, slug: "" });
  const [selectedManufacturer, setSelectedManufacturer] = useState<{
    id: number;
    slug: string;
  }>({ id: 0, slug: "" });

  const [file, setFile] = useState<File | string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<string | null>(null);
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
  const [initialFormData, setInitialFormData] = useState<FormData | null>(null); // Lưu dữ liệu ban đầu của form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormEvent>();
  const { mutate } = usePatch();
  const { mutate: create } = usePost();
  // const { mutate: deleteAttributeValue } = useDelete();
  const { data: product } = useGet<Products>(
    `/products/getOneProductById/${productId}`
  );
  const { data: categories } = useGet<Categories[]>(
    `/categories/getAllCategories/`
  );
  const { data: manufacturers } = useGet<Manufacturer[]>(
    `/manufacturer/findAll`
  );
  const { data: categoryAttributes } = useGet<CategoryAttribute[]>(
    `/categoryAttribute/getCategoryAttributesByCategory/${selectedCategory.id}`
  );

  const { data: variants } = useGet<Variants[]>(`/variants/getAllVariantByProductId/${product?.id}`);

  const { data: attributeValues } = useGet<ValueAttribute[]>(
    `/valueAttribute/getOneValueAttributeById/${product?.id}`
  );
  const { data: images } = useGet<ProductImage[]>(
    `/productimgs/getAllProductImgByProduct/${id}`
  );

  // Thiết lập dữ liệu ban đầu khi product được tải
  useEffect(() => {
    if (product && categoryAttributes && attributeValues && variants) {
      const initialAttributes = categoryAttributes?.map((catAttr) => ({
        attributeId: catAttr.attributeData.id,
        value: attributeValues?.find((attr) => attr.attributeId === catAttr.attributeData.id)?.value || "",
      })) || [];

      console.log("attributeValues:", attributeValues); // Kiểm tra toàn bộ dữ liệu attributeValues
      console.log("variants:", variants); // Kiểm tra toàn bộ dữ liệu variants

      console.log("Variant Attr: ", variants.map((variant) =>
        attributeValues?.filter((attr) => attr.variantId === variant.id) || [])
      );

      const initialVariants = variants?.map((variant) => ({
        stock: variant.stock,
        price: variant.price,
        attributeValues: attributeValues
          ?.filter((attr) => attr.variantId === variant.id && [4, 29, 6].includes(attr.attributeId))
          .map((va) => ({
            attributeId: va.attributeId,
            productId: va.productId,
            variantId: va.variatnId,
            value: va.value,
          })) || [],
      })) || [];

      console.log("initialVariants", initialVariants);

      //Lưu giá trị ban đầu
      setInitialFormData({
        name: product.name,
        discount: product.discount,
        visible: product.visible,
        variants: initialVariants,
        attributeValues: initialAttributes,
      });

      setFormData((prev) => ({
        ...prev,
        name: product.name,
        discount: product.discount,
        visible: product.visible,
        variants: initialVariants,
        attributeValues: initialAttributes,
      }));

      setSelectedCategory({ id: product.categoryId, slug: "" });
      setSelectedManufacturer({ id: product.manufacturerId, slug: "" });

      if (product?.img) {
        setProductImages(product.img);
      }
    }
  }, [product, attributeValues, categoryAttributes, variants]);

  // Hàm xử lý khi thay đổi giá trị của thuộc tính
  // const handleAttributeChange = (
  //   attributeId: number,
  //   value: string
  // ) => {
  //   setFormData((prevFormData) => {
  //     const updatedAttributes = prevFormData.attributeValues.map((attr) => {
  //       if (attr.attributeId === attributeId) {
  //         return { ...attr, values: value };
  //       }
  //       return attr;
  //     });
  //     return { ...prevFormData, attributeValues: updatedAttributes };
  //   });
  // };


  const handleVariantChange = (variantIndex: number, field: "stock" | "price", value: string) => {
    setFormData((prevFormData) => {
      const newVariants = [...prevFormData.variants];
      newVariants[variantIndex][field] = Number(value);
      return { ...prevFormData, variants: newVariants };
    });
  };

  // Hàm thêm một giá trị mới cho thuộc tính
  const handleAttributeValueChange = (variantIndex: number, attributeId: number, value: string) => {
    setFormData((prevFormData) => {
      const newVariants = [...prevFormData.variants];
      const newVariant = { ...newVariants[variantIndex] };

      const existingAttributeIndex = newVariant.attributeValues.findIndex(
        (attrValue) => attrValue.attributeId === attributeId
      );

      if (existingAttributeIndex !== -1) {
        newVariant.attributeValues[existingAttributeIndex].value = value;
      } else {
        newVariant.attributeValues.push({ attributeId, value });
      }

      newVariants[variantIndex] = newVariant;

      return { ...prevFormData, variants: newVariants };
    });
  };

  // Hàm xử lý khi xóa một giá trị của thuộc tính

  const handleAddVariant = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      variants: [
        ...prevFormData.variants,
        {
          stock: 0,
          price: 0,
          attributeValues: [],
        },
      ],
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      variants: prevFormData.variants.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    if (file) {
      const selectedFiles = Array.from(file);
      const imagePreviews = selectedFiles.map((file) => URL.createObjectURL(file));

      setFile(selectedFiles[0]);
      setPreviewImages(imagePreviews);
    }
  };

  const onSubmit = () => {
    try {
      const form = new FormData();

      // Product details
      form.append("categoryId", selectedCategory.id.toString());
      form.append("manufacturerId", selectedManufacturer.id.toString());
      form.append("name", formData.name);
      form.append("discount", formData.discount.toString());
      form.append("visible", formData.visible.toString());

      if (file) {
        form.append("img", file);
      }

      mutate(
        { url: `/products/updateProduct/${product?.id}`, data: form },
        {
          onSuccess: async (response) => {
            if (response.status === 200) {
              console.log("Product updated successfully:", response.data);

              const allAttributes = [
                ...formData.attributeValues,
                ...formData.variants.flatMap((variant) => variant.attributeValues),
              ];

              const variantAttributes = allAttributes.filter(
                (attrValue) => [4, 29, 6].includes(attrValue.attributeId) && attrValue.value.trim() !== ""
              );
              const nonVariantAttributes = allAttributes.filter(
                (attrValue) => ![4, 29, 6].includes(attrValue.attributeId) && attrValue.value.trim() !== ""
              );

              // Create or update non-variant attributes
              const nonVariantAttributePromises = nonVariantAttributes.map(async (attrValue) => {
                const initialAttrValue = initialFormData?.attributeValues.find(
                  (initialAttr) => initialAttr.attributeId === attrValue.attributeId
                );

                if (initialAttrValue && initialAttrValue.value !== attrValue.value) {
                  // Update existing attribute value
                  await mutate(
                    { url: `/valueAttribute/updateProductValueAttribute/${initialAttrValue.productId}`, data: { value: attrValue.value } },
                    {
                      onSuccess: (updateResponse) => {
                        console.log("Attribute value updated successfully:", updateResponse.data);
                      },
                      onError: (updateError) => {
                        console.error("Error updating attribute value:", updateError);
                      },
                    }
                  );
                } else if (!initialAttrValue) {
                  // Create new attribute value
                  await create(
                    {
                      url: "/valueAttribute/createValueAttribute",
                      data: {
                        attributeId: attrValue.attributeId,
                        productId: product?.id,
                        value: attrValue.value,
                      },
                    },
                    {
                      onSuccess: (createResponse) => {
                        console.log("Attribute value created successfully:", createResponse.data);
                      },
                      onError: (createError) => {
                        console.error("Error creating attribute value:", createError);
                      },
                    }
                  );
                }
              });

              // Create or update variant attributes
              const variantAttributePromises = variantAttributes.map(async (attrValue) => {
                const initialAttrValue = initialFormData?.attributeValues.find(
                  (initialAttr) => initialAttr.attributeId === attrValue.attributeId
                );

                if (initialAttrValue && initialAttrValue.value !== attrValue.value) {
                  // Update existing attribute value
                  await mutate(
                    { url: `/valueAttribute/updateValueAttribute/${initialAttrValue.productId}`, data: { value: attrValue.value } },
                    {
                      onSuccess: (updateResponse) => {
                        console.log("Attribute value updated successfully:", updateResponse.data);
                      },
                      onError: (updateError) => {
                        console.error("Error updating attribute value:", updateError);
                      },
                    }
                  );
                } else if (!initialAttrValue) {
                  // Create new attribute value
                  await create(
                    {
                      url: "/valueAttribute/createValueAttribute",
                      data: {
                        attributeId: attrValue.attributeId,
                        productId: product?.id,
                        value: attrValue.value,
                      },
                    },
                    {
                      onSuccess: (createResponse) => {
                        console.log("Attribute value created successfully:", createResponse.data);
                      },
                      onError: (createError) => {
                        console.error("Error creating attribute value:", createError);
                      },
                    }
                  );
                }
              });

              await Promise.all([...nonVariantAttributePromises, ...variantAttributePromises]);

              // Handle variants (assuming you have a way to update or create them)
              for (const variant of formData.variants) {
                const variantFormData = {
                  productId: product?.id,
                  stock: variant.stock,
                  price: variant.price,
                };
                // Append other necessary variant details

                const existingVariant = initialFormData?.variants.find(
                  (initialVariant) =>
                    initialVariant.attributeValues.every((initialAttr) =>
                      variant.attributeValues.some(
                        (attr) => attr.attributeId === initialAttr.attributeId && attr.value === initialAttr.value
                      )
                    ) && variant.attributeValues.length === initialVariant.attributeValues.length
                );

                if (existingVariant) {
                  await mutate(
                    { url: `/productVariant/updateProductVariant/${existingVariant.id}`, data: variantFormData },
                    {
                      onSuccess: (updateResponse) => {
                        console.log("Product variant updated successfully:", updateResponse.data);
                      },
                      onError: (updateError) => {
                        console.error("Error updating product variant:", updateError);
                      },
                    }
                  );
                } else {
                  await create(
                    { url: "/productVariant/createProductVariant", data: variantFormData },
                    {
                      onSuccess: (createResponse) => {
                        console.log("Product variant created successfully:", createResponse.data);
                      },
                      onError: (createError) => {
                        console.error("Error creating product variant:", createError);
                      },
                    }
                  );
                }
              }
            }
          },
          onError: (error) => {
            console.error("Error updating product:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const handleImage = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Cập nhật sản phẩm</h1>

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
            <label className="block text-sm font-medium mb-1">Hình</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
            />
            {(previewImages?.length > 0 || productImages) && (
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
                  : productImages && (
                    <div className="size-2/4">
                      <Image
                        src={productImages}
                        alt="Manufacture Image"
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Giá giảm */}
          <div>
            <label className="block text-sm font-medium mb-1">Giá giảm</label>
            <input
              type="number"
              placeholder="Giá giảm..."
              {...register("discount", { valueAsNumber: true })}
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              value={formData.discount || 0}
              onChange={(e) =>
                setFormData({ ...formData, discount: Number(e.target.value) })
              }
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
                const selectedId = parseInt(e.target.value);
                const findCategory = categories?.find(
                  (category) => category.id === selectedId
                );
                console.log("Selected category:", findCategory);
                setSelectedCategory({
                  id: findCategory?.id || 0,
                  slug: findCategory?.slug || "",
                });

                // Reset selectedManufacturer khi danh mục thay đổi
                setSelectedManufacturer({ id: 0, slug: "" });
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
              value={selectedManufacturer.id || ""}
              {...register("manufacturerId", {
                required: "Vui lòng chọn hãng",
              })}
              onChange={(e) => {
                const findManufacturer = manufacturers?.find(
                  (manufacturer) => manufacturer.id === parseInt(e.target.value)
                );
                setSelectedManufacturer({
                  id: findManufacturer?.id || 0,
                  slug: findManufacturer?.slug || "",
                });
              }}
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              disabled={!selectedCategory.id} // Disable if no category is selected
            >
              <option value="" disabled hidden>
                Hãng
              </option>
              {manufacturers
                ?.filter(
                  (manufacturer) =>
                    manufacturer.categoryId === selectedCategory.id
                ) // Lọc theo danh mục
                ?.map((manufacturer) => (
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

          {/* Ảnh con */}
          <div className="w-max">
            <div className="flex items-center gap-x-2 mb-1">
              <label className="block text-sm font-medium mb-1">Ảnh con</label>
              <button
                type="button"
                className="text-blue-500"
                onClick={() => {
                  handleImage();
                }}
              >
                <FiPlusCircle />
              </button>
            </div>
            <input
              ref={inputRef}
              type="file"
              multiple
              name="images"
              className="hidden"
            />
            <div className="grid grid-cols-5 gap-4">
              {images && images?.length > 0 ? (
                images?.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image.img}
                      alt={`Image ${index}`}
                      className="w-20 h-20 object-cover mix-blend-darken"
                      loading="lazy"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Chưa có hình ảnh</p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 mb-4 flex items-center space-x-2">
          <span className="font-bold text-lg bg-[#1B253C] text-white rounded-full px-3 py-1 inline-flex items-center justify-center">
            2
          </span>
          <span className="text-xl font-bold">Thuộc tính sản phẩm</span>
        </div>

        {/* Non-variant attributes */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Thuộc tính chung</h3>
          <div className="grid grid-cols-3 gap-4">
            {categoryAttributes
              ?.filter((attr) => ![4, 29, 6].includes(attr.attributeData.id))
              .map((catAttr) => (
                <div key={catAttr.attributeData.id}>
                  <label className="block text-sm font-medium mb-1">
                    {catAttr.attributeData.name}
                  </label>
                  <input
                    type="text"
                    placeholder={`Nhập ${catAttr.attributeData.name.toLowerCase()}...`}
                    className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
                    value={
                      formData.attributeValues.find(
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
        {formData.variants.map((variant, variantIndex) => (
          <div key={variantIndex} className="border rounded-md p-4 my-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Biến thể {variantIndex + 1}</h3>
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
                  type="number"
                  placeholder="Giá..."
                  className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
                  value={variant.price}
                  onChange={(e) =>
                    handleVariantChange(variantIndex, "price", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số lượng</label>
                <input
                  type="number"
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
                ?.filter((attr) => [4, 29, 6].includes(attr.attributeId))
                .map((catAttr) => (
                  <div key={catAttr.id}>
                    <label className="block text-sm font-medium mb-1">
                      {catAttr.attributeData.name}
                    </label>
                    <input
                      type="text"
                      placeholder={`Nhập ${catAttr.attributeData.name.toLowerCase()}...`}
                      className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
                      value={
                        variant.attributeValues.find(
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

        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-[#1B253C] text-white rounded-lg hover:bg-[#1b253cee]"
          >
            Cập nhật sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
}
