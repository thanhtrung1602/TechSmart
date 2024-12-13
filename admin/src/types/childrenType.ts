import { ReactNode } from "react";

export type ChildrenType = {
    children: ReactNode;
    to?: string;
    className?: string;
}