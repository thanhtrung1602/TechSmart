import ValueAttribute from "~/models/ValueAttribute";

// Hàm để chuyển đổi ROM thành số GB để so sánh
const parseCapacityValue = (rom: string) => {
  // Loại bỏ khoảng trắng thừa và đảm bảo không có khoảng cách giữa số và đơn vị
  rom = rom.trim().replace(/\s+/g, "");
  const size = parseInt(rom); // Lấy giá trị số từ chuỗi ROM (ví dụ "64GB" -> 64)
  if (rom.includes("TB")) {
    return size * 1024; // Chuyển 1TB thành 1024GB
  }
  return size; // Đối với GB, chỉ trả về số nguyên
};

// Hàm lấy các ROM và xác định ROM nhỏ nhất
const getSmallestRom = ({
  attributeValue,
}: {
  attributeValue?: ValueAttribute[] | undefined;
}) => {
  if (attributeValue && attributeValue?.length > 0) {
    // Tìm các ROM có trong sản phẩm (sử dụng ID phù hợp)
    const romsForProduct = attributeValue?.filter(
      (item) => item.attributeData.id === 6 // Giả sử id của ROM là 6
    );
    if (romsForProduct.length > 0) {
      // Sắp xếp các ROM theo giá trị từ nhỏ đến lớn
      const sortedRoms = romsForProduct.sort(
        (a, b) => parseCapacityValue(a.value) - parseCapacityValue(b.value)
      );
      // ROM nhỏ nhất
      return sortedRoms[0];
    }
  }
  return null;
};

export { parseCapacityValue, getSmallestRom };
