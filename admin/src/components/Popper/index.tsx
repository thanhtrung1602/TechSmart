import { ChildrenType } from "~/types/childrenType";

function Wrapper({ children }: ChildrenType) {
    return <div>{children}</div>;
}

export default Wrapper;