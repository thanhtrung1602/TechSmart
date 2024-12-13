import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import usePost from "~/hooks/usePost";
import { AppDispatch, RootState } from "~/redux/store";
import { removeUserProfile } from "~/redux/userProfileSlice";

function ChangePassword() {
  const dispatch = useDispatch<AppDispatch>();

  const userProfile = useSelector(
    (state: RootState) => state.userProfile.userProfile
  );
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { mutate } = usePost();

  const handleLogout = () => {
    dispatch(removeUserProfile());
  };

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();

    if (!userProfile) {
      toast.error("Thông tin người dùng không tồn tại.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    const data = {
      phone: userProfile.phone,
      oldPassword,
      newPassword,
    };

    console.log(data);

    mutate(
      { url: "/auth/changePass", data },
      {
        onSuccess: (res) => {
          if (res.data?.message === "Đổi mật khẩu thành công") {
            toast.success("Đổi mật khẩu thành công");
            handleLogout();
          } else {
            toast.error(
              res.data?.error || "Mật khẩu cũ không đúng hoặc có lỗi xảy ra"
            );
          }
        },
        onError: (error) => {
          console.log(error);
          toast.error("Mật khẩu cũ không đúng hoặc có lỗi xảy ra");
        },
      }
    );
  };

  return (
    <div className="mb-10 md:px-10 xl:px-40">
      <h2 className="font-bold text-lg md:text-xl lg:text-2xl text-center">
        Đổi mật khẩu
      </h2>
      <form
        onSubmit={handleChangePassword}
        className="mt-4 max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto"
      >
        <div className="mb-4 flex flex-col">
          <label className="text-sm sm:text-base font-medium text-black">
            Mật khẩu cũ
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Nhập mật khẩu cũ"
            required
            className="mt-2 px-4 py-2 text-sm sm:text-base w-full rounded-md outline-none bg-white border border-gray-400 hover:border-black focus:border-black"
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label className="text-sm sm:text-base font-medium text-black">
            Mật khẩu mới
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            required
            className="mt-2 px-4 py-2 text-sm sm:text-base w-full rounded-md outline-none bg-white border border-gray-400 hover:border-black focus:border-black"
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label className="text-sm sm:text-base font-medium text-black">
            Nhập lại mật khẩu mới
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Xác nhận mật khẩu mới"
            required
            className="mt-2 px-4 py-2 text-sm sm:text-base w-full rounded-md outline-none bg-white border border-gray-400 hover:border-black focus:border-black"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-1 text-sm sm:text-base text-white rounded-md mt-2 bg-[#eb3e32] hover:bg-[#c7342b] duration-200"
        >
          Lưu
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
