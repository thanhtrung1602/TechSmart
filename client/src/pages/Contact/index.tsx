import { LuPhone } from "react-icons/lu";
import { IoStorefrontOutline } from "react-icons/io5";
import { MdMailOutline } from "react-icons/md";
import usePost from "~/hooks/usePost";
import usePatch from "~/hooks/usePost";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ContactData from "~/types/dataContact";
function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactData>();
  const { mutate: contact } = usePatch();
  const onSubmit = (data: ContactData) => {
    console.log(data);
    contact(
      { url: "/contact/createConTact", data },
      {
        onSuccess: () => {
          toast.success("Đã gửi tin nhắn thành công!", {
            duration: 5000,
          });

          setTimeout(() => {
            window.location.reload();
          }, 1500);
        },
        onError: (err) => {
          console.error("Error creating contact", err);
          toast.error("Gửi tin nhắn thất bại. Vui lòng thử lại!");
        },
      }
    );
  };

  return (

    <div className="container mx-auto pt-2 md:pt-7 px-4 md:px-10 xl:px-40">
      <div className="text-center text-neutral-900 text-2xl sm:text-3xl md:text-4xl font-medium mt-8 sm:mt-12">
        Liên hệ với chúng tôi
      </div>
      <div className="mt-12 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg text-center">
          <div className="flex justify-center mb-4">
            <IoStorefrontOutline className="text-2xl text-neutral-900" />
          </div>
          <div className="text-zinc-500 text-base font-bold uppercase">
            Địa chỉ
          </div>
          <p className="text-neutral-900 text-base font-semibold mt-2">
            Nguyễn Kiệm, Hồ Chí Minh, Việt Nam
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg text-center">
          <div className="flex justify-center mb-4">
            <LuPhone className="text-2xl text-neutral-900" />
          </div>
          <div className="text-zinc-500 text-base font-bold uppercase">
            Liên hệ với chúng tôi
          </div>
          <p className="text-neutral-900 text-base font-semibold mt-2">
            +84 234 567 890
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg text-center">
          <div className="flex justify-center mb-4">
            <MdMailOutline className="text-2xl text-neutral-900" />
          </div>
          <div className="text-zinc-500 text-base font-bold uppercase">
            Email
          </div>
          <p className="text-neutral-900 text-base font-semibold mt-2">
            teachsmart.hcm564
            @gmail.com
          </p>
        </div>
      </div>
      {/* Contact Form and Map Section */}
      <div className="container mt-12 grid md:grid-cols-2 gap-8">
        <form
          className=" container  bg-white rounded p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <label
              className="block text-zinc-500 text-xs font-bold uppercase mb-2"
              htmlFor="name"
            >
              Họ và tên
            </label>
            <input
              id="fullName"
              {...register("fullName", {
                required: "Vui lòng nhập họ và tên",
              })}
              className="w-full px-4 py-2 border border-black rounded-md bg-white text-neutral-900 outline-none"
              type="text"
              placeholder="Họ và tên"
            />
            {errors.fullName &&
              typeof errors.fullName.message === "string" && ( //thông báo lỗi (và nó là một chuỗi), thì lỗi sẽ được hiển thị.
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
          </div>
          <div className="mb-4">
            <label
              className="block text-zinc-500 text-xs font-bold uppercase mb-2"
              htmlFor="email"
            >
              Địa chỉ email
            </label>
            <input
              id="email"
              {...register("email", {
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Địa chỉ email không hợp lệ",
                },
              })}
              className="w-full px-4 py-2 border border-black rounded-md bg-white text-neutral-900 outline-none"
              type="email"
              placeholder="Email của bạn"
            />
            {errors.email && typeof errors.email.message === "string" && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-zinc-500 text-xs font-bold uppercase mb-2"
              htmlFor="phone"
            >
              Số điện thoại
            </label>
            <input
              id="phone"
              {...register("phone", {
                required: "Vui lòng nhập số điện thoại",
                pattern: {
                  value: /^[0-9]{10,11}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              })}
              className="w-full px-4 py-2 border border-black rounded-md bg-white text-neutral-900 outline-none"
              type="text"
              placeholder="Số điện thoại của bạn"
            />
            {errors.phone && typeof errors.phone.message === "string" && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-zinc-500 text-xs font-bold uppercase mb-2"
              htmlFor="text"
            >
              Lời nhắn
            </label>
            <textarea
              id="text"
              {...register("text", { required: "vui lòng nhập tin nhắn" })}
              className="w-full px-4 py-2 border border-black rounded-md bg-white text-neutral-900 outline-none"
              placeholder="Tin nhắn của bạn"
            />
            {errors.text && typeof errors.text.message === "string" && (
              <p className="text-red-500 text-sm">{errors.text.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-100 px-6 py-2 text-white font-medium bg-[#eb3e32] hover:bg-red-600 duration-300 rounded-lg "
          >
            Gửi tin nhắn
          </button>
        </form>
        <div className="bg-white rounded-lg">
          <div className="w-full h-96 relative rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d350.10803113739496!2d106.6784827019941!3d10.813305694182233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752977b9263d95%3A0xeb5f3a1ff14fbe42!2zUXXDoW4gY2jDom4gZ8OgIG7GsOG7m25nIE5ndXnhu4VuIEtp4buHbQ!5e1!3m2!1svi!2s!4v1732417555713!5m2!1svi!2s"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;