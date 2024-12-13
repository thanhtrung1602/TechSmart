import { ChildrenType } from "~/types/childrenType";

function LoginLayout({ children }: ChildrenType) {
    return (
        <section>
            {children}
        </section>
    );
}

export default LoginLayout;