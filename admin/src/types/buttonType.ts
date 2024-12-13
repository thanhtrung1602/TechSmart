import { ReactNode } from "react";

export type ButtonType = {
    children?: ReactNode;
    to?: string | null;
    href?: string | null;
    className?: string;
    onClick?: () => void
}