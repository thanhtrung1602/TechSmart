import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGet from "~/hooks/useGet";
import usePost, { useDelete, usePatch } from "~/hooks/usePost";
import Categories from "~/models/Categories";
import CategoryAttribute from "~/models/CategoryAttribute";
import Manufacturer from "~/models/Manufacturer";
import Products from "~/models/Products";
import ValueAttribute from "~/models/ValueAttribute";
import Image from "~/components/Image";
import { useQueryClient } from "@tanstack/react-query";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import Loading from "~/layouts/components/Loading";

interface Value {
  id: number | null; // Allow null or number to handle new values
  value: string;
}

interface Attribute {
  attributeId: number;
  values: Value[];
}

interface FormData {
  name: string;
  price: number;
  discount: number;
  stock: number;
  visible: boolean;
  attributes: Attribute[];
}

type ProductImage = {
  id: number;
  productId: number;
  img: string;
};

export default function EditProduct() {
  const { id } = useParams();
  const productId = Number(id);
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    price: 0,
    discount: 0,
    stock: 0,
    visible: false,
    attributes: [],
  });
  const [initialFormData, setInitialFormData] = useState<FormData | null>(null); // Lưu dữ liệu ban đầu của form

  const { mutate } = usePatch();
  const { mutate: createValue } = usePost();
  const { mutate: deleteAttributeValue } = useDelete();
  const { data: product } = useGet<Products>(
    `/products/getOneProductById/${productId}`
  );
  const { data: categories } = useGet<Categories[]>(
    `/categories/getAllCategories/`
  );
  const { data: manufacturers } = useGet<Manufacturer[]>(
    `/manufacturer/findAll`
  );
  const { data: categoryAttribute } = useGet<CategoryAttribute[]>(
    `/categoryAttribute/getCategoryAttributesByCategory/${selectedCategory.id}`
  );
  const { data: attributeValues } = useGet<ValueAttribute[]>(
    `/valueAttribute/getOneValueAttributeById/${product?.id}`
  );
  const { data: images } = useGet<ProductImage[]>(
    `/productimgs/getAllProductImgByProduct/${id}`
  );

  // Thiết lập dữ liệu ban đầu khi product được tải
  useEffect(() => {
    if (product && categoryAttribute && attributeValues) {
      const initialAttributes = categoryAttribute?.map((catAttr) => ({
        attributeId: catAttr.attributeData.id,
        values: attributeValues
          .filter((av) => av.attributeId === catAttr.attributeData.id)
          ?.map((av) => ({ id: av.id, value: av.value })) || [
            { id: 0, value: "" },
          ],
      }));
      //Lưu giá trị ban đầu
      setInitialFormData({
        name: product.name,
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        visible: product.visible,
        attributes: initialAttributes,
      });

      setFormData((prev) => ({
        ...prev,
        name: product.name,
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        visible: product.visible,
        attributes: initialAttributes,
      }));

      setSelectedCategory({ id: product.categoryId, slug: "" });
      setSelectedManufacturer({ id: product.manufacturerId, slug: "" });

      if (product?.img) {
        setProductImages(product.img);
      }
    }
  }, [product, attributeValues, categoryAttribute]);

  // Hàm xử lý khi thay đổi giá trị của thuộc tính
  const handleAttributeChange = (
    attributeId: number,
    index: number,
    value: string
  ) => {
    setFormData((prevFormData) => {
      const updatedAttributes = prevFormData.attributes?.map((attr) => {
        if (attr.attributeId === attributeId) {
          const newValues = [...attr.values];
          newValues[index] = { ...newValues[index], value };
          return { ...attr, values: newValues };
        }
        return attr;
      });
      return { ...prevFormData, attributes: updatedAttributes };
    });
  };

  // Hàm thêm một giá trị mới cho thuộc tính
  const handleAddValue = (attributeId: number) => {
    setFormData((prevFormData) => {
      const updatedAttributes = prevFormData.attributes?.map((attr) => {
        if (attr.attributeId === attributeId) {
          return {
            ...attr,
            values: [...attr.values, { id: null, value: "" }], // Use null instead of undefined for new values
          };
        }
        return attr;
      });
      return { ...prevFormData, attributes: updatedAttributes };
    });
  };

  // Hàm xử lý khi xóa một giá trị của thuộc tính
  const handleRemoveValue = async (attributeId: number, index: number) => {
    const attributeValueId = formData.attributes.find(
      (attr) => attr.attributeId === attributeId
    )?.values[index]?.id;

    // If the attributeValueId is provided, call the function to delete the attribute value
    if (attributeValueId) {
      try {
        await deleteAttributeValue(
          `/valueAttribute/delValueAttribute/${attributeValueId}`,
          {
            onSuccess: () => {
              queryClient.invalidateQueries(); // Invalidate queries to refresh data if necessary
            },
          }
        );
      } catch (error) {
        console.error("Error deleting attribute value:", error);
      }
    }

    // Update the local state to remove the input
    setFormData((prevFormData) => {
      const updatedAttributes = prevFormData.attributes?.map((attr) => {
        if (attr.attributeId === attributeId) {
          const newValues = attr.values.filter((_, i) => i !== index); // Remove the value at the specified index
          return { ...attr, values: newValues };
        }
        return attr;
      });

      return { ...prevFormData, attributes: updatedAttributes };
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = new FormData();

      // Product details
      form.append("categoryId", selectedCategory.id.toString());
      form.append("manufacturerId", selectedManufacturer.id.toString());
      form.append("name", formData.name);
      form.append("price", formData.price.toString());
      form.append("discount", formData.discount.toString());
      form.append("stock", formData.stock.toString());
      form.append("visible", formData.visible.toString());

      if (file) {
        form.append("img", file);
      }

      mutate(
        { url: `/products/updateProduct/${product?.id}`, data: form },
        {
          onSuccess: async (response) => {
            if (response.status === 200) {
              // Clear form data
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
              setSelectedManufacturer({ id: 0, slug: "" });
              queryClient.invalidateQueries({
                queryKey: [`/products/getOneProductById/${product?.id}`],
              });

              //Duyệt mảng mới với mảng cũ đã lưu để check xem nên gọi api nào
              for (const attribute of formData.attributes) {
                // Step 1: Create new values nếu không có id
                await Promise.all(
                  attribute.values?.map((value) => {
                    if (!value.id || value.id === null) {
                      // New value, call create API
                      return createValue(
                        {
                          url: "/valueAttribute/createValueAttribute",
                          data: {
                            productId: product?.id,
                            attributeId: attribute.attributeId,
                            value: value.value,
                          },
                        },
                        {
                          onSuccess: (createResponse) => {
                            console.log(
                              "New value attribute created successfully:",
                              createResponse.data
                            );
                            queryClient.refetchQueries({
                              queryKey: [
                                `/valueAttribute/getOneValueAttributeById/${product?.id}`,
                              ],
                            });
                            toast.success("Thêm giá trị mới thành công");
                            window.location.href = "/products";
                          },
                          onError: (createError) => {
                            console.error(
                              "Error creating new value attribute:",
                              createError
                            );
                          },
                        }
                      );
                    }
                    return null;
                  })
                );

                //Dùng để so sánh giá trị cũ với giá trị mới xem có gì thay đổi không
                const initialAttribute = initialFormData?.attributes.find(
                  (attr) => attr.attributeId === attribute.attributeId
                );

                // Step 2: Update values nếu có thay đổi
                if (initialAttribute) {
                  for (const value of attribute.values) {
                    const initialValue = initialAttribute.values.find(
                      (initValue) => initValue.id === value.id
                    );

                    //Kiểm tra xem giá trị cũ vs giá trị mới có j thay đổi
                    if (initialValue && initialValue.value !== value.value) {
                      return mutate(
                        {
                          url: `/valueAttribute/updateProductValueAttribute/${product?.id}`,
                          data: {
                            id: value.id,
                            attributeId: attribute.attributeId,
                            value: value.value,
                          },
                        },
                        {
                          onSuccess: (updateResponse) => {
                            console.log(
                              "Value attribute updated successfully:",
                              updateResponse
                            );
                            queryClient.refetchQueries({
                              queryKey: [
                                `/valueAttribute/getOneValueAttributeById/${product?.id}`,
                              ],
                            });
                            toast.success("Cập nhật giá trị thành công");
                            window.location.href = "/products";
                          },
                          onError: (updateError) => {
                            console.error(
                              "Error updating value attribute:",
                              updateError
                            );
                          },
                        }
                      );
                    }
                  }
                }
              }

              toast.success("Cập nhật sản phẩm thành công");
              window.location.href = "/products";
            }
          },
          onError: (error) => {
            console.error("Error updating product:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImage = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen">
      {isLoading && <Loading />}
      <h1 className="text-3xl font-bold mb-4">Cập nhật sản phẩm</h1>

      <form
        onSubmit={handleSubmit}
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
              placeholder="Tên sản phẩm..."
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
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

          {/* Giá */}
          <div>
            <label className="block text-sm font-medium mb-1">Giá</label>
            <input
              type="text"
              placeholder="Giá..."
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
            />
          </div>

          {/* Giá giảm */}
          <div>
            <label className="block text-sm font-medium mb-1">Giá giảm</label>
            <input
              type="text"
              placeholder="Giá giảm..."
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: Number(e.target.value) })
              }
            />
          </div>

          {/* Số lượng */}
          <div>
            <label className="block text-sm font-medium mb-1">Số lượng</label>
            <input
              type="text"
              placeholder="Số lượng"
              className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: Number(e.target.value) })
              }
            />
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium mb-1">Danh mục</label>
            <select
              value={selectedCategory.id || ""}
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
          </div>

          {/* Nhà sản xuất */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nhà sản xuất
            </label>
            <select
              value={selectedManufacturer.id || ""}
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

        <div className="grid grid-cols-4 gap-4">
          {/* Thuộc tính sản phẩm */}
          {categoryAttribute &&
            categoryAttribute?.length > 0 &&
            categoryAttribute?.map((categoryAttr) => {
              const attributeValue = formData.attributes.find(
                (attr) => attr.attributeId === categoryAttr.attributeId
              );
              return (
                <div key={categoryAttr.id}>
                  <div className="flex items-center gap-x-2 mb-1">
                    <label className="block text-sm font-medium">
                      {categoryAttr.attributeData.name}
                    </label>
                    <button
                      type="button"
                      className="text-blue-500"
                      onClick={() =>
                        handleAddValue(categoryAttr.attributeData.id)
                      }
                    >
                      <FiPlusCircle />
                    </button>
                  </div>
                  {/* Display all values for each attribute */}
                  {(attributeValue && attributeValue?.values?.length > 0
                    ? attributeValue.values
                    : [""]
                  )?.map((value, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2 relative"
                    >
                      {/* Kiểm tra nếu attributeId là 4 hoặc 29 */}
                      {categoryAttr.attributeId === 4 ||
                        categoryAttr.attributeId === 29 ? (
                        <>
                          {/* Input chọn màu */}
                          <input
                            type="color"
                            className="size-8 p-[0.1rem] cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300"
                            value={
                              typeof value === "string" ? value : value.value
                            }
                            onChange={(e) =>
                              handleAttributeChange(
                                categoryAttr.attributeData.id,
                                index,
                                e.target.value
                              )
                            }
                          />
                          {/* Input nhập mã màu */}
                          <input
                            type="text"
                            className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
                            placeholder="#000000"
                            value={
                              typeof value === "string" ? value : value.value
                            } // Hiển thị mã màu
                            onChange={(e) => {
                              const newValue = e.target.value;
                              // Cập nhật state ngay lập tức nếu mã hex hợp lệ
                              if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
                                handleAttributeChange(
                                  categoryAttr.attributeData.id,
                                  index,
                                  newValue
                                );
                              }
                              // Cập nhật giá trị hiển thị tạm thời dù mã chưa hợp lệ
                              handleAttributeChange(
                                categoryAttr.attributeData.id,
                                index,
                                newValue
                              );
                            }}
                          />
                        </>
                      ) : (
                        <input
                          type="text"
                          placeholder={`Giá trị ${categoryAttr.attributeData.name.toLowerCase()}...`}
                          className="w-full px-4 py-2 border focus:outline-none rounded-md bg-white"
                          value={
                            typeof value === "string" ? value : value.value
                          } // Trích xuất giá trị đúng từ value
                          onChange={(e) =>
                            handleAttributeChange(
                              categoryAttr.attributeData.id,
                              index,
                              e.target.value
                            )
                          }
                        />
                      )}
                      {attributeValue &&
                        attributeValue?.values?.length > 1 &&
                        index > 0 && (
                          <button
                            type="button"
                            className="text-red-500 absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() =>
                              handleRemoveValue(
                                categoryAttr.attributeData.id,
                                index
                              )
                            } // Pass the ID of the attribute value
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
            Cập nhật sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
}
