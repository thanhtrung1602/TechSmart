import { useEffect, useState } from 'react'
import { FaArrowRightFromBracket, FaUserShield } from 'react-icons/fa6'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import MenuTooltip from '~/components/Popper/MenuTooltip'
import { removeAdminProfile } from '~/redux/adminProfileSlice'
import { RootState } from '~/redux/store'

export default function Header() {
	const [isTooltipVisible, setIsTooltipVisible] = useState(false);
	const [scrollShadow, setScrollShadow] = useState(false)
	const adminProfile = useSelector((state: RootState) => state.adminProfile.adminProfile)
	const dispatch = useDispatch();

	const handleLogout = () => {
		dispatch(removeAdminProfile());
	};

	const LIST_ITEMS = [
		{
			icon: <FaUserShield />,
			name: adminProfile ? adminProfile?.fullname : "",
			to: "/profile"
		},
		{
			icon: <FaArrowRightFromBracket />,
			name: "Đăng xuất",
			onClick: () => {
				handleLogout();
			},
		}
	]

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) {
				setScrollShadow(true)
			} else {
				setScrollShadow(false)
			}
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<div className={`sticky top-0 w-full bg-white z-50 h-16 flex justify-end items-center ${scrollShadow ? 'shadow-bottom' : ''}`}>
			<div className="bg-white py-2 sticky top-0 z-50">
				{adminProfile && (
					<MenuTooltip
						items={LIST_ITEMS}
						className="flex flex-col gap-2 bg-white text-sm text-neutral-500 font-semibold rounded shadow p-2"
						onShow={() => setIsTooltipVisible(true)}
						onHide={() => setIsTooltipVisible(false)}
					>
						<div className='flex items-center gap-2 px-8 cursor-pointer'>
							<div className='text-right'>
								<p className='text-base font-semibold'>{adminProfile.fullname}</p>
								<span className='text-sm'>Quản trị viên</span>
							</div>
							<div className='size-10 bg-gray-300 flex items-center justify-center rounded-full'>
								<FaUserShield className='size-6 text-gray-500' />
							</div>
							<div>
								{isTooltipVisible ? <HiChevronUp /> : <HiChevronDown />}
							</div>
						</div>
					</MenuTooltip>
				)}
			</div>
		</div>
	)
}