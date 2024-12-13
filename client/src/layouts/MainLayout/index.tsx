import { ChildrenType } from "~/types/childrenType";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MainLayout({ children }: ChildrenType) {
  return (
    <>
      <Header />
      <div className="bg-[#f3f4f6] mt-[114px] w-full">{children}</div>
      <Footer />
    </>
  );
}

export default MainLayout;
