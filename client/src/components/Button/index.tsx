import { ElementType } from "react";
import { Link } from "react-router-dom";
import { ButtonType } from "~/types/buttonType";

function Button({ children, to, href, className, onClick, ...passProp }: ButtonType) {
    let Component: ElementType = 'button';

    const props: ButtonType = {
        onClick,
        ...passProp,
        children: undefined,
        to: null,
        href: null,
    };

    if (to) {
        props.to = to;
        Component = Link;
    } else if (href) {
        props.href = href;
        Component = 'a';
    }

    return (
        <Component
            className={className}
            {...props}
        >
            {children}
        </Component>
    );
}

export default Button;