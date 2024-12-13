type DataStaff = {
    fullName: string;
    date_of_birth: string; // Dạng ISO string, có thể thay đổi thành Date nếu dùng đối tượng Date
    gender: "Nam" | "Nữ" | "Khác"; // Tùy chỉnh các giá trị hợp lệ
    phone: string;
    position: string;
    hire_date: string; // Tương tự date_of_birth
    email: string;
    salary: number; // Lương có thể là số thập phân
};

export default DataStaff