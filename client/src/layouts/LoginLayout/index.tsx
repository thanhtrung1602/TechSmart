import { ChildrenType } from "~/types/childrenType";

function LoginLayout({ children }: ChildrenType) {
    return (
        <div>
            {children}
        </div>
    );
}

export default LoginLayout;