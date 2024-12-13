import { ChildrenType } from "~/types/childrenType";
import Header from "../components/Header";
import Nav from "../components/Nav";


function AdminLayout({ children }: ChildrenType) {
    return (
        <>
            <div className='bg-[#F5F6FA]'>
                <Nav />
                <div className="ml-60">
                    <Header />
                    <div className="px-8 py-5">
                        {children}
                    </div>
                </div>
            </div>


        </>
    );
}

export default AdminLayout;