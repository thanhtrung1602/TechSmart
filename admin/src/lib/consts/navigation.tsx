import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineClipboardList,
	HiOutlineUsers,
	HiOutlineChartBar,
	HiOutlineAnnotation,
	HiOutlineChatAlt2,
	HiOutlineArchive,
	HiOutlineCollection,
	HiOutlineUserAdd,
	HiOutlineTruck 
} from 'react-icons/hi'
import { RiAdminLine } from "react-icons/ri";
import { MdOutlineStore } from 'react-icons/md'

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Bảng điều khiển',
		path: '/',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'products',
		label: 'Sản phẩm',
		path: '/products',
		icon: <HiOutlineCube />
	},
	{
		key: 'categories',
		label: 'Danh mục',
		path: '/categories',
		icon: <HiOutlineArchive />
	},
	{
		key: 'maneufacturers',
		label: 'Nhà sản xuất',
		path: '/manufacturers',
		icon: <HiOutlineCollection />
	},
	{
		key: 'delivery',
		label: 'Vận chuyển',
		path: '/delivery',
		icon: <HiOutlineTruck />
	},
	{
		key: 'orders',
		label: 'Đơn hàng',
		path: '/orders',
		icon: <HiOutlineClipboardList />
	},
	{
		key: 'users',
		label: 'Khách hàng',
		path: '/users',
		icon: <HiOutlineUsers />
	},
	{
		key: 'comments',
		label: 'Bình luận',
		path: '/comments',
		icon: <HiOutlineChatAlt2 />
	},
	{
		key: 'store',
		label: 'Cửa hàng',
		path: '/store',
		icon: <MdOutlineStore />
	},
	{
		key: 'messages',
		label: 'Tin nhắn',
		path: '/contact',
		icon: <HiOutlineAnnotation />
	},
	{
		key: 'statistical',
		label: 'Thống kê',
		path: '/statistical',
		icon: <HiOutlineChartBar />
	}
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'staff',
		label: 'Quản lý nhân viên',
		path: '/staff',
		icon: <RiAdminLine />
	},
	{
		key: 'register',
		label: 'Đăng ký quản trị viên',
		path: '/register',
		icon: <HiOutlineUserAdd />
	}
]