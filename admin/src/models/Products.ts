interface IProducts {
    id: number;
    categoryId: number;
    manufacturerId: number;
    name: string;
    slug: string;
    price: number;
    discount: number;
    img: string;
    stock: number;
    visible: boolean;
    hot: number;
    createdAt: Date;
    updatedAt: Date;
    categoryData: {
        id: number;
        name: string;
        slug: string;
        img: string;
    }
}
class Products implements IProducts {
    id: number;
    categoryId: number;
    manufacturerId: number;
    name: string;
    slug: string;
    price: number;
    discount: number;
    img: string;
    stock: number;
    visible: boolean;
    hot: number;
    createdAt: Date;
    updatedAt: Date;
    categoryData: {
        id: number;
        name: string;
        slug: string;
        img: string;
    }

    constructor(
        id: number,
        categoryId: number,
        manufacturerId: number,
        name: string,
        slug: string,
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
        }
    ) {
        this.id = id;
        this.categoryId = categoryId;
        this.manufacturerId = manufacturerId;
        this.name = name;
        this.slug = slug;
        this.price = price;
        this.discount = discount;
        this.img = img;
        this.stock = stock;
        this.visible = visible;
        this.hot = hot;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.categoryData = categoryData
    }
}

export default Products