import { useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePatch } from "~/hooks/usePost";
import { setUserProfile } from "~/redux/userProfileSlice";
import toast from "react-hot-toast";
import { RootState } from "~/redux/store";
import { useNavigate } from "react-router-dom";

function Account() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const users = useSelector(
    (state: RootState) => state.userProfile.userProfile
  );

  const [fullname, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { mutate } = usePatch();
  const dispatch = useDispatch();

  useEffect(() => {
    if (users) {
      setFullName(users.fullname || "");
      setPhone(String(users.phone) || "");
      setEmail(users.email || "");
    }
    if (!users) {
      navigate("/login");
    }
  }, [users, navigate]);

  const handleUpdateProfile = (e: FormEvent) => {
    e.preventDefault();
    const data = {
      fullname,
      phone,
      email,
    };
    mutate(
      { url: `/users/updateUser/${users?.id}`, data },
      {
        onSuccess: (res) => {
          if (res.status === 200) {
            console.log(res);
            toast.success("Cập nhật thông tin thành công");
            queryClient.invalidateQueries({
              queryKey: [`/users/getOneUserById/${users?.id}`],
            });
            dispatch(setUserProfile(res.data));
          }
        },
        onError: (error) => {
          console.log(error);
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <section className="mb-10 md:px-10 xl:px-40">
      <h2 className="font-bold text-lg md:text-xl lg:text-2xl text-center">
        Thông tin cá nhân
      </h2>
      <form
        onSubmit={handleUpdateProfile}
        className="mt-4 max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto"
      >
        <div className="mb-4 flex flex-col">
          <label
            htmlFor="name"
            className="text-sm sm:text-base font-medium text-black"
          >
            Họ và tên
          </label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập tên của bạn"
            required
            className="mt-2 px-4 py-2 w-full rounded-md outline-none bg-white border border-gray-400 hover:border-black focus:border-black"
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label
            htmlFor="phone"
            className="text-sm sm:text-base font-medium text-black"
          >
            Số điện thoại
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại của bạn"
            required
            className="mt-2 px-4 py-2 w-full rounded-md outline-none bg-white border border-gray-400 hover:border-black focus:border-black"
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label
            htmlFor="email"
            className="text-sm sm:text-base font-medium text-black"
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            required
            className="mt-2 px-4 py-2 w-full rounded-md outline-none bg-white border border-gray-400 hover:border-black focus:border-black"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 text-sm sm:text-base text-white rounded-md mt-4 bg-[#eb3e32] hover:bg-[#c7342b] duration-200"
        >
          Cập nhật thông tin
        </button>
      </form>
    </section>
  );
}

export default Account;
