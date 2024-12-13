import Products from "./Products";

// Interface defining the additional properties for a cart
interface ICarts {
    userId: number;
    quantity: number;
}

// Carts class extends Products and implements ICarts
class Carts extends Products implements ICarts {
    userId: number;
    quantity: number;
    constructor(
        id: number,
        userId: number,
        categoryId: number,
        manufacturerId: number,
        name: string,
        slug: string,
        quantity: number, // add field for cart
        price: number,
        discount: number,
        img: string,
        stock: number,
        visible: boolean,
        hot: number,
        createdAt: Date,
        updatedAt: Date,
        categoryData: {
            id: number;
            name: string;
            slug: string;
            img: string;
        },
    ) {
        super(
            id,
            categoryId,
            manufacturerId,
            name,
            slug,
            price,
            discount,
            img,
            stock,
            visible,
            hot,
            createdAt,
            updatedAt,
            categoryData
        );
        this.userId = userId;
        this.quantity = quantity;
    }
}

export default Carts;
