import { useEffect, useState } from "react";
import Banner from "~/layouts/components/Banner";
import Nav from "~/layouts/components/Nav";
// import bannerProductPopular from "~/assets/images/bannerProductPopular.png";
import SwiperItem from "~/components/Swiper";
import Products from "~/models/Products";
import Variants from "~/models/Variants";
import useGet from "~/hooks/useGet";
import GetProducts from "~/features/getProducts";
// import Image from "~/components/Image";
import useBlog from "~/hooks/useBlog";
// import { Link } from "react-router-dom";
import Blog from "~/models/blog";
import BlogChildren from "~/components/Blog/BlogComponent/BigBlog/BigBlog";
import Button from "~/components/Button";
import { FaCircleArrowUp } from "react-icons/fa6";

function Home() {
  const [isVisible, setIsVisible] = useState(false);

  const { data: blogs } = useBlog<Blog[] | undefined>(`/posts`);
  const { data: products } = useGet<Products[]>("/products/findAll");
  const { data: variantProducts } = useGet<Variants[]>("/variants/getAllVariant");
  // const { data: products1 } = useGet<{ total: number; rows: Products[] }>(
  //   "/products/getAllProducts?page=1&size=20"
  // );
  // const { data: products2 } = useGet<{ total: number; rows: Products[] }>(
  //   "/products/getAllProducts?page=2&size=20"
  // );
  // const { data: computerProducts } = useGet<{ rows: Products[] }>(
  //   "products/getProductAllCategory/man-hinh"
  // );

  // const { data: earphoneProducts } = useGet<{ rows: Products[] }>(
  //   "products/getProductAllCategory/tai-nghe"
  // );

  // const { data: lapProducts } = useGet<{ rows: Products[] }>(
  //   "products/getProductAllCategory/laptop"
  // );

  console.log("Variant Products", variantProducts);

  console.log("Products", products);

  // Kiểm tra xem mỗi sản phẩm có variant tương ứng hay không
  const productsWithVariants = products?.filter((product) => {
    // Kiểm tra nếu có ít nhất một variant tương ứng với productId của sản phẩm
    return variantProducts?.some((variant) => variant.productId === product.id);
  });

  console.log("Products with variants:", productsWithVariants);

  // const productsVariant1 = products1?.row?.filter((product) => {
  //   const variant = variantProducts?.find((variant) => variant.productId === product.id);
  //   return variant;
  // });
  // const productsVariant2 = products2?.rows?.filter((product) => {
  //   const variant = variantProducts?.find((variant) => variant.productId === product.id);
  //   return variant;
  // });


  // const hotProductsPage1 = products?.filter((product) => {
  //   const variant = variantProducts?.find((variant) => variant.productId === product.id && variant.hot > 50);
  //   return variant;
  // });
  // const hotProductsPage1 = products?.filter((product) => {
  //   const variant = variantProducts?.find((variant) => variant.productId === product.id && variant.hot > 50);
  //   return variant;
  // });

  useEffect(() => {
    const handleShow = () => {
      if (window.scrollY > 0) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

    }
    window.addEventListener("scroll", handleShow);
    return () => {
      window.removeEventListener("scroll", handleShow);
    };
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Banner */}
      <Banner />
      {/* Menu */}
      <Nav />
      {/* Sản phẩm hot */}
      <section className="px-4 my-3 md:px-10 xl:px-40 md:py-2">
        <div className="flex flex-col w-full">
          <div className="mb-2 text-left border-b-2 border-[#eb3e32] flex items-center justify-between ">
            <h2 className="text-base md:text-xl bg-[#eb3e32] text-white rounded-t-md py-2 px-3 inline-block">
              Sản phẩm hot
            </h2>
          </div>

          <div className="flex gap-x-2 overflow-hidden">
            <div className="size-full rounded-lg overflow-hidden">
              <GetProducts
                products={productsWithVariants ?? []}
                variants={variantProducts ?? []}
                breakpoints={{
                  320: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 5 },
                }}
                spaceBetween={10}
                pagination={true}
                navigation={true}
                className="relative group pb-2"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Sản phẩm phổ biến */}
      {/* <section className="container mx-auto px-4 my-3 md:px-10 xl:px-40 md:py-2">
        <div className="flex flex-col w-full">
          <div className="mb-2 text-left border-b-2 border-[#eb3e32] flex items-center justify-between ">
            <h2 className="text-base md:text-xl bg-[#eb3e32] text-white rounded-t-md py-2 px-3 inline-block">
              Sản phẩm phổ biến
            </h2>
          </div>
          <div className="flex items-center gap-x-2 overflow-hidden">
            <div className="w-full lg:w-3/5 md:h-full">
              <GetProducts
                products={productsVariant1 ?? []}
                breakpoints={{
                  320: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 3 },
                }}
                spaceBetween={10}
                pagination={true}
                navigation={true}
                className="relative group py-2"
              />
              <GetProducts
                products={productsVariant2 ?? []}
                breakpoints={{
                  320: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 3 },
                }}
                spaceBetween={10}
                pagination={true}
                navigation={true}
                className="relative group pb-2"
              />
            </div>
            <div className="hidden lg:flex md:w-2/5">
              <Image
                src={bannerProductPopular}
                alt=""
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section> */}
      {/* Laptop */}
      {/* <section className="container mx-auto px-4 my-3 md:px-10 xl:px-40 md:py-2">
        <div className="flex flex-col w-full">
          <div className="mb-2 text-left border-b-2 border-[#eb3e32] flex items-center justify-between ">
            <h2 className="text-base md:text-xl bg-[#eb3e32] text-white rounded-t-md py-2 px-3 inline-block">
              Laptop
            </h2>
            <div className="hidden md:flex space-x-3 ml-4 ">
              <Link
                to={`/laptop`}
                className="text-sm font-semibold text-black px-2 py-1 hover:bg-gray-100 hover:text-[#eb3e32]"
              >
                Laptop
              </Link>
              <Link
                to={`/laptop/asus`}
                className="text-sm font-semibold text-black px-2 py-1 hover:bg-gray-100 hover:text-[#eb3e32]"
              >
                Laptop Asus
              </Link>
              <Link
                to={`/laptop/acer`}
                className="text-sm font-semibold text-black px-2 py-1 hover:bg-gray-100 hover:text-[#eb3e32]"
              >
                Laptop Acer
              </Link>
              <Link
                to={`/laptop/dell`}
                className="text-sm font-semibold text-black px-2 py-1 hover:bg-gray-100 hover:text-[#eb3e32]"
              >
                Laptop Dell
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-x-2 overflow-hidden">
            <div className="hidden lg:flex md:w-2/5">
              <Image
                src="https://images.samsung.com/is/image/samsung/p6pim/vn/feature/165214116/vn-feature-odyssey-oled-g6-g60sd-541132081?$FB_TYPE_I_JPG$"
                alt=""
                className="object-cover"
              />
            </div>
            <div className="w-full lg:w-[75%] md:h-full">
              <GetProducts
                products={lapProducts?.rows ?? []}
                breakpoints={{
                  320: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                }}
                spaceBetween={10}
                pagination={true}
                navigation={true}
                className="relative group pb-2"
              />
            </div>
          </div>
        </div>
      </section> */}
      {/* Màn hình */}
      {/* <section className="px-4 my-3 md:px-10 xl:px-40 md:py-2">
        <div className="flex flex-col w-full">
          <div className="mb-2 text-left border-b-2 border-[#eb3e32] flex items-center justify-between ">
            <h2 className="text-base md:text-xl bg-[#eb3e32] text-white rounded-t-md py-2 px-3 inline-block">
              Màn hình
            </h2>
            <div className="hidden md:flex space-x-3 ml-4 ">
              <Link
                to={`/man-hinh`}
                className="text-sm font-semibold text-black px-2 py-1 hover:bg-gray-100 hover:text-[#eb3e32]"
              >
                Màn hình
              </Link>
              <Link
                to={`/man-hinh/asus`}
                className="text-sm font-semibold text-black px-2 py-1 hover:bg-gray-100 hover:text-[#eb3e32]"
              >
                Màn hình Asus
              </Link>
              <Link
                to={`/man-hinh/apple`}
                className="text-sm font-semibold text-black px-2 py-1 hover:bg-gray-100 hover:text-[#eb3e32]"
              >
                Màn hình Apple
              </Link>
              <Link
                to={`/man-hinh/samsung`}
                className="text-sm font-semibold text-black px-2 py-1 hover:bg-gray-100 hover:text-[#eb3e32]"
              >
                Màn hình Samsung
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-x-2 overflow-hidden">
            <div className="hidden lg:flex md:w-2/5">
              <Image
                src="https://vmart.exdomain.net/image/cache/catalog/vmart/banner/banner_tab_1_1-280x374.png"
                alt=""
                className="size-full object-cover"
              />
            </div>
            <div className="w-full lg:w-[75%] h-full">
              <GetProducts
                products={computerProducts?.rows ?? []}
                breakpoints={{
                  320: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                }}
                spaceBetween={10}
                pagination={true}
                navigation={true}
                className="relative group pb-2"
              />
            </div>
          </div>
        </div>
      </section> */}
      {/* Tai nghe */}
      {/* <section className="px-4 my-3 md:px-10 xl:px-40 md:py-2">
        <div className="flex flex-col  w-full">
          <div className="mb-2 text-left border-b-2 border-[#eb3e32] flex items-center justify-between ">
            <h2 className="text-base md:text-xl bg-[#eb3e32] text-white rounded-t-md py-2 px-3 inline-block">
              Tai nghe
            </h2>
            <div className="hidden md:flex space-x-3 ml-4 ">
              <Link
                to={`/tai-nghe`}
                className="text-sm font-semibold text-black px-2 py-1 hover:bg-gray-100 hover:text-[#eb3e32]"
              >
                Tai nghe
              </Link>
              <Link
                to={`/tai-nghe/samsung`}
                className="text-sm font-semibold text-black px-2 py-1 hover:bg-gray-100 hover:text-[#eb3e32]"
              >
                Tai nghe Samsung
              </Link>
              <Link
                to={`/tai-nghe/xiaomi`}
                className="text-sm font-semibold text-black px-2 py-1 hover:bg-gray-100 hover:text-[#eb3e32]"
              >
                Tai nghe Xiaomi
              </Link>
              <Link
                to={`/tai-nghe/asus`}
                className="text-sm font-semibold text-black px-2 py-1 hover:bg-gray-100 hover:text-[#eb3e32]"
              >
                Tai nghe Asus
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-x-2 overflow-hidden">
            <div className="hidden lg:flex md:w-2/5">
              <Image
                src="https://img.websosanh.vn/v2/users/review/images/0tco0bxa6mhz4.jpg?compress=85"
                alt=""
                className="object-cover h-96 w-full"
              />
            </div>
            <div className="w-full lg:w-[75%]">
              <GetProducts
                products={earphoneProducts?.rows ?? []}
                breakpoints={{
                  320: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                }}
                spaceBetween={10}
                pagination={true}
                navigation={true}
                className="relative group pb-2"
              />
            </div>
          </div>
        </div>
      </section> */}
      {/* Blog */}
      <section className="px-4 md:px-10 xl:px-40 py-4 lg:py-10">
        <div className="flex flex-col w-full">
          <div className="mb-2 text-left border-b-2 border-[#eb3e32] flex items-center justify-between">
            <h2 className="text-base md:text-xl bg-[#eb3e32] text-white rounded-t-md py-2 px-3 inline-block">
              Blog
            </h2>
          </div>
          <div className="flex items-center gap-x-1 rounded overflow-hidden">
            <SwiperItem
              items={blogs}
              className="relative group"
              breakpoints={{
                // Mobile
                320: {
                  slidesPerView: 1,
                },
                // Tablet
                768: {
                  slidesPerView: 3,
                },
                // Laptop
                1024: {
                  slidesPerView: 5,
                },
              }}
              spaceBetween={20}
              navigation={false}
              pagination={true}
            >
              {(blog) => (
                <BlogChildren
                  key={blog.id} // Add unique key for each item
                  title={blog.title.rendered}
                  featured_media={blog.featured_media}
                  slug={blog.slug}
                />
              )}
            </SwiperItem>
          </div>
        </div>
      </section>
      {/* Back to top */}
      <Button className={`fixed bottom-5 right-5 z-50 transition-all duration-500 transform ${isVisible ? "scale-100 opacity-100 translate-y-0 translate-x-0" : "scale-0 opacity-0 translate-y-10 translate-x-10"}`} onClick={handleBackToTop}>
        <FaCircleArrowUp className="size-12 text-[#dadada] duration-300 hover:text-[#ababab]" />
      </Button>
    </>
  );
}

export default Home;
