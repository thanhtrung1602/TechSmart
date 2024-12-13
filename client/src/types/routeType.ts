import { ReactNode } from "react"

export type Route = {
    path: string;
    component: React.ComponentType;
    layout?: React.FC<{ children: ReactNode }> | null;
}